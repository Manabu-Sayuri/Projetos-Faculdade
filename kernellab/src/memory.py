class MemoryManager:
    def __init__(self, num_frames=4):
        self.num_frames = num_frames

    def fifo(self, pages):
        frames = []
        faults, hits = 0, 0
        
        for page in pages:
            if page in frames:
                hits += 1
            else:
                faults += 1
                if len(frames) >= self.num_frames:
                    frames.pop(0)
                frames.append(page)
        return hits, faults

    def lru(self, pages):
        frames = []
        faults, hits = 0, 0
        
        for page in pages:
            if page in frames:
                hits += 1
                frames.remove(page)
                frames.append(page) # Move para o topo como mais recente
            else:
                faults += 1
                if len(frames) >= self.num_frames:
                    frames.pop(0)
                frames.append(page)
        return hits, faults