
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Autenticação JWT
function autenticarToken(req: any, res: any, next: any) {
  const cabecalho = req.headers['authorization'];
  const token = cabecalho && cabecalho.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      erro: 'Acesso não autorizado.'
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'chave_temporaria',
    (erro, usuario) => {
      if (erro) {
        return res.status(403).json({
          erro: 'Token inválido ou expirado.'
        });
      }

      req.usuario = usuario;
      next();
    }
  );
}

// Página inicial
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Residencial Jardim das Flores funcionando!'
  });
});

// Login
app.post('/app-login/v1/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      erro: 'Informe email e senha.'
    });
  }

  const morador = db.prepare(`
    SELECT * FROM moradores
    WHERE email = ? AND ativo = 1
  `).get(username) as any;

  if (!morador) {
    return res.status(401).json({
      erro: 'Email ou senha incorretos.'
    });
  }

  const senhaCorreta = await bcrypt.compare(password, morador.senha);

  if (!senhaCorreta) {
    return res.status(401).json({
      erro: 'Email ou senha incorretos.'
    });
  }

  const token = jwt.sign(
    { id: morador.id, email: morador.email },
    process.env.JWT_SECRET || 'chave_temporaria',
    { expiresIn: '1d' }
  );

  return res.json({
    mensagem: 'Login realizado com sucesso!',
    token,
    morador: {
      id: morador.id,
      nome: morador.nome,
      email: morador.email,
      apartamento: morador.apartamento,
      bloco: morador.bloco
    }
  });
});

// Cadastrar morador
app.post('/app-residente-manage/v1/residente/', autenticarToken, async (req, res) => {
  const { nome, email, telefone, apartamento, bloco, senha } = req.body;

  if (!nome || !email || !apartamento || !senha) {
    return res.status(400).json({
      erro: 'Preencha nome, email, apartamento e senha.'
    });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const resultado = db.prepare(`
      INSERT INTO moradores (nome, email, telefone, apartamento, bloco, senha)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(nome, email, telefone || null, apartamento, bloco || null, senhaCriptografada);

    return res.status(201).json({
      mensagem: 'Morador cadastrado com sucesso!',
      id: resultado.lastInsertRowid
    });
  } catch (erro) {
    return res.status(400).json({
      erro: 'Não foi possível cadastrar. Verifique se o email já existe.'
    });
  }
});

// Listar moradores
app.get('/app-residente-manage/v1/residente/', autenticarToken, (req, res) => {
  try {
    const moradores = db.prepare(`
      SELECT id, nome, email, telefone, apartamento, bloco, ativo, criado_em
      FROM moradores
      WHERE ativo = 1
    `).all();

    return res.json(moradores);
  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao buscar moradores.'
    });
  }
});

// Editar morador
app.put('/app-residente-manage/v1/residente/:id', autenticarToken, (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, apartamento, bloco } = req.body;

  try {
    const resultado = db.prepare(`
      UPDATE moradores
      SET nome = ?, email = ?, telefone = ?, apartamento = ?, bloco = ?
      WHERE id = ? AND ativo = 1
    `).run(nome, email, telefone || null, apartamento, bloco || null, id);

    if (resultado.changes === 0) {
      return res.status(404).json({
        erro: 'Morador não encontrado.'
      });
    }

    return res.json({
      mensagem: 'Morador atualizado com sucesso!'
    });
  } catch (erro) {
    return res.status(400).json({
      erro: 'Não foi possível atualizar o morador.'
    });
  }
});

// Excluir morador (exclusão lógica)
app.delete('/app-residente-manage/v1/residente/:id', autenticarToken, (req, res) => {
  const { id } = req.params;

  try {
    const resultado = db.prepare(`
      UPDATE moradores
      SET ativo = 0
      WHERE id = ? AND ativo = 1
    `).run(id);

    if (resultado.changes === 0) {
      return res.status(404).json({
        erro: 'Morador não encontrado.'
      });
    }

    return res.json({
      mensagem: 'Morador excluído com sucesso!'
    });
  } catch (erro) {
    return res.status(500).json({
      erro: 'Erro ao excluir morador.'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Banco de dados carregado:', db.name);
});
