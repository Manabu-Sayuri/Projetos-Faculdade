# Matriz de Rastreabilidade (Traceability Matrix)

| ID Requisito | Descrição Curta | Componente do Modelo (Simulink/Stateflow) | Função no Código C | Caso de Teste Associado |
| :--- | :--- | :--- | :--- | :--- |
| REQ-CTRL-AA-001 | Erro nulo em regime | `PID_Discreto/Integrador` | `ctrl_pid_step()` (termo_i) | `test_steady_state.c` |
| REQ-CTRL-AA-002 | Sobressinal < 8% | `PID_Discreto/Anti-Windup` | `ctrl_pid_step()` (erro_saturacao)| `test_step_response.c` |
| REQ-CTRL-AA-003 | Acomodação < 300ms | `Malha_Fechada/Ganhos` | `ctrl_pid_step()` (Ts=0.002) | `test_settling_time.c` |
| REQ-CTRL-AA-004 | Limites 48V / 8A | `PID_Discreto/Saturacao` | `ctrl_pid_step()` (Clamp/V_MAX) | `test_saturation_limits.c` |
| REQ-SAFE-AA-001 | Zera torque < 100ms | `Supervisor_FSM/Trans_Parada` | `safe_torque_off()` | `TC-01 (coverage_report)` |
| REQ-SAFE-AA-002 | Exige rearme manual | `Supervisor_FSM/Est_Aguarda` | `safe_wait_reset()` | `TC-02 (coverage_report)` |
| REQ-SAFE-AA-003 | Retoma após rearme | `Supervisor_FSM/Trans_Retoma` | `safe_resume_traj()` | `TC-03 (coverage_report)` |
| REQ-SAFE-AA-004 | Velocidade < 250mm/s| `Monitor_Cinematico/Limitador`| `safe_vel_limit()` | `test_max_linear_vel.c` |