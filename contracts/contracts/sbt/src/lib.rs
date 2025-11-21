#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol, String,
};

// Metadata del SBT (Soul Bound Token)
#[contracttype]
#[derive(Clone)]
pub struct SBTMetadata {
    pub streak_days: i128,
    pub minted_at: u64,
}

// Claves para storage
#[contracttype]
pub enum DataKey {
    Admin,              // Dirección del administrador
    SBTOwner(Address),  // address -> metadata (si tiene SBT)
}

#[contract]
pub struct SBTContract;

#[contractimpl]
impl SBTContract {
    /// Inicializar el contrato con un admin
    pub fn init(env: Env, admin: Address) {
        // Verificar que no esté ya inicializado
        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("Already initialized");
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Mintear un SBT para un usuario (solo admin)
    pub fn mint(env: Env, to: Address, streak_days: i128) {
        // Obtener admin
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Not initialized");

        // Verificar que quien llama es el admin
        admin.require_auth();

        // Verificar que el usuario no tenga ya un SBT
        if env.storage().persistent().has(&DataKey::SBTOwner(to.clone())) {
            panic!("User already has SBT");
        }

        // Crear metadata
        let metadata = SBTMetadata {
            streak_days,
            minted_at: env.ledger().timestamp(),
        };

        // Guardar el SBT
        env.storage()
            .persistent()
            .set(&DataKey::SBTOwner(to.clone()), &metadata);

        // Emitir evento
        env.events().publish(
            (Symbol::new(&env, "sbt_minted"),),
            (to, streak_days),
        );
    }

    /// Verificar si una dirección tiene SBT
    pub fn has_sbt(env: Env, owner: Address) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::SBTOwner(owner))
    }

    /// Obtener metadata del SBT (si existe)
    pub fn get_sbt(env: Env, owner: Address) -> SBTMetadata {
        env.storage()
            .persistent()
            .get(&DataKey::SBTOwner(owner))
            .expect("No SBT found")
    }

    /// Cambiar el admin (solo admin actual)
    pub fn update_admin(env: Env, new_admin: Address) {
        let current_admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Not initialized");

        current_admin.require_auth();

        env.storage().persistent().set(&DataKey::Admin, &new_admin);

        env.events().publish(
            (Symbol::new(&env, "admin_updated"),),
            (current_admin, new_admin),
        );
    }
}

///Tests

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_init_and_mint() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SBTContract);
        let client = SBTContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.init(&admin);
        client.mint(&user, &90);

        assert!(client.has_sbt(&user));
    }

    #[test]
    fn test_no_sbt_initially() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SBTContract);
        let client = SBTContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.init(&admin);

        assert!(!client.has_sbt(&user));
    }

    #[test]
    fn test_get_sbt_metadata() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SBTContract);
        let client = SBTContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.init(&admin);
        client.mint(&user, &90);

        let metadata = client.get_sbt(&user);
        assert_eq!(metadata.streak_days, 90);
    }

    #[test]
    fn test_update_admin() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SBTContract);
        let client = SBTContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let new_admin = Address::generate(&env);

        client.init(&admin);
        client.update_admin(&new_admin);

        // El nuevo admin debería poder mintear
        let user = Address::generate(&env);
        client.mint(&user, &30);
        assert!(client.has_sbt(&user));
    }
}