import tkinter as tk
from tkinter import messagebox
from captura import capturar_dados_clima
from planilha import salvar_dados_em_planilha

def executar_coleta():
    try:
        dados = capturar_dados_clima()
        salvar_dados_em_planilha(dados)
        mensagem = (
            f"Dados capturados com sucesso!\n\n"
            f"🌡️ Temp. Máxima: {dados['temperatura_max']}\n"
            f"🌡️ Temp. Mínima: {dados['temperatura_min']}\n"
            f"💧 Umid. Máxima: {dados['umidade_max']}\n"
            f"💧 Umid. Mínima: {dados['umidade_min']}"
        )
        messagebox.showinfo("Sucesso", mensagem)
    except Exception as e:
        messagebox.showerror("Erro", f"Erro ao capturar ou salvar dados:\n{str(e)}")

# Janela principal
janela = tk.Tk()
janela.title("Captador de Temperatura - São Paulo")
janela.geometry("400x200")

# Título
titulo = tk.Label(janela, text="Captador de Temperatura e Umidade", font=("Arial", 14), pady=20)
titulo.pack()

# Botão
botao = tk.Button(janela, text="Buscar dados agora", command=executar_coleta, font=("Arial", 12), bg="#4CAF50", fg="white", padx=10, pady=5)
botao.pack()

# Inicia a janela
janela.mainloop()