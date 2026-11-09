import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { apiUrl, authHeaders, getApiErrorMessage, getSession, isEmpresa, profilePhotoUrl } from "../lib/auth";

function SwipeFuncionarios() {
  const session = getSession();
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const tokenSessao = session?.token;
  const contaEmpresa = isEmpresa(session);
  useEffect(() => {
    if (!contaEmpresa) return undefined;
    let ativo = true;
    axios.get(apiUrl("swipe-funcionarios"), { headers: authHeaders({ token: tokenSessao }) })
      .then(({ data }) => { if (ativo) setFuncionarios(Array.isArray(data) ? data : []); })
      .catch((error) => { if (ativo) setErro(getApiErrorMessage(error, "Não foi possível carregar os funcionários.")); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [tokenSessao, contaEmpresa]);

  async function decidir(acao) {
    const atual = funcionarios[0];
    if (!atual || salvando) return;
    setErro("");
    setMensagem("");
    setSalvando(true);
    try {
      await axios.post(apiUrl("swipe-funcionarios"), { autonomo_id: atual.id, acao }, { headers: authHeaders(session) });
      setFuncionarios((lista) => lista.slice(1));
      setMensagem(acao === "like" ? "Funcionário selecionado." : "Funcionário dispensado.");
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível registrar essa decisão."));
    } finally {
      setSalvando(false);
    }
  }

  if (!session) return <Navigate to="/login" replace />;
  if (!isEmpresa(session)) return <Navigate to="/perfil" replace />;

  const atual = funcionarios[0];
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 dark:bg-gray-900 dark:text-gray-100 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-500">Equipe</p>
        <h1 className="mt-1 text-4xl font-bold">Encontrar funcionários</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Deslize pelos profissionais disponíveis e registre sua escolha.</p>
        {erro && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
        {mensagem && <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{mensagem}</p>}
        {carregando && <p className="mt-8 text-gray-500">Carregando funcionários...</p>}
        {!carregando && !atual && <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"><h2 className="text-xl font-bold">Não há mais funcionários</h2><p className="mt-2 text-gray-500 dark:text-gray-400">Todas as opções disponíveis já foram avaliadas por esta empresa.</p></div>}
        {!carregando && atual && <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex min-h-72 items-center justify-center bg-gray-100 p-8 dark:bg-gray-700">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-green-100 text-5xl dark:bg-gray-600">
              {profilePhotoUrl(atual.foto_url) ? <img src={profilePhotoUrl(atual.foto_url)} alt={`Foto de ${atual.nome}`} className="h-full w-full object-cover" /> : <span aria-hidden="true">🧰</span>}
            </div>
          </div>
          <div className="p-7">
            <h2 className="text-2xl font-bold">{atual.nome}</h2>
            <p className="mt-1 font-semibold text-green-600">{atual.especialidade || "Profissional"}</p>
            {atual.descricao && <p className="mt-4 text-gray-600 dark:text-gray-300">{atual.descricao}</p>}
            {atual.disponibilidade && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Disponibilidade: {atual.disponibilidade}</p>}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button type="button" disabled={salvando} onClick={() => decidir("dislike")} className="rounded-lg border border-red-500 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60">Dispensar</button>
              <button type="button" disabled={salvando} onClick={() => decidir("like")} className="rounded-lg bg-green-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-green-400 disabled:cursor-wait disabled:opacity-60">Selecionar funcionário</button>
            </div>
          </div>
        </section>}
      </div>
    </div>
  );
}
export default SwipeFuncionarios;
