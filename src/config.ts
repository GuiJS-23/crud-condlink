// Endereço base da API vem do arquivo .env.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export const ROTAS = {
  login: '/app-login/v1/login',
  unidade: '/app-pessoa-me/v1/pessoa/me',
  residentes: '/app-residente-manage/v1/residente/',
};