import json
import os
from schedulers import Scheduler
from memory import MemoryManager
from metrics import print_cpu_metrics, print_memory_metrics
from devices import DeviceManager

def load_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    print("=== KernelLab Iniciado ===")
    
    # 1. Carregar processos
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'processes.json')
    process_data = load_data(data_path)
    
    # 2. Executar CPU (Etapa 1)
    print("\n[ETAPA 1 e 2] Simulação de CPU")
    scheduler = Scheduler(process_data)
    
    p_fcfs, g_fcfs, cs_fcfs = scheduler.fcfs()
    print_cpu_metrics("FCFS", p_fcfs, g_fcfs, cs_fcfs)
    
    p_sjf, g_sjf, cs_sjf = scheduler.sjf()
    print_cpu_metrics("SJF", p_sjf, g_sjf, cs_sjf)

    # 3. Executar Memória (Etapa 3)
    print("\n[ETAPA 3] Simulação de Memória")
    pages = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5, 2, 1, 5, 3, 2]
    mem = MemoryManager(num_frames=4)
    
    hits_f, faults_f = mem.fifo(pages)
    print_memory_metrics("FIFO", hits_f, faults_f)
    
    hits_l, faults_l = mem.lru(pages)
    print_memory_metrics("LRU", hits_l, faults_l)

    # 4. Executar Dispositivos (Etapa 4)
    print("\n[ETAPA 4] Controle de Dispositivos (Concorrência)")
    devices = DeviceManager()
    devices.simulate_disk_concurrency()    

if __name__ == "__main__":
    main()