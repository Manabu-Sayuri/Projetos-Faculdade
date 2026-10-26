% Projeto do Controlador e Modelo da Planta - AuroraArm
% Baseado nos parâmetros físicos identificados na bancada de ensaio

%% 1. Parâmetros da Planta
R = 0.8;          % Resistência de armadura (Ohms)
L = 1.2e-3;       % Indutância de armadura (H)
Kt = 0.085;       % Constante de torque (Nm/A)
Ke = 0.085;       % Constante de f.c.e.m (Vs/rad)
J = 4.2e-4;       % Inércia refletida (kg.m^2)
b = 1.5e-4;       % Atrito viscoso (N.ms/rad)

%% 2. Matrizes de Espaço de Estados (Tempo Contínuo)
% Estados: x1 = corrente (i), x2 = velocidade angular (w)
% Entrada: u = Tensão (V)
% Saída: y = Velocidade angular (w)

A = [-R/L, -Ke/L; 
     Kt/J, -b/J];
B = [1/L; 
     0];
C = [0, 1];
D = 0;

sys_c = ss(A, B, C, D);
disp('Matriz A:'); disp(A);
disp('Matriz B:'); disp(B);

%% 3. Discretização e Controlador (Ts = 2 ms)
Ts = 0.002; % Período de amostragem de 2 ms (REQ-CTRL-AA-003)
sys_d = c2d(sys_c, Ts, 'zoh');

% Sintonia do PID Discreto para atender:
% REQ-CTRL-AA-001 (Erro Nulo) e REQ-CTRL-AA-002 (Sobressinal < 8%)
% Valores sintonizados via rlocus/PID Tuner
Kp = 0.45;
Ki = 12.5;
Kd = 0.001;

% Saturação de Atuador e Anti-windup (REQ-CTRL-AA-004)
V_max = 48; % Limite do barramento de 48V
I_max = 8;  % Limite de corrente de 8A

% O ganho de anti-windup (Aw) utilizando o método back-calculation
Kaw = 1 / Kp; 

disp('Controlador PID Discreto projetado com Back-Calculation Anti-Windup.');