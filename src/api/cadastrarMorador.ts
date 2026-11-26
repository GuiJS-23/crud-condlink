
import { ROTAS } from '../config';
import { requisicao } from '../servicos/http';
import { separarTelefone, somenteDigitos } from '../utils/formatar';
import { Sessao } from './login';

export interface DadosMorador {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export const MORADOR_VAZIO: DadosMorador = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
};

interface RespostaCadastro {
  data: { id: string; nome: string; username: string };
  message: string;
}

export async function cadastrarMorador(
  sessao: Sessao,
  dados: DadosMorador,
): Promise<string> {
  const cpf = somenteDigitos(dados.cpf);
  const telefone = separarTelefone(dados.telefone);
  const senha = senhaProvisoria();

  const resposta = await requisicao<RespostaCadastro>(ROTAS.residentes, {
    metodo: 'POST',
    token: sessao.token,
    corpo: {
      nome: dados.nome.trim(),
      cpf,
      email: dados.email.trim(),
      telefone: telefone.numero,
      ddd_telefone: telefone.ddd ? Number(telefone.ddd) : undefined,
      username: cpf,
      password: senha,
    },
  });

  return resposta.data.id;
}

function senhaProvisoria(): string {
  return `Cl${Math.random().toString(36).slice(2, 10)}9`;
}
