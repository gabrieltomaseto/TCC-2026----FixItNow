import { useEffect, useState } from "react";
import axios from "axios";
import AsidePainel from "../Components/AsidePainel";
import { apiUrl, authHeaders, getSession } from "../lib/auth";

const STATUS_CONCLUIDOS = ["Concluída", "Finalizada"];
const STATUS_ABERTOS = ["Pendente", "Aberta"];

function statusClass(status) {
  if (status === "Concluída") return "bg-green-100 text-green-800";
  if (status === "Finalizada") return "bg-gray-100 text-gray-800";
  if (status === "Em andamento") return "bg-blue-100 text-blue-800";
  if (status === "Cancelada" || status === "Não aceita") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
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

function dateSortValue(value) {
  if (!value) return 0;
  const text = String(value);
  const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return Number(`${isoDate[1]}${isoDate[2]}${isoDate[3]}`);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function apiErrorMessage(error) {
  const validationError = Object.values(error?.response?.data?.errors || {})
    .flat()
    .find((message) => typeof message === "string");
  return validationError
    || error?.response?.data?.mensagem
    || error?.response?.data?.message
    || "Não foi possível carregar as solicitações agora.";
}

function Painel() {
  const session = getSession();
  const sessionToken = session?.token;
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarSolicitacoes() {
      setCarregando(true);
      setErro("");
      try {
        const { data } = await axios.get(apiUrl("solicitacoes"), {
          headers: authHeaders({ token: sessionToken }),
        });
        if (!Array.isArray(data)) throw new Error("Resposta inválida");
        if (ativo) setSolicitacoes(data);
      } catch (error) {
        if (ativo) setErro(apiErrorMessage(error));
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarSolicitacoes();
    return () => {
      ativo = false;
    };
  }, [sessionToken]);

  const total = solicitacoes.length;
  const abertas = solicitacoes.filter((item) => STATUS_ABERTOS.includes(item.status)).length;
  const emAndamento = solicitacoes.filter((item) => item.status === "Em andamento").length;
  const concluidas = solicitacoes.filter((item) => STATUS_CONCLUIDOS.includes(item.status)).length;
  const taxaConclusao = total ? Math.round((concluidas / total) * 100) : 0;
  const ultimasSolicitacoes = [...solicitacoes]
    .sort((a, b) => (
      dateSortValue(b.data_solicitacao) - dateSortValue(a.data_solicitacao)
      || Number(b.id) - Number(a.id)
    ))
    .slice(0, 3);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 lg:flex-row">
        {/*SIDEBAR*/}
        <AsidePainel />

        <main className="flex-1 w-full">
          {/* HEADER */}
          <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-4 lg:h-24 lg:px-10 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 lg:text-3xl">
              Painel
            </h2>

            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm lg:text-base">
                Olá
              </span>

              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center lg:w-11 lg:h-11">
                👤
              </div>
            </div>
          </header>

          <section className="p-4 sm:p-6 lg:p-8">
            {erro && (
              <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                {erro}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    SOLICITAÇÕES
                    <br />
                    ABERTAS
                  </h3>

                  <span className="text-gray-400 text-lg">
                    ◉
                  </span>
                </div>

                <p className="text-3xl sm:text-5xl font-bold mt-4 sm:mt-6">
                  {carregando ? "—" : abertas}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    EM ANDAMENTO
                  </h3>

                  <span className="text-green-500 text-lg">
                    ↗
                  </span>
                </div>

                <p className="text-3xl sm:text-5xl font-bold mt-4 sm:mt-6">
                  {carregando ? "—" : emAndamento}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    CONCLUÍDAS
                  </h3>

                  <span className="text-blue-500 text-lg">
                    ✓
                  </span>
                </div>

                <p className="text-3xl sm:text-5xl font-bold mt-4 sm:mt-6">
                  {carregando ? "—" : concluidas}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    TAXA DE
                    <br />
                    CONCLUSÃO
                  </h3>

                  <span className="text-orange-500 text-lg">
                    📊
                  </span>
                </div>

                <p className="text-3xl sm:text-5xl font-bold mt-4 sm:mt-6">
                  {carregando ? "—" : `${taxaConclusao}%`}
                </p>
              </div>
            </div>

            <div className="mt-8 lg:mt-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Últimas Solicitações
              </h3>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 hidden sm:table-cell">Serviço</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 hidden md:table-cell">Local</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 hidden lg:table-cell">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carregando && (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500">Carregando solicitações...</td>
                      </tr>
                    )}
                    {!carregando && erro && !solicitacoes.length && (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-amber-700">Não foi possível carregar as solicitações.</td>
                      </tr>
                    )}
                    {!carregando && !erro && !ultimasSolicitacoes.length && (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500">Nenhuma solicitação encontrada.</td>
                      </tr>
                    )}
                    {!carregando && ultimasSolicitacoes.map((sol) => (
                      <tr key={sol.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 font-semibold text-green-600">#{sol.id}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">{sol.servico?.nome || sol.tipo_servico || "—"}</td>
                        <td className="px-4 py-3 hidden md:table-cell">{sol.local_atendimento || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClass(sol.status)}`}>
                            {sol.status || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">{formatDateBR(sol.data_solicitacao)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Painel;
