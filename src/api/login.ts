
import { ROTAS } from '../config';
import { requisicao } from '../servicos/http';
import { lerClaims } from '../servicos/jwt';

// O que o app guarda depois do login.
export interface Sessao {
  token: string;
  nome: string;
  idCondominio: string;
}

// O que o app-login devolve.
interface RespostaLogin {
  token: string;
  nome: string;
}

export async function entrar(
  usuario: string,
  senha: string
): Promise<Sessao> {
  const resposta = await requisicao<RespostaLogin>(ROTAS.login, {
    metodo: 'POST',
    corpo: {
      username: usuario,
      password: senha,
      connected: false,
    },
  });

  const idCondominio = lerClaims(resposta.token).condominios?.[0];

  if (!idCondominio) {
    throw new Error('Este usuário não tem condomínio liberado.');
  }

  return {
    token: resposta.token,
    nome: resposta.nome,
    idCondominio,
  };
}
