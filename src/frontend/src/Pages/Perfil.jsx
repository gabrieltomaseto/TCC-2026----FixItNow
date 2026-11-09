import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, Navigate, useLocation } from "react-router-dom";
import Badge from "../Components/Badge";
import FotoPerfil from "../Components/FotoPerfil";
import { authHeaders, getApiErrorMessage, getSession, isAutonomo, isEmpresa, apiUrl, updateProfile, updateProfilePhoto } from "../lib/auth";
import { useNotificacoes } from "../lib/useNotificacoes";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const STATUS_IGNORADOS = ["nao aceita", "cancelada"];

function normalizarStatus(status) {
  return String(status || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function atendimentoConcluido(item) {
  return ["concluida", "finalizada"].includes(normalizarStatus(item.status));
}

function estrelas(media) {
  const cheias = Math.round(media);
  return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

function Perfil() {
  const session = getSession();
  const empresa = isEmpresa(session);
  const autonomo = isAutonomo(session);
  const perfil = empresa ? session?.empresa : session?.autonomo;
  const nome = empresa ? perfil?.nome || session?.usuario?.name || "Empresa" : perfil?.nome || session?.usuario?.name || "Autônomo";
  const [nota, setNota] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [mostrarToken, setMostrarToken] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [foto, setFoto] = useState(() => perfil?.foto_url || perfil?.avatar_url || perfil?.foto || "");
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [mensagemFoto, setMensagemFoto] = useState("");
  const [erroFoto, setErroFoto] = useState("");
  const inputFotoRef = useRef(null);
  const [descricao, setDescricao] = useState(perfil?.descricao || "");
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvandoDescricao, setSalvandoDescricao] = useState(false);
  const [mensagemDescricao, setMensagemDescricao] = useState("");
  const [erroDescricao, setErroDescricao] = useState("");
  const [todasSolicitacoes, setTodasSolicitacoes] = useState([]);
  const [idSolicitacao, setIdSolicitacao] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [carregandoSolicitacoes, setCarregandoSolicitacoes] = useState(true);
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  const [erroAvaliacao, setErroAvaliacao] = useState("");
  const sessionToken = session?.token;
  const location = useLocation();
  const naoLidas = useNotificacoes();
  const solicitacoes = todasSolicitacoes.filter(atendimentoConcluido);

  useEffect(() => {
    if (!sessionToken) return undefined;
    let ativo = true;
    axios.get(apiUrl("perfil"), { headers: authHeaders({ token: sessionToken }) })
      .then(({ data }) => {
        if (!ativo || !data?.perfil) return;
        updateProfile(data.perfil, data.usuario, sessionToken);
        setDescricao(data.perfil.descricao || "");
        setFoto(data.perfil.foto_url || "");
      })
      .catch((error) => { if (ativo) setErroDescricao(getApiErrorMessage(error, "Não foi possível carregar o perfil atualizado.")); })
      .finally(() => { if (ativo) setCarregandoPerfil(false); });
    return () => { ativo = false; };
  }, [sessionToken]);

  useEffect(() => {
    if (!empresa || !sessionToken) return undefined;
    let ativo = true;
    axios.get(apiUrl("solicitacoes"), { headers: authHeaders({ token: sessionToken }) })
      .then(({ data }) => {
        if (!ativo) return;
        if (!Array.isArray(data)) throw new Error("A API não retornou as solicitações.");
        setTodasSolicitacoes(data);
      })
      .catch((error) => { if (ativo) setErroAvaliacao(getApiErrorMessage(error, error.message || "Não foi possível carregar as solicitações para avaliação.")); })
      .finally(() => { if (ativo) setCarregandoSolicitacoes(false); });
    return () => { ativo = false; };
  }, [empresa, sessionToken]);

  useEffect(() => {
    if (location.hash !== "#avaliacoes" || carregandoSolicitacoes) return;
    document.getElementById("avaliacoes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, carregandoSolicitacoes]);

  const solicitacaoSelecionada = solicitacoes.find((item) => String(item.id) === idSolicitacao);

  const autonomosSelecionados = Object.values(todasSolicitacoes.reduce((mapa, item) => {
    if (!item.autonomo?.id || STATUS_IGNORADOS.includes(normalizarStatus(item.status))) return mapa;
    const atual = mapa[item.autonomo.id] || { autonomo: item.autonomo, pedidos: 0, concluidas: [], notas: [] };
    atual.pedidos += 1;
    if (atendimentoConcluido(item)) atual.concluidas.push(item);
    if (item.avaliacao?.nota) atual.notas.push(Number(item.avaliacao.nota));
    mapa[item.autonomo.id] = atual;
    return mapa;
  }, {}));

  function escolherSolicitacao(id) {
    const item = solicitacoes.find((solicitacao) => String(solicitacao.id) === String(id));
    setIdSolicitacao(String(id));
    setNota(item?.avaliacao?.nota || 0);
    setComentarios(item?.avaliacao?.comentarios || "");
    setMensagem("");
    setErroAvaliacao("");
  }

  function selecionarSolicitacao(event) {
    escolherSolicitacao(event.target.value);
  }

  function avaliarAutonomo(grupo) {
    const alvo = grupo.concluidas.find((item) => !item.avaliacao) || grupo.concluidas[0];
    if (!alvo) return;
    escolherSolicitacao(alvo.id);
    document.getElementById("formulario-avaliacao")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (!session) return <Navigate to="/login" replace />;

  const token = session.token || "Token ainda não disponível. Faça login novamente.";
  const tokenVisivel = mostrarToken ? token : `${token.slice(0, 10)}${token.length > 10 ? "••••••••••••" : ""}`;

  async function avaliar(event) {
    event.preventDefault();
    if (enviandoAvaliacao) return;
    setMensagem("");
    setErroAvaliacao("");
    if (!solicitacaoSelecionada || !nota) {
      setErroAvaliacao("Selecione uma solicitação concluída e uma nota de 1 a 5 estrelas.");
      return;
    }
    setEnviandoAvaliacao(true);
    try {
      const avaliacaoExistente = solicitacaoSelecionada.avaliacao;
      const payload = { nota, comentarios: comentarios.trim() || null };
      const { data } = avaliacaoExistente
        ? await axios.put(apiUrl(`avaliacoes/${avaliacaoExistente.id}`), payload, { headers: authHeaders(session) })
        : await axios.post(apiUrl("avaliacoes"), { ...payload, id_solicitacao: solicitacaoSelecionada.id }, { headers: authHeaders(session) });
      if (!data?.id || Number(data.id_solicitacao) !== Number(solicitacaoSelecionada.id)) {
        throw new Error("A API não confirmou o vínculo da avaliação. Atualize a página antes de reenviar.");
      }
      setTodasSolicitacoes((atuais) => atuais.map((item) => item.id === solicitacaoSelecionada.id ? { ...item, avaliacao: data } : item));
      setMensagem(`Avaliação ${avaliacaoExistente ? "atualizada" : "registrada"} para a solicitação #${solicitacaoSelecionada.id}, com ${data.nota} estrela${data.nota > 1 ? "s" : ""}.`);
    } catch (error) {
      setErroAvaliacao(getApiErrorMessage(error, error.message || "Não foi possível salvar a avaliação."));
    } finally {
      setEnviandoAvaliacao(false);
    }
  }

  async function salvarDescricao() {
    if (salvandoDescricao || carregandoPerfil) return;
    setErroDescricao("");
    setMensagemDescricao("");
    setSalvandoDescricao(true);
    try {
      const { data } = await axios.put(apiUrl("perfil"), { descricao }, { headers: authHeaders(session) });
      if (!data?.perfil) throw new Error("A API não confirmou a descrição do perfil.");
      updateProfile(data.perfil, null, sessionToken);
      setDescricao(data.perfil.descricao || "");
      setMensagemDescricao("Descrição salva com sucesso.");
    } catch (error) {
      setErroDescricao(getApiErrorMessage(error, error.message || "Não foi possível salvar a descrição."));
    } finally {
      setSalvandoDescricao(false);
    }
  }

  async function copiarToken() {
    if (!session.token) return;
    await navigator.clipboard.writeText(session.token);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }

  async function enviarFoto(event) {
    const arquivo = event.target.files?.[0];
    event.target.value = "";
    if (!arquivo) return;

    setErroFoto("");
    setMensagemFoto("");
    if (!ACCEPTED_PHOTO_TYPES.includes(arquivo.type)) {
      setErroFoto("Escolha uma imagem JPEG, PNG ou WebP.");
      return;
    }
    if (arquivo.size > MAX_PHOTO_BYTES) {
      setErroFoto("A foto deve ter no máximo 2 MB.");
      return;
    }

    const dados = new FormData();
    dados.append("foto", arquivo);
    setEnviandoFoto(true);

    try {
      const resposta = await axios.post(apiUrl("perfil/foto"), dados, {
        headers: authHeaders(session),
      });
      const novaFoto = resposta.data?.foto_url || resposta.data?.perfil?.foto_url;
      if (!novaFoto) throw new Error("O servidor não retornou o endereço da foto.");
      updateProfilePhoto(novaFoto, sessionToken);
      setFoto(novaFoto);
      setMensagemFoto("Foto de perfil atualizada.");
    } catch (error) {
      setErroFoto(getApiErrorMessage(error, error.message || "Não foi possível enviar a foto. Tente novamente."));
    } finally {
      setEnviandoFoto(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 dark:bg-gray-900 dark:text-gray-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-500">{empresa ? "Perfil empresarial" : "Perfil profissional"}</p>
            <h1 className="mt-1 text-4xl font-bold">Olá, {nome}</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Gerencie as informações, o token e as ações do seu perfil.</p>
          </div>
          {autonomo && <Link to="/pedidos" className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-bold text-slate-950 hover:bg-green-400">Ver meus pedidos <Badge total={naoLidas} rotulo="novos pedidos" /></Link>}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-green-100 text-5xl dark:bg-gray-700">
              <FotoPerfil src={foto} alt={`Foto de perfil de ${nome}`} fallback={<span aria-hidden="true">{empresa ? "🏢" : "🧰"}</span>} />
            </div>
            <h2 className="mt-5 text-xl font-bold">{nome}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{empresa ? "Conta empresa" : "Conta autônomo"}</p>
            <input
              ref={inputFotoRef}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Escolher foto de perfil"
              onChange={enviarFoto}
            />
            <button
              type="button"
              onClick={() => inputFotoRef.current?.click()}
              disabled={enviandoFoto}
              className="mt-5 w-full rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-wait disabled:opacity-60"
            >
              {enviandoFoto ? "Enviando foto..." : foto ? "Trocar foto" : "Adicionar foto"}
            </button>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">JPEG, PNG ou WebP, até 2 MB.</p>
            {erroFoto && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">{erroFoto}</p>}
            {mensagemFoto && <p role="status" className="mt-3 text-sm font-medium text-green-700 dark:text-green-300">{mensagemFoto}</p>}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-bold">Descrição</h2>
            <textarea aria-label="Descrição do perfil" value={descricao} onChange={(event) => { setDescricao(event.target.value); setMensagemDescricao(""); }} maxLength={5000} disabled={carregandoPerfil || salvandoDescricao} className="mt-4 w-full rounded-lg border border-green-500 bg-transparent p-4 outline-none" rows={4} placeholder={autonomo ? "Fale sobre sua experiência e especialidades" : "Adicione uma descrição para sua empresa"} />
            <button type="button" onClick={salvarDescricao} disabled={carregandoPerfil || salvandoDescricao} className="mt-3 rounded-lg bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600">{carregandoPerfil ? "Carregando..." : salvandoDescricao ? "Salvando..." : "Salvar descrição"}</button>
            {erroDescricao && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">{erroDescricao}</p>}
            {mensagemDescricao && <p role="status" className="mt-3 text-sm font-semibold text-green-600">{mensagemDescricao}</p>}
          
            <div className=" flex justify-center flex-col  mt-6 rounded-lg border border-green-500 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30">
              <textarea name="disponibilidade" id="disponibilidade" placeholder="Insira sua disponibilidade..." className=" rounded-2xl px-3 py-1 " ></textarea> <button className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600">Alterar Disponibilidade</button>
            </div>
           
          </section>
           

          
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm dark:border-slate-700">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-400">Segurança da conta</p>
              <h2 className="mt-1 text-2xl font-bold">Token de acesso</h2>
              <p className="mt-2 text-sm text-slate-300">Este token identifica uma sessão de <strong>{empresa ? "empresa" : "autônomo"}</strong> e possui permissões próprias para esse perfil.</p>
            </div>
            <span className="rounded-full bg-green-400/15 px-3 py-1 text-sm font-semibold text-green-300">{empresa ? "TOKEN_EMPRESA" : "TOKEN_AUTONOMO"}</span>
          </div>
          <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950 p-4">
            <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Token atual</p>
            <code className="block break-all text-sm text-green-300">{tokenVisivel}</code>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => setMostrarToken((atual) => !atual)} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-green-400">{mostrarToken ? "Ocultar token" : "Mostrar token"}</button>
              <button type="button" onClick={copiarToken} disabled={!session.token} className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">{copiado ? "Copiado" : "Copiar token"}</button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <p><span className="text-slate-500">Tipo de conta:</span> {empresa ? "Empresa" : "Autônomo"}</p>
            <p><span className="text-slate-500">Identificador:</span> {session.tokenNome || (empresa ? "fixitnow-empresa" : "fixitnow-autonomo")}</p>
          </div>
        </section>

        {empresa && (
          <section id="avaliacoes" className="mt-8 scroll-mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-2xl font-bold">Autônomos selecionados</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Profissionais que sua empresa escolheu para os serviços. A avaliação fica disponível somente para contas empresariais e atendimentos concluídos.</p>
            {carregandoSolicitacoes && <p className="mt-4 text-sm text-gray-500">Carregando autônomos...</p>}
            {!carregandoSolicitacoes && !autonomosSelecionados.length && <p className="mt-4 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-600">Nenhum autônomo foi selecionado ainda. Abra um chamado para escolher um profissional.</p>}
            {autonomosSelecionados.length > 0 && (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {autonomosSelecionados.map((grupo) => {
                  const media = grupo.notas.length ? grupo.notas.reduce((soma, valor) => soma + valor, 0) / grupo.notas.length : 0;
                  const faltaAvaliar = grupo.concluidas.some((item) => !item.avaliacao);
                  return (
                    <li key={grupo.autonomo.id} className="rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700">
                      <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-green-100 text-4xl dark:bg-gray-700">
                        <FotoPerfil src={grupo.autonomo.foto_url} alt={`Foto de ${grupo.autonomo.nome}`} fallback={<span aria-hidden="true">🧰</span>} />
                      </div>
                      <h3 className="mt-3 font-bold">{grupo.autonomo.nome}</h3>
                      <p className="text-sm font-semibold text-green-600">{grupo.autonomo.especialidade || "Profissional"}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{grupo.pedidos} {grupo.pedidos === 1 ? "pedido" : "pedidos"} · {grupo.concluidas.length} {grupo.concluidas.length === 1 ? "concluído" : "concluídos"}</p>
                      {grupo.notas.length ? (
                        <p className="mt-2 text-lg text-yellow-400" aria-label={`Média ${media.toFixed(1)} de 5`}>{estrelas(media)} <span className="text-xs text-gray-500 dark:text-gray-400">{media.toFixed(1).replace(".", ",")} ({grupo.notas.length})</span></p>
                      ) : (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Ainda sem avaliações</p>
                      )}
                      <button
                        type="button"
                        onClick={() => avaliarAutonomo(grupo)}
                        disabled={!grupo.concluidas.length}
                        className="mt-3 w-full rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {!grupo.concluidas.length ? "Aguardando conclusão" : faltaAvaliar ? "Avaliar atendimento" : "Editar avaliação"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <form id="formulario-avaliacao" onSubmit={avaliar} className="mt-8">
              <label className="block text-sm font-semibold" htmlFor="solicitacao-avaliacao">Solicitação concluída</label>
              <select id="solicitacao-avaliacao" value={idSolicitacao} onChange={selecionarSolicitacao} disabled={carregandoSolicitacoes || enviandoAvaliacao} required className="mt-2 mb-4 w-full rounded-lg border border-green-500 bg-transparent p-3 outline-none">
                <option value="" className="bg-white text-gray-900">Selecione uma solicitação</option>
                {solicitacoes.map((item) => <option key={item.id} value={item.id} className="bg-white text-gray-900">#{item.id} — {item.servico?.nome || "Serviço"} — {item.autonomo?.nome || "Profissional"}{item.avaliacao ? " (já avaliada)" : ""}</option>)}
              </select>
              {carregandoSolicitacoes && <p className="mb-4 text-sm text-gray-500">Carregando solicitações...</p>}
              {!carregandoSolicitacoes && !solicitacoes.length && !erroAvaliacao && <p className="mb-4 text-sm text-gray-500">Nenhuma solicitação concluída disponível para avaliação.</p>}
              <p className="mb-3 text-sm font-semibold">Selecione as estrelas:</p>
              <div className="flex gap-2">{[1, 2, 3, 4, 5].map((estrela) => <button key={estrela} type="button" disabled={!idSolicitacao || enviandoAvaliacao} aria-label={`${estrela} estrelas`} aria-pressed={estrela === nota} onClick={() => { setNota(estrela); setMensagem(""); }} className={`text-4xl ${estrela <= nota ? "text-yellow-400" : "text-gray-400"}`}>★</button>)}</div>
              <label htmlFor="comentarios-avaliacao" className="mt-4 block text-sm font-semibold">Comentários (opcional)</label>
              <textarea id="comentarios-avaliacao" value={comentarios} onChange={(event) => { setComentarios(event.target.value); setMensagem(""); }} disabled={!idSolicitacao || enviandoAvaliacao} maxLength={5000} rows={3} className="mt-2 w-full rounded-lg border border-green-500 bg-transparent p-3 outline-none" />
              <button type="submit" disabled={!nota || !idSolicitacao || enviandoAvaliacao} className="mt-5 rounded-lg bg-green-500 px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{enviandoAvaliacao ? "Salvando avaliação..." : solicitacaoSelecionada?.avaliacao ? "Atualizar avaliação" : "Enviar avaliação"}</button>
              {erroAvaliacao && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">{erroAvaliacao}</p>}
              {mensagem && <p role="status" className="mt-3 text-sm font-semibold text-green-600">{mensagem}</p>}
            </form>
          </section>
        )}

        {autonomo && (
          <section className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/30">
            <h2 className="text-xl font-bold">Pedidos feitos para você</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Aceite ou recuse as solicitações recebidas, responda à empresa e atualize o andamento dos seus atendimentos. As avaliações são feitas somente pelas empresas.</p>
            <Link to="/pedidos" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-green-500 px-4 py-2 font-semibold text-green-700 hover:bg-green-100 dark:text-green-300">Abrir página de pedidos <Badge total={naoLidas} rotulo="novos pedidos" /></Link>
          </section>
        )}
      </div>
    </div>
  );
}

export default Perfil;
