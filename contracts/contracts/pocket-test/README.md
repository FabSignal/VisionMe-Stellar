# VisionMe Pocket Contract - Test Suite con DeFindex

## Descripción General

Este documento contiene la suite de pruebas completa para el contrato inteligente **VisionMe Pocket** en la red Stellar Testnet, integrado con el protocolo **DeFindex** para la generación automática de rendimientos sobre depósitos en USDC.

## Propósito

El script `pocket-test-complete.ts` está diseñado para:

1. **Validar la integración** entre el contrato Pocket y el vault de DeFindex
2. **Probar el flujo completo** de creación de pockets y depósitos
3. **Verificar la generación automática** de rendimientos a través de dfTokens
4. **Calcular y proyectar** yields basados en APY del protocolo DeFindex
5. **Monitorear el estado** del vault y los balances en tiempo real

## Arquitectura del Sistema

### Componentes Principales

- **Pocket Contract**: Gestiona los "bolsillos" de ahorro de los usuarios
- **DeFindex Vault**: Protocolo de yield farming que genera rendimientos
- **USDC Token**: Asset base para depósitos y cálculos
- **dfTokens**: Tokens de participación en el vault que representan el capital + rendimientos

### Flujo de Funcionamiento

```
Usuario → Depósito USDC → Pocket Contract → DeFindex Vault → dfTokens
                                                ↓
                                        Generación de Yield
                                                ↓
                                    Incremento del valor de dfTokens
```

## Funcionalidades Implementadas

### 1. Gestión de Contratos

- **`initializeContract()`**: Inicializa el contrato Pocket con las direcciones del vault y asset
- **`invokeContract()`**: Función genérica para invocar métodos de contratos con manejo de errores y confirmación de transacciones

### 2. Operaciones de Pocket

#### Creación y Consulta
- **`createPocket()`**: Crea un nuevo pocket con un objetivo de ahorro definido
- **`getPocket()`**: Obtiene los datos completos de un pocket
- **`getPocketWithYield()`**: Obtiene pocket, valor real y yield en una sola llamada (optimizado)

#### Depósitos y Retiros
- **`deposit()`**: Deposita USDC que automáticamente se invierte en DeFindex
- **`withdraw()`**: Retira dfTokens del pocket

### 3. Análisis de Rendimientos

- **`getRealValue()`**: Calcula el valor actual del pocket incluyendo yield generado
- **`getYieldEarned()`**: Obtiene el rendimiento acumulado
- **`calculateAPY()`**: Calcula el APY (Annual Percentage Yield) actual

### 4. Integración con DeFindex

- **`getVaultBalance()`**: Consulta el balance total del vault de DeFindex
- **`getDfTokenValue()`**: Calcula el valor en USDC de una cantidad de dfTokens

### 5. Utilidades

- **`formatAmount()`**: Formatea cantidades con decimales para visualización
- **`delay()`**: Función auxiliar para esperas entre operaciones

## Configuración

```typescript
const CONFIG = {
  NETWORK_PASSPHRASE: Networks.TESTNET,
  RPC_URL: 'https://soroban-testnet.stellar.org',
  POCKET_CONTRACT_ID: 'CDN7VZRCW3XB6EC2AMX4KFGTXEUCNEKM4AKFEFOF4GO23PE6CW3VUTQN',
  DEFINDEX_VAULT_ID: 'CDVBWOYLVZ34TZOEU7CCGBKV5C6PNDRKWTQEL262LRHWIWYRXA7ENMSC',
  USDC_CONTRACT_ID: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
  DEPOSIT_AMOUNT: '100000000', // 10 USDC
  TARGET_AMOUNT: '10000000000', // 1000 USDC
};
```

## Flujo de Prueba Completo

### PASO 1: Creación de Cuenta
- Genera un keypair aleatorio
- Solicita airdrop de XLM para fees

### PASO 2: Inicialización
- Verifica o inicializa el contrato Pocket
- Configura las direcciones del vault y asset

### PASO 3: Creación de Pocket
- Crea un pocket con objetivo de 1000 USDC
- Obtiene el pocket_id para operaciones posteriores

### PASO 4: Primer Depósito
- Deposita 10 USDC
- El contrato automáticamente invierte en DeFindex
- Recibe dfTokens a cambio

### PASO 5: Verificación Post-Depósito
- Consulta el estado del pocket
- Verifica la cantidad de dfTokens recibidos
- Calcula el progreso hacia el objetivo

### PASO 6: Consulta del Vault
- Obtiene el balance total administrado por DeFindex
- Consulta el total de shares (dfTokens emitidos)
- Verifica las fees del vault

### PASO 7: Cálculo de Valor Real
- Calcula el valor actual de los dfTokens
- Compara con el monto depositado
- Determina el yield generado

### PASO 8: Segundo Depósito
- Deposita 5 USDC adicionales
- Actualiza el balance de dfTokens

### PASO 9: Balance Actualizado
- Muestra el total depositado
- Calcula el progreso total

### PASO 10: Proyección de Rendimientos
- Proyecta yields basados en 6% APY típico
- Muestra rendimientos esperados para 1 día, 7 días, 30 días y 1 año

## Datos de Salida

El test proporciona información detallada sobre:

- ✅ **Confirmación de transacciones** con hashes y links a Stellar Expert
- 📊 **Progreso del pocket** hacia el objetivo
- 💎 **Cantidad de dfTokens** acumulados
- 📈 **Valor real** del pocket (capital + yield)
- ✨ **Yield generado** en USDC
- 💹 **Porcentaje de rendimiento** actual
- 🏦 **Estado del vault** de DeFindex

## Casos de Uso

### 1. Reporte de Rendimientos Completo

```typescript
const pocketData = await getPocket(pocketId, caller);
const realValue = await getRealValue(pocketId, caller);
const yieldEarned = await getYieldEarned(pocketId, caller);
const apy = await calculateAPY(pocketId, caller);
```

### 2. Consulta Optimizada

```typescript
const { pocket, realValue, yieldEarned } = await getPocketWithYield(pocketId, caller);
```

## Monitoreo en Tiempo Real

El script proporciona links para:

- **Stellar Expert**: Visualizar transacciones y operaciones
- **DeFindex Dashboard**: Monitorear el estado del vault (si está disponible)
- **Consultas periódicas**: Verificar el crecimiento del yield

## Consideraciones Importantes

### Generación de Yield
- Los rendimientos se acumulan con el tiempo
- El APY típico es de 5-8%
- Se recomienda esperar 24-48 horas para ver rendimientos significativos

### Cálculo de Valor
La fórmula para calcular el valor real es:
```
valor_actual = (dfTokens × total_managed_funds) / total_shares
yield = valor_actual - current_amount
```

### Manejo de Errores
- Validación de simulación antes de envío
- Timeout de 180 segundos para operaciones complejas
- Fees elevados (10,000,000 stroops) para garantizar ejecución

## Estructura de Datos

### PocketData
```typescript
interface PocketData {
  owner: string;           // Dirección del propietario
  asset: string;           // Dirección del token (USDC)
  goal_amount: bigint;     // Objetivo de ahorro
  current_amount: bigint;  // Cantidad depositada
  df_tokens: bigint;       // dfTokens acumulados
  first_deposit?: bigint;  // Timestamp del primer depósito
  last_deposit?: bigint;   // Timestamp del último depósito
}
```

### VaultBalance
```typescript
interface VaultBalance {
  total_managed_funds: bigint;  // Total de fondos en el vault
  fee: bigint;                  // Comisión del vault
  total_shares: bigint;         // Total de dfTokens emitidos
}
```

## Dependencias

```json
{
  "@stellar/stellar-sdk": "^12.x"
}
```

## Ejecución

```bash
ts-node pocket-test-complete.ts
```

## Resultado Esperado

Al finalizar exitosamente, el script muestra:

- ✅ Confirmación de todas las operaciones
- 📊 Resumen completo del pocket
- �� Instrucciones para verificar el yield en el futuro
- 🔗 Links a exploradores de blockchain
- 📈 Proyecciones de rendimiento

## Notas de Versión

Este archivo corresponde a una **versión de prueba completa** que incluye:
- Integración real con DeFindex en Testnet
- Cálculos de yield y APY
- Monitoreo del vault
- Proyecciones de rendimiento

Para versiones de producción, se deben ajustar:
- Configuración de red (Mainnet)
- Direcciones de contratos
- Parámetros de fees y timeouts
- Manejo de errores para entorno productivo

---

**Repositorio**: [VisionMe-Stellar](https://github.com/FabSignal/VisionMe-Stellar)

**Red**: Stellar Testnet

**Última actualización**: 2025
