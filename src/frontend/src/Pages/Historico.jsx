import { useEffect, useState } from "react";
import axios from "axios";
import AsidePainel from "../Components/AsidePainel";
import { apiUrl, authHeaders, getSession } from "../lib/auth";

const STATUS_OPTIONS = ["Pendente", "Aberta", "Em andamento", "Finalizada", "Não aceita", "Cancelada"];

function canonicalStatus(value) {
  return STATUS_OPTIONS.includes(value) ? value : value || "Pendente";
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

function dateKey(value) {
  if (!value) return "";
  const text = String(value);
  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;

  const brDate = text.match(/^(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (brDate) return `${brDate[3]}-${brDate[2]}-${brDate[1]}`;

  return "";
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "—";

  const text = String(value);
  const number = typeof value === "string" && text.includes(",")
    ? Number(text.replace(/\./g, "").replace(",", "."))
    : Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function statusClass(status) {
  if (status === "Finalizada") return "bg-green-100 text-green-800";
  if (status === "Finalizada") return "bg-gray-100 text-gray-800";
  if (status === "Em andamento") return "bg-blue-100 text-blue-800";
  if (status === "Cancelada" || status === "Não aceita") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}

function apiErrorMessage(error) {
  const validationError = Object.values(error?.response?.data?.errors || {})
    .flat()
    .find((message) => typeof message === "string");
  return validationError
    || error?.response?.data?.mensagem
    || error?.response?.data?.message
    || "Não foi possível carregar o histórico agora.";
}

function Historico() {
  const session = getSession();
  const sessionToken = session?.token;
  const [historicoSolicitacoes, setHistoricoSolicitacoes] = useState([]);
  const [filtroServico, setFiltroServico] = useState("Todos");
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarHistorico() {
      setCarregando(true);
      setErro("");
      try {
        const { data } = await axios.get(apiUrl("solicitacoes"), {
          headers: authHeaders({ token: sessionToken }),
        });
        if (!Array.isArray(data)) throw new Error("Resposta inválida");
        if (ativo) setHistoricoSolicitacoes(data);
      } catch (error) {
        if (ativo) setErro(apiErrorMessage(error));
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarHistorico();
    return () => {
      ativo = false;
    };
  }, [sessionToken]);

  const opcoesServico = [{ value: "Todos", label: "Todos" }];
  const opcoesVistas = new Set();
  historicoSolicitacoes.forEach((item) => {
    const nome = item.servico?.nome;
    const categoria = item.servico?.categoria;
    if (nome) {
      const chave = `servico:${String(nome).toLocaleLowerCase()}`;
      if (!opcoesVistas.has(chave)) {
        opcoesVistas.add(chave);
        opcoesServico.push({ value: `servico:${nome}`, label: nome });
      }
    }
    if (categoria) {
      const chave = `categoria:${String(categoria).toLocaleLowerCase()}`;
      if (!opcoesVistas.has(chave)) {
        opcoesVistas.add(chave);
        opcoesServico.push({ value: `categoria:${categoria}`, label: `${categoria} (categoria)` });
      }
    }
  });

  const solicitacoesFiltradas = historicoSolicitacoes.filter((item) => {
    let correspondeServico = true;
    if (filtroServico !== "Todos") {
      const separador = filtroServico.indexOf(":");
      const tipo = filtroServico.slice(0, separador);
      const valor = filtroServico.slice(separador + 1).toLocaleLowerCase();
      const campo = tipo === "categoria" ? item.servico?.categoria : item.servico?.nome;
      correspondeServico = String(campo || "").toLocaleLowerCase() === valor;
    }

    const correspondeData = !filtroData || dateKey(item.data_solicitacao) === filtroData;
    const correspondeStatus = filtroStatus === "Todos" || canonicalStatus(item.status) === filtroStatus;
    return correspondeServico && correspondeData && correspondeStatus;
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <AsidePainel />

        <main className="flex-1 w-full">
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="px-4 sm:px-6 lg:px-7 pt-6 sm:pt-7 pb-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Histórico <span className="text-green-500">de</span> Solicitações
              </h1>
            </div>

            <div className="p-4 sm:p-6 lg:p-7">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Opções de Filtragem</h2>
              <div className="mb-8 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="tipoServ" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tipo de serviço
                  </label>
                  <select
                    name="tipoServ"
                    id="tipoServ"
                    value={filtroServico}
                    onChange={(event) => setFiltroServico(event.target.value)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    {opcoesServico.map((opcao) => <option key={opcao.value} value={opcao.value}>{opcao.label}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="dataSolicitacao" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Data
                  </label>
                  <input
                    type="date"
                    name="dataSolicitacao"
                    id="dataSolicitacao"
                    value={filtroData}
                    onChange={(event) => setFiltroData(event.target.value)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="status" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={filtroStatus}
                    onChange={(event) => setFiltroStatus(event.target.value)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    <option value="Todos">Todos</option>
                    {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>

              {erro && (
                <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                  {erro}
                </p>
              )}

              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Solicitações</h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 text-xs sm:text-sm">Tipo de Serviço</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 text-xs sm:text-sm hidden sm:table-cell">Data</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 text-xs sm:text-sm">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 text-xs sm:text-sm hidden md:table-cell">Custo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carregando && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-center text-gray-500">Carregando histórico...</td>
                      </tr>
                    )}
                    {!carregando && erro && !historicoSolicitacoes.length && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-center text-amber-700">Não foi possível carregar o histórico.</td>
                      </tr>
                    )}
                    {!carregando && !erro && !solicitacoesFiltradas.length && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-center text-gray-500">Nenhuma solicitação encontrada.</td>
                      </tr>
                    )}
                    {!carregando && solicitacoesFiltradas.map((item) => {
                      const status = canonicalStatus(item.status);
                      const preco = item.preco_estimado ?? item.servico?.preco;
                      return (
                        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{item.servico?.nome || item.tipo_servico || "—"}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden sm:table-cell">{formatDateBR(item.data_solicitacao)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClass(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 hidden md:table-cell">{formatCurrency(preco)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Historico;
