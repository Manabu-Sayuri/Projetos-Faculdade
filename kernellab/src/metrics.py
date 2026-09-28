def print_cpu_metrics(name, processes, gantt, context_switches):
    print(f"\n--- {name} ---")
    gantt_str = " | ".join([f"{g['pid']}({g['start']}-{g['end']})" for g in gantt])
    print(f"Gantt: | {gantt_str} |")
    
    n = len(processes)
    t_wait = sum(p.waiting_time for p in processes)
    t_turnaround = sum(p.turnaround_time for p in processes)
    
    print(f"Tempo Médio de Espera: {t_wait/n:.2f}")
    print(f"Tempo Médio de Retorno: {t_turnaround/n:.2f}")
    print(f"Trocas de Contexto: {context_switches}")

def print_memory_metrics(name, hits, faults):
    total = hits + faults
    taxa = (faults / total) * 100 if total > 0 else 0
    print(f"{name} -> Hits: {hits} | Faults: {faults} | Taxa de Faltas: {taxa:.2f}%")