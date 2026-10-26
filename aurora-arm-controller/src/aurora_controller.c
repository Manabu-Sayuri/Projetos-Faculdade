/*
 * Ficheiro: aurora_controller.c
 * Código gerado automaticamente via Embedded Coder (Simulado)
 * Data: 26-Out-2026
 * Alvo: ARM Cortex-M4 (FPU 32-bits)
 * Período de Amostragem: 0.002 s
 * 
 * RASTREABILIDADE DE REQUISITOS:
 * - REQ-CTRL-AA-001: Erro de posição nulo (Malha integral presente).
 * - REQ-CTRL-AA-004: Limite de tensão 48V (Saturação Clamp explícita).
 */

#include "aurora_controller.h"

/* Variáveis de Estado do Controlador */
static float erro_integral = 0.0f;
static float erro_anterior = 0.0f;

/* Ganhos do Controlador (Carregados do Modelo) */
const float KP = 0.45f;
const float KI = 12.5f;
const float KD = 0.001f;
const float K_AW = 2.22f; /* 1/Kp para Back-calculation */
const float TS = 0.002f;
const float V_MAX = 48.0f;
const float V_MIN = -48.0f;

/* Função de passo de controlo (Executada a 500Hz / 2ms) */
float ctrl_pid_step(float referencia, float velocidade_medida) {
    float erro = referencia - velocidade_medida;
    
    /* Ação Proporcional e Derivativa */
    float termo_p = KP * erro;
    float termo_d = KD * (erro - erro_anterior) / TS;
    
    /* Ação Integral */
    float termo_i = KI * erro_integral;
    
    /* Comando de Tensão Não-Saturado */
    float v_comando = termo_p + termo_i + termo_d;
    float v_saida = v_comando;
    
    /* REQ-CTRL-AA-004: Saturação de Tensão (Clamp) */
    if (v_saida > V_MAX) {
        v_saida = V_MAX;
    } else if (v_saida < V_MIN) {
        v_saida = V_MIN;
    }
    
    /* Tratamento Anti-Windup (Back-calculation) */
    float erro_saturacao = v_comando - v_saida;
    
    /* Atualização dos estados para o próximo ciclo */
    erro_integral = erro_integral + (erro * TS) - (K_AW * erro_saturacao * TS);
    erro_anterior = erro;
    
    return v_saida;
}