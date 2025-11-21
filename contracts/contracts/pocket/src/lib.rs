#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol, vec,
};

mod defindex_vault;
use defindex_vault::DeFindexVaultClient;

// Estructura que guarda los datos de cada "pocket" (bolsillo de ahorro)
#[contracttype]
#[derive(Clone)]
pub struct PocketData {
    pub owner: Address,         // Dueño del pocket
    pub asset: Address,         // Token que se ahorra
    pub goal_amount: i128,      // Meta de ahorro
    pub current_amount: i128,   // Cantidad actual (contador lógico)
    pub df_tokens: i128,
    pub first_deposit: Option<u64>,
    pub last_deposit: Option<u64>
}

// Claves para guardar datos en storage
#[contracttype]
pub enum DataKey {
    Pocket(i128),    // pocket_id -> PocketData
    NextPocketId,    // Próximo ID disponible
    Vault,
    Asset
}

#[contract]
pub struct PocketContract;

#[contractimpl]
impl PocketContract {
    /// Crear un nuevo pocket de ahorro
    pub fn __constructor(env: Env, vault: Address, asset: Address){
        env.storage()
            .instance()
            .set(&DataKey::Vault, &vault);

        env.storage()
            .instance()
            .set(&DataKey::Asset, &asset);
    }

    pub fn create_pocket(
        env: Env,
        owner: Address,
        asset: Address,
        goal_amount: i128,
    ) -> i128 {
        // El usuario debe firmar esta transacción
        owner.require_auth();

        // Obtener el próximo ID
        let next_id: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::NextPocketId)
            .unwrap_or(1);

        // Crear el pocket
        let pocket = PocketData {
            owner: owner.clone(),
            asset,
            goal_amount,
            current_amount: 0,
            df_tokens: 0,
            first_deposit: None,
            last_deposit: None
        };

        // Guardar en storage
        env.storage()
            .persistent()
            .set(&DataKey::Pocket(next_id), &pocket);

        // Incrementar el ID para el próximo pocket
        env.storage()
            .persistent()
            .set(&DataKey::NextPocketId, &(next_id + 1));

        // Emitir evento
        env.events().publish(
            (Symbol::new(&env, "pocket_created"),),
            (owner, next_id, goal_amount),
        );

        next_id
    }

    /// Depositar en un pocket (incrementa el contador)
    pub fn deposit(env: Env, pocket_id: i128, from: Address, amount: i128) {
        from.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::Asset).unwrap();
        let vault_address: Address = env.storage().instance().get(&DataKey::Vault).unwrap();

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // Obtener el pocket
        let mut pocket: PocketData = env
            .storage()
            .persistent()
            .get(&DataKey::Pocket(pocket_id))
            .expect("Pocket not found");

        // Verificar que es el dueño
        if pocket.owner != from {
            panic!("Only owner can deposit");
        }

        if pocket.first_deposit == None {
            pocket.first_deposit = Some(env.ledger().timestamp())
        }

        let defindex_vault_client = DeFindexVaultClient::new(&env, &vault_address);

        // Deposit into vault - user's signature authorizes vault to transfer from their account
        let (_, df_tokens, _) = defindex_vault_client.deposit(
            &vec![&env, amount],  // Amounts array (for multi-asset vaults; currently single-asset)
            &vec![&env, 0],                      // Minimum amounts out (slippage protection for multi-asset vaults)
            &from,                            // Depositor (receives vault shares)
            &true                              // invest: false = keep as idle in vault; true = invest into strategy
        );
        
        // Actualizar cantidad
        pocket.current_amount += amount;
        pocket.df_tokens += df_tokens;
        pocket.last_deposit = Some(env.ledger().timestamp());

        // Guardar
        env.storage()
            .persistent()
            .set(&DataKey::Pocket(pocket_id), &pocket);

        env.events().publish(
            (Symbol::new(&env, "deposit"),),
            (pocket_id, from, amount),
        );
    }

    /// Retirar de un pocket (decrementa el contador)
    pub fn withdraw(env: Env, pocket_id: i128, to: Address, df_tokens_amount: i128) {
        to.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::Asset).unwrap();
        let vault_address: Address = env.storage().instance().get(&DataKey::Vault).unwrap();

        if df_tokens_amount <= 0 {
            panic!("Amount must be positive");
        }

        let mut pocket: PocketData = env
            .storage()
            .persistent()
            .get(&DataKey::Pocket(pocket_id))
            .expect("Pocket not found");

        if pocket.owner != to {
            panic!("Only owner can withdraw");
        }

        if pocket.df_tokens < df_tokens_amount {
            panic!("Insufficient balance");
        }

        
        let defindex_vault_client = DeFindexVaultClient::new(&env, &vault_address);

        let amounts_withdrawn = defindex_vault_client.withdraw(
            &df_tokens_amount,  // df tokens amount to withdraw 
            &vec![&env, 0],                      // Minimum amounts out (slippage protection for multi-asset vaults)
            &to,                            // withdrawer (receives vault shares)
        );
        
        pocket.current_amount = pocket.current_amount - amounts_withdrawn.get(0).unwrap();
        pocket.df_tokens = pocket.df_tokens - df_tokens_amount;

        env.storage()
            .persistent()
            .set(&DataKey::Pocket(pocket_id), &pocket);

        env.events().publish(
            (Symbol::new(&env, "withdraw"),),
            (pocket_id, to, amounts_withdrawn),
        );
    }

    /// Consultar datos de un pocket
    pub fn get_pocket(env: Env, pocket_id: i128) -> PocketData {
        env.storage()
            .persistent()
            .get(&DataKey::Pocket(pocket_id))
            .expect("Pocket not found")
    }
}

///Tests
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_create_pocket() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, PocketContract);
        let client = PocketContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let asset = Address::generate(&env);
        let goal: i128 = 1_000_000;

        let pocket_id = client.create_pocket(&owner, &asset, &goal);
        
        assert_eq!(pocket_id, 1);
    }

    #[test]
    fn test_deposit() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, PocketContract);
        let client = PocketContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let asset = Address::generate(&env);

        let pocket_id = client.create_pocket(&owner, &asset, &1_000_000);
        client.deposit(&pocket_id, &owner, &100_000);

        let pocket = client.get_pocket(&pocket_id);
        assert_eq!(pocket.current_amount, 100_000);
    }

    #[test]
    fn test_withdraw() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, PocketContract);
        let client = PocketContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let asset = Address::generate(&env);

        let pocket_id = client.create_pocket(&owner, &asset, &1_000_000);
        client.deposit(&pocket_id, &owner, &100_000);
        client.withdraw(&pocket_id, &owner, &50_000);

        let pocket = client.get_pocket(&pocket_id);
        assert_eq!(pocket.current_amount, 50_000);
    }

    #[test]
    fn test_multiple_pockets() {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, PocketContract);
        let client = PocketContractClient::new(&env, &contract_id);

        let owner = Address::generate(&env);
        let asset = Address::generate(&env);

        let pocket_1 = client.create_pocket(&owner, &asset, &1_000_000);
        let pocket_2 = client.create_pocket(&owner, &asset, &2_000_000);

        assert_eq!(pocket_1, 1);
        assert_eq!(pocket_2, 2);
    }
}