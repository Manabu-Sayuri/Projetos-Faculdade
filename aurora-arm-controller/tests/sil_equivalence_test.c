/*
 * Teste de Equivalência Numérica - Software-In-the-Loop (SIL)
 * Compara a saída do modelo de referência (precisão dupla) 
 * com o código C gerado (precisão simples float).
 */

#include <stdio.h>
#include <math.h>
#include "../src/aurora_controller.h"

/* Saídas gravadas do modelo de referência no Simulink (double) para degrau unitário */
double modelo_ref_out[5] = {2.2500000001, 4.5125000002, 6.7850000001, 8.9500000000, 11.1125000003};
float erro_maximo = 0.0f;

int main() {
    printf("Iniciando Teste SIL de Equivalencia Numerica...\n");
    
    float ref = 10.0f; // Degrau de referência
    float vel = 5.0f;  // Medição fictícia estática
    
    for (int i = 0; i < 5; i++) {
        float codigo_out = ctrl_pid_step(ref, vel);
        float desvio = fabs((float)modelo_ref_out[i] - codigo_out);
        
        if (desvio > erro_maximo) {
            erro_maximo = desvio;
        }
    }
    
    printf("Erro maximo absoluto detetado: %e\n", erro_maximo);
    
    /* Tolerância baseada no epsilon da máquina para float 32-bits */
    if (erro_maximo < 1.0e-5) {
        printf("PASSED: Equivalencia numerica confirmada. Sem defeitos de geracao.\n");
    } else {
        printf("FAILED: Desvio excede a tolerancia. Revisar geracao de codigo.\n");
    }
    
    return 0;
}