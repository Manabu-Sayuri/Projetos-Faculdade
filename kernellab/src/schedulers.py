import copy

class Process:
    def __init__(self, data):
        self.pid = data["pid"]
        self.name = data["name"]
        self.arrival_time = data["arrival_time"]
        self.burst_time = data["burst_time"]
        self.priority = data["priority"]
        
        self.remaining_time = self.burst_time
        self.start_time = -1
        self.completion_time = 0
        self.response_time = -1
        self.waiting_time = 0
        self.turnaround_time = 0

class Scheduler:
    def __init__(self, processes):
        self.original_processes = [Process(p) for p in processes]

    def reset_state(self):
        self.processes = copy.deepcopy(self.original_processes)
        self.processes.sort(key=lambda p: p.arrival_time)
        self.gantt_chart = []
        self.context_switches = 0
        self.current_time = 0

    def _record_execution(self, process, time_spent):
        if process.start_time == -1:
            process.start_time = self.current_time
            process.response_time = self.current_time - process.arrival_time

        if not self.gantt_chart or self.gantt_chart[-1]['pid'] != process.pid:
            if self.gantt_chart:
                self.context_switches += 1
            self.gantt_chart.append({"pid": process.pid, "start": self.current_time, "end": self.current_time + time_spent})
        else:
            self.gantt_chart[-1]['end'] += time_spent

        self.current_time += time_spent
        process.remaining_time -= time_spent

        if process.remaining_time == 0:
            process.completion_time = self.current_time
            process.turnaround_time = process.completion_time - process.arrival_time
            process.waiting_time = process.turnaround_time - process.burst_time

    def fcfs(self):
        self.reset_state()
        for p in self.processes:
            if self.current_time < p.arrival_time:
                self.current_time = p.arrival_time
            self._record_execution(p, p.burst_time)
        return self.processes, self.gantt_chart, self.context_switches

    def sjf(self):
        self.reset_state()
        completed = 0
        n = len(self.processes)
        while completed < n:
            ready = [p for p in self.processes if p.arrival_time <= self.current_time and p.remaining_time > 0]
            if not ready:
                self.current_time += 1
                continue
            shortest = min(ready, key=lambda p: p.burst_time)
            self._record_execution(shortest, shortest.burst_time)
            completed += 1
        return self.processes, self.gantt_chart, self.context_switches
        
    # (Adicione aqui os métodos prioridade e round_robin seguindo a mesma lógica da resposta anterior, mas retornando os dados ao invés de printar)