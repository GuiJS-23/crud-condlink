
export function somenteDigitos(texto?: string): string {
  return (texto ?? '').replace(/\D/g, '');
}

export function formatarCpf(cpf?: string): string {
  const d = somenteDigitos(cpf);

  if (d.length !== 11) {
    return cpf ?? '';
  }

  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function formatarTelefone(ddd?: string, numero?: string): string {
  const n = somenteDigitos(numero);

  if (!n) {
    return '';
  }

  const corte = n.length - 4;
  const meio = `${n.slice(0, corte)}-${n.slice(corte)}`;

  return ddd ? `(${somenteDigitos(ddd)}) ${meio}` : meio;
}

export function separarTelefone(texto: string): { ddd: string; numero: string } {
  const d = somenteDigitos(texto);

  if (d.length < 10) {
    return { ddd: '', numero: d };
  }

  return { ddd: d.slice(0, 2), numero: d.slice(2) };
}
