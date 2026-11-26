import Database from 'better-sqlite3';
import path from 'path';

const caminhoBanco = path.join(__dirname, '..', 'residencial.db');

export const db = new Database(caminhoBanco);

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS moradores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    apartamento TEXT NOT NULL,
    bloco TEXT,
    senha TEXT NOT NULL,
    ativo INTEGER DEFAULT 1,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Banco de dados conectado e tabela de moradores criada!');