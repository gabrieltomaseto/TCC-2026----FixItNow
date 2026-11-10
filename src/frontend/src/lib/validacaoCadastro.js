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

function validarDigitosVerificadores(valor, pesos) {
  const soma = valor.split("").reduce((total, digito, indice) => total + Number(digito) * pesos[indice], 0);
  const resto = soma % 11;
  return String(resto < 2 ? 0 : 11 - resto);
}

export function cpfValido(valor) {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const primeiro = validarDigitosVerificadores(cpf.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = validarDigitosVerificadores(cpf.slice(0, 9) + primeiro, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cpf.endsWith(primeiro + segundo);
}

export function cnpjValido(valor) {
  const cnpj = somenteDigitos(valor);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const primeiro = validarDigitosVerificadores(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = validarDigitosVerificadores(cnpj.slice(0, 12) + primeiro, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cnpj.endsWith(primeiro + segundo);
}

export function celularValido(valor) {
  const telefone = somenteDigitos(valor);
  return telefone.length === 10 || telefone.length === 11;
}
