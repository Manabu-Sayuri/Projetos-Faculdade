from werkzeug.security import generate_password_hash

senha = "1234"
hash = generate_password_hash(senha, method='pbkdf2:sha256')
print(hash)