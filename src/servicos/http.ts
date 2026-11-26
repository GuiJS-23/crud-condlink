
import { API_URL } from '../config';

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Opcoes {
  metodo?: Metodo;
  token?: string;
  corpo?: object;
}

export async function requisicao<T>(
  caminho: string,
  opcoes: Opcoes = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não definida: confira o arquivo .env');
  }

  const cabecalhos: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (opcoes.token) {
    cabecalhos.Authorization = `Bearer ${opcoes.token}`;
  }

  const resposta = await fetch(API_URL + caminho, {
    method: opcoes.metodo ?? 'GET',
    headers: cabecalhos,
    body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (resposta.status === 401 && opcoes.token) {
    throw new Error('Sessão expirada. Saia e entre novamente.');
  }

  if (!resposta.ok) {
    throw new Error(
      dados.erro ?? dados.error ?? `Erro ${resposta.status} ao chamar a API.`
    );
  }

  return dados as T;
}

export function mensagemDe(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Erro inesperado.';
}
