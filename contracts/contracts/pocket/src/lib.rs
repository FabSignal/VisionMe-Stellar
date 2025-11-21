#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol,
};

// Estructura que guarda los datos de cada "pocket" (bolsillo de ahorro)
#[contracttype]
#[derive(Clone)]
pub struct PocketData {
    pub owner: Address,         // Dueño del pocket
    pub asset: Address,         // Token que se ahorra
    pub goal_amount: i128,      // Meta de ahorro
    pub current_amount: i128,   // Cantidad actual (contador lógico)
}

// Claves para guardar datos en storage
#[contracttype]
pub enum DataKey {
    Pocket(i128),    // pocket_id -> PocketData
    NextPocketId,    // Próximo ID disponible
}

#[contract]
pub struct PocketContract;

#[contractimpl]
impl PocketContract {
    /// Crear un nuevo pocket de ahorro
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

        // Actualizar cantidad
        pocket.current_amount += amount;

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
    pub fn withdraw(env: Env, pocket_id: i128, to: Address, amount: i128) {
        to.require_auth();

        if amount <= 0 {
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

        if pocket.current_amount < amount {
            panic!("Insufficient balance");
        }

        pocket.current_amount -= amount;

        env.storage()
            .persistent()
            .set(&DataKey::Pocket(pocket_id), &pocket);

        env.events().publish(
            (Symbol::new(&env, "withdraw"),),
            (pocket_id, to, amount),
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