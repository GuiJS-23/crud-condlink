
import { ROTAS } from '../config';
import { requisicao } from '../servicos/http';
import { Sessao } from './login';

export interface Morador {
  id: string;
  nome: string;
  email?: string | null;
  cpf?: string | null;
  telefone?: string | null;
}

interface RespostaLista {
  data: Morador[];
  meta: { total: number };
}

interface RespostaDetalhe {
  data: Morador;
}

export async function listarMoradores(sessao: Sessao): Promise<Morador[]> {
  const caminho = `${ROTAS.residentes}?page=1&page_size=100`;
  const resposta = await requisicao<RespostaLista>(caminho, {
    token: sessao.token,
  });

  return Promise.all(
    resposta.data.map((morador) => buscarMorador(sessao, morador.id))
  );
}

export async function buscarMorador(
  sessao: Sessao,
  id: string
): Promise<Morador> {
  const resposta = await requisicao<RespostaDetalhe>(
    `${ROTAS.residentes}${id}`,
    {
      token: sessao.token,
    }
  );

  return resposta.data;
}
