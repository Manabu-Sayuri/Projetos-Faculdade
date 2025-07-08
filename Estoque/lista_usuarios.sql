use estoque;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('ADM', 'Usuario') NOT NULL
);

select * from usuarios;

INSERT INTO usuarios (nome, sobrenome, email, senha, tipo)
VALUES ('Ana', 'Souza', 'ana@email.com', '[senha_hash]', 'ADM');

UPDATE usuarios
SET senha = 'pbkdf2:sha256:1000000$yJpwtvvHsIye8BLO$00e97dd426227a09dc36ef8f8590e1618527767e6ecca0196fd639028b32d220'
WHERE email = 'ana@email.com';

UPDATE usuarios
SET nome = 'Kely',
    sobrenome = 'Vissoto'
WHERE id = 2;