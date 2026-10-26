# Relatório de Cobertura de Testes (Supervisor de Segurança)

**Método de Geração:** Testes gerados a partir do modelo de autómato (Model-Based Testing).

## Grafo de Estados do Supervisor:
1. `ESTADO_OP_NORMAL`
2. `ESTADO_PARADA_EMERGENCIA`
3. `ESTADO_AGUARDA_REARME`

## Cobertura de Transições e Estados:

| ID Teste | Caminho Testado (Transições) | Requisito Validado | Resultado |
| :--- | :--- | :--- | :--- |
| TC-01 | `ESTADO_OP_NORMAL` -> Deteção -> `ESTADO_PARADA_EMERGENCIA` | REQ-SAFE-AA-001 | PASSED |
| TC-02 | `ESTADO_PARADA_EMERGENCIA` -> Zera Torque -> `ESTADO_AGUARDA_REARME` | REQ-SAFE-AA-002 | PASSED |
| TC-03 | `ESTADO_AGUARDA_REARME` -> Botão Rearme -> `ESTADO_OP_NORMAL` | REQ-SAFE-AA-003 | PASSED |
| TC-04 | `ESTADO_AGUARDA_REARME` -> Ignora Retoma Automática (Timeout) | REQ-SAFE-AA-002 | PASSED |

**Métricas Finais:**
* Cobertura de Estados: 3/3 (100%)
* Cobertura de Transições: 4/4 (100%)