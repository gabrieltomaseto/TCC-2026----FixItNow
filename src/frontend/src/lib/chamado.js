export const INITIAL_CHAMADO = {
  nome: "",
  empresa: "",
  local: "",
  telefone: "",
  tipoServico: "Elétrica",
  prioridade: "Média",
  data: "",
  descricao: "",
  preco: "",
  id_autonomo: "",
};

export function parsePreco(value) {
  const text = String(value ?? "").trim().replace(/^R\$\s*/i, "");
  if (!text) return null;
  const normalized = text.includes(",")
    ? text.replace(/\./g, "").replace(",", ".")
    : text;
  const validFormat = text.includes(",")
    ? /^(?:\d+|\d{1,3}(?:\.\d{3})+),\d{1,2}$/.test(text)
    : /^\d+(?:\.\d{1,2})?$/.test(text);
  const amount = Number(normalized);
  if (!validFormat || !Number.isFinite(amount) || amount < 0 || amount > 99999999.99) {
    throw new Error("Informe um preço válido e não negativo, por exemplo R$ 150,00.");
  }
  return amount;
}

export function chamadoPayload(form) {
  return {
    id_autonomo: Number(form.id_autonomo),
    descricao_problema: form.descricao.trim(),
    data_solicitacao: form.data || undefined,
    status: "Pendente",
    nome_contato: form.nome.trim(),
    empresa_contato: form.empresa.trim() || null,
    local_atendimento: form.local.trim(),
    telefone_contato: form.telefone.trim(),
    tipo_servico: form.tipoServico,
    prioridade: form.prioridade,
    preco_estimado: parsePreco(form.preco),
  };
}
