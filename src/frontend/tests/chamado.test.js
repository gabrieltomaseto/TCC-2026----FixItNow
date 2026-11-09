import assert from "node:assert/strict";
import test from "node:test";
import { chamadoPayload, INITIAL_CHAMADO, parsePreco } from "../src/lib/chamado.js";

test("converte valores brasileiros sem descartar centavos ou zero", () => {
  assert.equal(parsePreco("R$ 1.234,56"), 1234.56);
  assert.equal(parsePreco("150,00"), 150);
  assert.equal(parsePreco("150.50"), 150.5);
  assert.equal(parsePreco("0"), 0);
  assert.equal(parsePreco(""), null);
});

test("rejeita preços negativos, malformados ou acima do limite do banco", () => {
  for (const value of ["-10,00", "R$ -1,00", "abc", "1,2,3", "1.23,45", "10.001", "100000000", "Infinity"]) {
    assert.throws(() => parsePreco(value));
  }
});

test("envia o autônomo escolhido e todos os campos recolhidos no chamado", () => {
  const payload = chamadoPayload({
    ...INITIAL_CHAMADO,
    nome: " Ana ", empresa: " Rua A ", local: " Sala 02 ", telefone: " 11999999999 ",
    tipoServico: "Elétrica", prioridade: "Alta", data: "2026-10-21",
    descricao: " Reparar tomada ", preco: "R$ 150,50", id_autonomo: "12",
  });
  assert.deepEqual(payload, {
    id_autonomo: 12, descricao_problema: "Reparar tomada", data_solicitacao: "2026-10-21", status: "Pendente",
    nome_contato: "Ana", empresa_contato: "Rua A", local_atendimento: "Sala 02", telefone_contato: "11999999999",
    tipo_servico: "Elétrica", prioridade: "Alta", preco_estimado: 150.5,
  });
  assert.equal("id_empresa" in payload, false, "empresa deve ser definida no backend pelo token");
  assert.equal("id_servico" in payload, false, "o serviço é resolvido no backend a partir do tipo de serviço");
});

test("valores opcionais vazios ficam nulos e o estado inicial tem preço controlado", () => {
  const payload = chamadoPayload(INITIAL_CHAMADO);
  assert.equal(payload.preco_estimado, null);
  assert.equal(payload.empresa_contato, null);
  assert.equal(payload.data_solicitacao, undefined);
  assert.equal(INITIAL_CHAMADO.preco, "");
});
