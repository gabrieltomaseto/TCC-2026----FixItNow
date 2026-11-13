export function somenteDigitos(valor) {
  return String(valor || "").replace(/\D/g, "");
}

export function formatarCelular(valor) {
  const numeros = somenteDigitos(valor).slice(0, 11);
  if (!numeros) return "";
  if (numeros.length <= 2) return `(${numeros}`;
  const ddd = numeros.slice(0, 2);
  const restante = numeros.slice(2);
  if (numeros.length <= 10) {
    return `(${ddd}) ${restante.slice(0, 4)}${restante.length > 4 ? `-${restante.slice(4)}` : ""}`;
  }
  return `(${ddd}) ${restante.slice(0, 5)}${restante.length > 5 ? `-${restante.slice(5)}` : ""}`;
}

export function formatarCpf(valor) {
  const numeros = somenteDigitos(valor).slice(0, 11);
  return numeros.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatarCnpj(valor) {
  const numeros = somenteDigitos(valor).slice(0, 14);
  return numeros.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function cpfValido(valor) {
  return somenteDigitos(valor).length === 11;
}

export function cnpjValido(valor) {
  return somenteDigitos(valor).length === 14;
}

export function celularValido(valor) {
  const telefone = somenteDigitos(valor);
  return telefone.length === 10 || telefone.length === 11;
}
