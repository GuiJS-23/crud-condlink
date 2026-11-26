import { ROTAS } from '../config';
import { requisicao } from '../servicos/http';
import { Sessao } from './login';

// Inativa o morador pela API.
export async function inativarMorador(
  sessao: Sessao,
  idMorador: string,
): Promise<void> {
  await requisicao(`${ROTAS.residentes}${idMorador}`, {
    metodo: 'DELETE',
    token: sessao.token,
  });
}