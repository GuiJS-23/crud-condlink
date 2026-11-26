import { ROTAS } from '../config';
import { requisicao } from '../servicos/http';
import { Sessao } from './login';

export interface Unidade {
  condominio: string;
  bloco: string;
  apartamento: string;
  numero: string;
}

interface RespostaPessoaMe {
  condomino: { bloco?: string; apartamento?: string; numero?: string };
  condominio: { nome: string };
}

export async function buscarUnidade(sessao: Sessao): Promise<Unidade> {
  const resposta = await requisicao<RespostaPessoaMe>(ROTAS.unidade, {
    token: sessao.token,
  });

  const { condomino, condominio } = resposta;

  return {
    condominio: condominio.nome,
    bloco: condomino.bloco ?? '',
    apartamento: condomino.apartamento ?? '',
    numero: condomino.numero ?? '',
  };
}

export function nomeDaUnidade(unidade: Unidade): string {
  const bloco = unidade.bloco ? `Bloco ${unidade.bloco}` : '';
  const apto = unidade.apartamento ? `Apto ${unidade.apartamento}` : '';
  const texto = [bloco, apto].filter(Boolean).join(' - ');

  return texto || `Unidade ${unidade.numero}`;
}