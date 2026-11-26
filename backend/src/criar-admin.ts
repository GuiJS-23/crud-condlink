
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { db } from './database';

dotenv.config();

async function criarAdmin() {
  const nome = 'Administrador';
  const email = 'admin@jardim.com';
  const senha = 'Admin@123456';

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  try {
    db.prepare(`
      INSERT INTO moradores
      (nome, email, apartamento, bloco, senha)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      nome,
      email,
      'ADMIN',
      'ADMIN',
      senhaCriptografada
    );

    console.log('Administrador criado com sucesso!');
    console.log('Email:', email);
    console.log('Senha:', senha);
  } catch (erro) {
    console.log('Esse administrador já existe ou ocorreu um erro.');
  }

  db.close();
}

criarAdmin();
