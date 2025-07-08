from flask import Flask, render_template, request, redirect, session, url_for
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'minha_chave_secreta'

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='estoque'
    )

@app.route('/')
def login():
    erro = session.pop('erro', None)
    return render_template('login.html', erro=erro)

@app.route('/verifica_login', methods=['POST'])
def verifica_login():
    email = request.form['email']
    senha = request.form['senha']

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
    usuario = cursor.fetchone()
    conn.close()

    if usuario and check_password_hash(usuario['senha'], senha):
        session['nome'] = usuario['nome']
        session['sobrenome'] = usuario['sobrenome']
        session['email'] = usuario['email']
        session['tipo'] = usuario['tipo']
        return redirect(url_for('pagina_adm')) if usuario['tipo'] == 'ADM' else redirect(url_for('usuario'))
    else:
        session['erro'] = 'Senha incorreta ou usuário não encontrado.'
        return redirect(url_for('login'))

@app.route('/adm')
def pagina_adm():
    if session.get('tipo') == 'ADM':
        primeiro_nome = session['nome']
        tipo = session['tipo']
        return render_template('adm.html', nome=primeiro_nome, tipo=tipo)
    return redirect('/')

@app.route('/adicionar_usuario', methods=['GET', 'POST'])
def adicionar_usuario():
    if session.get('tipo') != 'ADM':
        return redirect('/')

    if request.method == 'POST':
        nome = request.form['nome']
        sobrenome = request.form['sobrenome']
        email = request.form['email']
        senha = generate_password_hash(request.form['senha'], method='pbkdf2:sha256')
        tipo = request.form['tipo']

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO usuarios (nome, sobrenome, email, senha, tipo) VALUES (%s, %s, %s, %s, %s)',
                       (nome, sobrenome, email, senha, tipo))
        conn.commit()
        conn.close()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM usuarios')
    usuarios = cursor.fetchall()
    conn.close()

    return render_template('adicionar_usuario.html', usuarios=usuarios)

@app.route('/excluir_usuario/<int:id>', methods=['POST'])
def excluir_usuario(id):
    if session.get('tipo') != 'ADM':
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
    conn.commit()
    conn.close()

    return redirect(url_for('adicionar_usuario'))

@app.route('/atualizar_tipo_usuario', methods=['POST'])
def atualizar_tipo_usuario():
    if session.get('tipo') != 'ADM':
        return redirect(url_for('login'))

    id = request.form['id']
    novo_tipo = request.form['tipo']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE usuarios SET tipo = %s WHERE id = %s", (novo_tipo, id))
    conn.commit()
    conn.close()

    return redirect(url_for('adicionar_usuario'))

@app.route('/adicionar_produto', methods=['GET', 'POST'])
def adicionar_produto():
    if 'email' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        quantidade = request.form['quantidade']
        cursor.execute("INSERT INTO produtos (nome, quantidade) VALUES (%s, %s)", (nome, quantidade))
        conn.commit()
        session['mensagem_produto'] = "Produto cadastrado com sucesso!"

    cursor.execute("SELECT * FROM produtos")
    produtos = cursor.fetchall()
    conn.close()

    mensagem = session.pop('mensagem_produto', None)
    return render_template('adicionar_produto.html', produtos=produtos, mensagem=mensagem)

@app.route('/atualizar_quantidade', methods=['POST'])
def atualizar_quantidade():
    if 'email' not in session:
        return redirect(url_for('login'))

    produto_id = request.form['id']
    operacao = request.form['operacao']
    valor = int(request.form['valor'])

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT quantidade FROM produtos WHERE id = %s", (produto_id,))
    resultado = cursor.fetchone()
    if resultado:
        quantidade_atual = resultado[0]
        if operacao == 'mais':
            nova_quantidade = quantidade_atual + valor
        elif operacao == 'menos':
            nova_quantidade = max(0, quantidade_atual - valor)
        else:
            nova_quantidade = quantidade_atual

        cursor.execute("UPDATE produtos SET quantidade = %s WHERE id = %s", (nova_quantidade, produto_id))
        conn.commit()

    conn.close()
    return redirect(url_for('adicionar_produto'))

@app.route('/excluir_produto/<int:id>', methods=['POST'])
def excluir_produto(id):
    if 'email' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM produtos WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    
    return redirect(url_for('adicionar_produto'))

@app.route('/usuario')
def usuario():
    if session.get('tipo') != 'Usuario':
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM produtos")
    produtos = cursor.fetchall()
    conn.close()

    return render_template('usuario.html', nome=session['nome'], produtos=produtos)

if __name__ == '__main__':
    app.run(debug=True)