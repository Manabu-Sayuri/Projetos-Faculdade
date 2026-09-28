import threading
import time
from queue import Queue

class DeviceManager:
    def __init__(self):
        # 1. Criação do Mutex para cada dispositivo. 
        # O Lock garante que apenas uma thread acesse o recurso por vez.
        self.mutexes = {
            "Disco": threading.Lock(),
            "Rede": threading.Lock(),
            "Áudio": threading.Lock(),
            "Log": threading.Lock()
        }
        
        # 2. Fila simples para armazenar o histórico de requisições
        self.request_queue = Queue()

    def process_request(self, process_name, device, mode, duration):
        # Registra a intenção de acesso na fila
        self.request_queue.put(f"[{process_name}] Solicitou {device} em modo {mode}")
        print(f"🕒 [{process_name}] Aguardando acesso ao {device}...")
        
        # O bloco 'with' adquire o Mutex (lock.acquire()) e só libera (lock.release()) no final
        with self.mutexes[device]:
            print(f"✅ [{process_name}] ACESSO CONCEDIDO ao {device} ({mode}).")
            time.sleep(duration) # Simula o uso real do dispositivo
            print(f"❌ [{process_name}] LIBEROU o {device}.")

    def simulate_disk_concurrency(self):
        print("\n--- Simulação de Concorrência no DISCO ---")
        threads = []
        
        # Simulando os 3 processos que usam o Disco tentando acessar AO MESMO TEMPO
        # Parametros: Nome do processo, Dispositivo, Modo de Acesso, Tempo de uso (segundos)
        t1 = threading.Thread(target=self.process_request, args=("P3 (Relatórios)", "Disco", "L/G", 1.5))
        t2 = threading.Thread(target=self.process_request, args=("P5 (Backup)", "Disco", "Exclusivo", 2.0))
        t3 = threading.Thread(target=self.process_request, args=("P6 (Atualização)", "Disco", "L/G", 1.0))

        threads.extend([t1, t2, t3])

        # Dispara todas as solicitações simultaneamente
        for t in threads:
            t.start()
        
        # Aguarda todas terminarem
        for t in threads:
            t.join()
            
        print("--- Simulação de Disco Concluída ---\n")