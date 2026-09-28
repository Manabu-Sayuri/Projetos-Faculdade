import sys
import os
import unittest

# Adiciona a pasta src ao caminho do Python para conseguir importar os módulos
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from memory import MemoryManager

class TestMemoryManager(unittest.TestCase):
    def test_fifo_faults(self):
        mem = MemoryManager(num_frames=4)
        pages = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
        hits, faults = mem.fifo(pages)
        # Verifica se o algoritmo calcula os faults corretamente para esta sequência
        self.assertEqual(faults, 10)

if __name__ == '__main__':
    unittest.main()