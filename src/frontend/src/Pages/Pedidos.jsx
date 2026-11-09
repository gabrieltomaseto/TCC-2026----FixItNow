import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import AsidePainel from "../Components/AsidePainel";
import { apiUrl, authHeaders, getSession, isAutonomo } from "../lib/auth";
import { listarNaoLidas, marcarTodasLidas } from "../lib/notificacoes";

const STATUS_PERMITIDOS = ["Pendente", "Aberta", "Em andamento", "Concluída", "Finalizada", "Não aceita", "Cancelada"];
const STATUS_AGUARDANDO = ["Pendente", "Aberta"];
const STATUS_ANDAMENTO = ["Em andamento", "Concluída"];

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "";
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "";
}

function canonicalStatus(value) {
  return STATUS_PERMITIDOS.includes(value) ? value : value || "Pendente";
}

function formatDateBR(value) {
  if (!value) return "—";

  const text = String(value);
  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`;

  const brDate = text.match(/^(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (brDate) return `${brDate[1]}/${brDate[2]}/${brDate[3]}`;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(parsed);
}

function statusClass(status) {
  if (status === "Concluída") return "bg-green-100 text-green-800";
  if (status === "Finalizada") return "bg-gray-100 text-gray-800";
  if (status === "Em andamento") return "bg-blue-100 text-blue-800";
  if (status === "Cancelada" || status === "Não aceita") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

function apiErrorMessage(error, fallback) {
  const validationError = Object.values(error?.response?.data?.errors || {})
    .flat()
    .find((message) => typeof message === "string");
  return validationError
    || error?.response?.data?.mensagem
    || error?.response?.data?.message
    || fallback;
}

function normalizePedido(item) {
  const id = Number(item.id);
  return {
    ...item,
    id,
    servico: item.servico?.nome || item.tipo_servico || "—",
    empresa: item.empresa?.nome || "—",
    status: canonicalStatus(item.status),
    data: item.data_solicitacao,
    avaliacao: item.avaliacao ?? null,
  };
}

function Pedidos() {
  const session = getSession();
  const tipoConta = session?.tipo;
  const sessionToken = session?.token;
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [rascunhos, setRascunhos] = useState({});
  const [pendentes, setPendentes] = useState({});
  const [mensagensMutacao, setMensagensMutacao] = useState({});
  const [respostas, setRespostas] = useState({});
  const [novos, setNovos] = useState(() => new Set());
  const revisoesMutacao = useRef({});

  useEffect(() => {
    if (tipoConta !== "autonomo") return undefined;
    let ativo = true;

    async function carregarPedidos(inicial = false) {
      const revisoesNaLeitura = { ...revisoesMutacao.current };
      if (inicial) setCarregando(true);

      try {
        const { data } = await axios.get(apiUrl("solicitacoes"), {
          headers: authHeaders({ token: sessionToken }),
        });
        if (!Array.isArray(data)) throw new Error("Resposta inválida");
        if (!ativo) return;

        const pedidosRecebidos = data.map(normalizePedido);
        setPedidos((atuais) => {
          const atuaisPorId = new Map(atuais.map((item) => [String(item.id), item]));
          return pedidosRecebidos.map((pedido) => {
            const chave = String(pedido.id);
            const mesmaRevisao = revisoesMutacao.current[chave] === revisoesNaLeitura[chave];
            return mesmaRevisao ? pedido : (atuaisPorId.get(chave) || pedido);
          });
        });
        setErro("");
        await sincronizarNotificacoes();
      } catch (error) {
        if (ativo) setErro(apiErrorMessage(error, "Não foi possível atualizar os pedidos agora."));
      } finally {
        if (ativo && inicial) setCarregando(false);
      }
    }

    async function sincronizarNotificacoes() {
      const naoLidas = await listarNaoLidas({ token: sessionToken }).catch(() => []);
      if (!ativo || !naoLidas.length) return;
      setNovos((atuais) => {
        const proximos = new Set(atuais);
        naoLidas.forEach((notificacao) => { if (notificacao.id_solicitacao) proximos.add(Number(notificacao.id_solicitacao)); });
        return proximos;
      });
      await marcarTodasLidas({ token: sessionToken }).catch(() => undefined);
    }

    carregarPedidos(true);
    const intervalo = window.setInterval(() => carregarPedidos(false), 15000);
    return () => {
      ativo = false;
      window.clearInterval(intervalo);
    };
  }, [tipoConta, sessionToken]);

  function incrementarRevisao(id) {
    const chave = String(id);
    revisoesMutacao.current[chave] = (revisoesMutacao.current[chave] || 0) + 1;
  }

  async function salvarStatus(pedido) {
    const chave = String(pedido.id);
    const status = rascunhos[chave] ?? pedido.status;
    if (!STATUS_PERMITIDOS.includes(status)) {
      setMensagensMutacao((atuais) => ({ ...atuais, [chave]: { error: "Status inválido." } }));
      return;
    }
    if (pedido.avaliacao || pendentes[chave]) return;

    incrementarRevisao(pedido.id);
    setPendentes((atuais) => ({ ...atuais, [chave]: true }));
    setMensagensMutacao((atuais) => ({ ...atuais, [chave]: {} }));

    try {
      const { data } = await axios.put(
        apiUrl(`solicitacoes/${pedido.id}`),
        { status },
        { headers: authHeaders(getSession()) },
      );
      const atualizada = data?.solicitacao || data;
      if (!atualizada || typeof atualizada !== "object" || atualizada.id === undefined) {
        throw new Error("Resposta inválida");
      }
      const pedidoAtualizado = normalizePedido(atualizada);
      setPedidos((atuais) => atuais.map((item) => (
        String(item.id) === chave ? pedidoAtualizado : item
      )));
      setRascunhos((atuais) => {
        const proximos = { ...atuais };
        delete proximos[chave];
        return proximos;
      });
      setMensagensMutacao((atuais) => ({
        ...atuais,
        [chave]: {
          success: data?.mensagem || data?.message || "Status atualizado com sucesso.",
        },
      }));
    } catch (error) {
      setMensagensMutacao((atuais) => ({
        ...atuais,
        [chave]: { error: apiErrorMessage(error, "Não foi possível atualizar o status agora.") },
      }));
    } finally {
      incrementarRevisao(pedido.id);
      setPendentes((atuais) => ({ ...atuais, [chave]: false }));
    }
  }

  async function responder(pedido, acao) {
    const chave = String(pedido.id);
    if (pendentes[chave]) return;

    incrementarRevisao(pedido.id);
    setPendentes((atuais) => ({ ...atuais, [chave]: true }));
    setMensagensMutacao((atuais) => ({ ...atuais, [chave]: {} }));

    try {
      const { data } = await axios.post(
        apiUrl(`solicitacoes/${pedido.id}/responder`),
        { acao, mensagem: (respostas[chave] || "").trim() || null },
        { headers: authHeaders(getSession()) },
      );
      const atualizada = data?.solicitacao;
      if (!atualizada || atualizada.id === undefined) throw new Error("Resposta inválida");
      const pedidoAtualizado = normalizePedido(atualizada);
      setPedidos((atuais) => atuais.map((item) => (String(item.id) === chave ? pedidoAtualizado : item)));
      setRespostas((atuais) => {
        const proximos = { ...atuais };
        delete proximos[chave];
        return proximos;
      });
      setMensagensMutacao((atuais) => ({ ...atuais, [chave]: { success: data?.mensagem || "Resposta enviada." } }));
    } catch (error) {
      setMensagensMutacao((atuais) => ({
        ...atuais,
        [chave]: { error: apiErrorMessage(error, "Não foi possível enviar sua resposta agora.") },
      }));
    } finally {
      incrementarRevisao(pedido.id);
      setPendentes((atuais) => ({ ...atuais, [chave]: false }));
    }
  }

  const aguardando = pedidos.filter((item) => STATUS_AGUARDANDO.includes(item.status)).length;
  const concluidos = pedidos.filter((item) => ["Concluída", "Finalizada"].includes(item.status)).length;

  if (!isAutonomo(session)) return <Navigate to="/perfil" replace />;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 lg:flex-row">
      <AsidePainel />
      <main className="flex-1 p-5 sm:p-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-green-500">Área do autônomo</p><h1 className="mt-1 text-3xl font-bold">Pedidos recebidos</h1><p className="mt-2 text-gray-500 dark:text-gray-400">Acompanhe as solicitações atribuídas ao seu perfil.</p></div>
          <Link to="/perfil" className="rounded-lg border border-green-500 px-4 py-2 font-semibold text-green-600 hover:bg-green-50">Ver meu perfil</Link>
        </div>
        {novos.size > 0 && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-200">Você recebeu {novos.size} {novos.size === 1 ? "novo pedido" : "novos pedidos"} de serviço.</p>}
        <div className="grid gap-4 sm:grid-cols-4">
          {[{ label: "Todos os pedidos", value: pedidos.length }, { label: "Aguardando resposta", value: aguardando }, { label: "Em andamento", value: pedidos.filter((item) => item.status === "Em andamento").length }, { label: "Concluídos", value: concluidos }].map((card) => <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"><p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p><p className="mt-2 text-3xl font-bold">{carregando ? "—" : card.value}</p></div>)}
        </div>
        {erro && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{erro}</p>}
        {carregando && <p className="mt-6 text-sm text-gray-500">Carregando pedidos...</p>}
        {!carregando && !erro && !pedidos.length && <p className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">Nenhum pedido novo foi enviado para você.</p>}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700"><h2 className="font-bold">Solicitações feitas para você</h2></div>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-5 py-3">Pedido</th><th className="px-5 py-3">Serviço</th><th className="px-5 py-3">Empresa</th><th className="px-5 py-3">Status e resposta</th><th className="px-5 py-3">Data</th></tr></thead><tbody>
            {carregando && <tr><td colSpan="5" className="px-5 py-6 text-center text-gray-500">Carregando pedidos...</td></tr>}
            {!carregando && erro && !pedidos.length && <tr><td colSpan="5" className="px-5 py-6 text-center text-amber-700">Não foi possível carregar os pedidos.</td></tr>}
            {!carregando && !erro && !pedidos.length && <tr><td colSpan="5" className="px-5 py-6 text-center text-gray-500">Nenhum pedido encontrado.</td></tr>}
            {!carregando && pedidos.map((item) => {
              const chave = String(item.id);
              const statusSelecionado = rascunhos[chave] ?? item.status;
              const avaliacaoRegistrada = Boolean(item.avaliacao);
              const mutacaoPendente = Boolean(pendentes[chave]);
              const mensagem = mensagensMutacao[chave];
              const novo = novos.has(item.id);
              const aguardandoResposta = STATUS_AGUARDANDO.includes(item.status);
              const podeAtualizar = STATUS_ANDAMENTO.includes(item.status);
              const preco = formatCurrency(item.preco_estimado);
              return (
                <tr key={item.id} className={`border-t border-gray-100 align-top dark:border-gray-700 ${novo ? "bg-green-50/70 dark:bg-green-900/20" : ""}`}>
                  <td className="px-5 py-4 font-semibold text-green-600">#{item.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{item.servico}</p>
                    {item.descricao_problema && <p className="mt-1 max-w-xs text-xs text-gray-600 dark:text-gray-300">{item.descricao_problema}</p>}
                    <ul className="mt-2 space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {item.local_atendimento && <li>Local: {item.local_atendimento}</li>}
                      {item.prioridade && <li>Prioridade: {item.prioridade}</li>}
                      {item.nome_contato && <li>Contato: {item.nome_contato}{item.telefone_contato ? ` — ${item.telefone_contato}` : ""}</li>}
                      {preco && <li>Preço estimado: {preco}</li>}
                    </ul>
                  </td>
                  <td className="px-5 py-4">{item.empresa}</td>
                  <td className="px-5 py-4">
                    <div className="flex min-w-[230px] flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
                        {novo && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">Novo</span>}
                      </div>
                      {aguardandoResposta && !avaliacaoRegistrada && (
                        <>
                          <textarea
                            aria-label={`Resposta ao pedido #${item.id}`}
                            value={respostas[chave] ?? ""}
                            onChange={(event) => setRespostas((atuais) => ({ ...atuais, [chave]: event.target.value }))}
                            disabled={mutacaoPendente}
                            maxLength={2000}
                            rows={3}
                            placeholder="Escreva uma resposta para a empresa (opcional)"
                            className="w-full rounded-lg border border-gray-300 px-2 py-1 text-xs outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200 disabled:opacity-60"
                          />
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => responder(item, "aceitar")} disabled={mutacaoPendente} className="rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60">{mutacaoPendente ? "Enviando..." : "Aceitar pedido"}</button>
                            <button type="button" onClick={() => responder(item, "recusar")} disabled={mutacaoPendente} className="rounded-lg border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">Recusar</button>
                          </div>
                        </>
                      )}
                      {!aguardandoResposta && item.resposta_autonomo && <p className="rounded-lg bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-200">Sua resposta: {item.resposta_autonomo}</p>}
                      {podeAtualizar && (
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            aria-label={`Status do pedido #${item.id}`}
                            value={statusSelecionado}
                            onChange={(event) => setRascunhos((atuais) => ({ ...atuais, [chave]: event.target.value }))}
                            disabled={avaliacaoRegistrada || mutacaoPendente}
                            className="rounded-lg border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                          >
                            {STATUS_ANDAMENTO.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                          <button
                            type="button"
                            onClick={() => salvarStatus(item)}
                            disabled={avaliacaoRegistrada || mutacaoPendente}
                            className="rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {mutacaoPendente ? "Salvando..." : "Salvar"}
                          </button>
                        </div>
                      )}
                      {avaliacaoRegistrada && <span className="text-xs text-gray-500">Avaliado; atualização bloqueada.</span>}
                      {mensagem?.success && <span className="text-xs text-green-700">{mensagem.success}</span>}
                      {mensagem?.error && <span className="text-xs text-red-700">{mensagem.error}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">{formatDateBR(item.data)}</td>
                </tr>
              );
            })}
          </tbody></table></div>
        </div>
      </main>
    </div>
  );
}

export default Pedidos;
