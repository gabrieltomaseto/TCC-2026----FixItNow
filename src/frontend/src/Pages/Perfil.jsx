import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { authHeaders, getApiErrorMessage, getSession, isAutonomo, isEmpresa, apiUrl, updateProfile, updateProfilePhoto, profilePhotoUrl } from "../lib/auth";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function FotoAutonomo({ autonomo }) {
  const [foto, setFoto] = useState(() => profilePhotoUrl(autonomo?.foto_url));
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-3xl dark:bg-gray-700">
      {foto ? (
        <img src={foto} alt={`Foto de ${autonomo?.nome || "autônomo"}`} className="h-full w-full object-cover" onError={() => setFoto("")} />
      ) : (
        <span aria-hidden="true">🧰</span>
      )}
    </div>
  );
}

function Perfil() {
  const session = getSession();
  const empresa = isEmpresa(session);
  const autonomo = isAutonomo(session);
  const perfil = empresa ? session?.empresa : session?.autonomo;
  const [nomePerfil, setNomePerfil] = useState(perfil?.nome || session?.usuario?.name || "");
  const [cargaHoraria, setCargaHoraria] = useState(perfil?.carga_horaria || "");
  const [disponibilidade, setDisponibilidade] = useState(perfil?.disponibilidade || "");
  const dadosSalvosRef = useRef({ nome: perfil?.nome || session?.usuario?.name || "", cargaHoraria: perfil?.carga_horaria || "", disponibilidade: perfil?.disponibilidade || "" });
  const nome = nomePerfil || (empresa ? "Empresa" : "Autônomo");
  const [editandoDados, setEditandoDados] = useState(false);
  const [salvandoDados, setSalvandoDados] = useState(false);
  const [mensagemDados, setMensagemDados] = useState("");
  const [erroDados, setErroDados] = useState("");
  const [nota, setNota] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [mostrarToken, setMostrarToken] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [foto, setFoto] = useState(() => profilePhotoUrl(perfil?.foto_url || perfil?.avatar_url || perfil?.foto));
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [mensagemFoto, setMensagemFoto] = useState("");
  const [erroFoto, setErroFoto] = useState("");
  const inputFotoRef = useRef(null);
  const [descricao, setDescricao] = useState(perfil?.descricao || "");
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvandoDescricao, setSalvandoDescricao] = useState(false);
  const [mensagemDescricao, setMensagemDescricao] = useState("");
  const [erroDescricao, setErroDescricao] = useState("");
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [idSolicitacao, setIdSolicitacao] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [carregandoSolicitacoes, setCarregandoSolicitacoes] = useState(true);
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  const [erroAvaliacao, setErroAvaliacao] = useState("");
  const sessionToken = session?.token;

  useEffect(() => {
    if (!sessionToken) return undefined;
    let ativo = true;
    axios.get(apiUrl("perfil"), { headers: authHeaders({ token: sessionToken }) })
      .then(({ data }) => {
        if (!ativo || !data?.perfil) return;
        updateProfile(data.perfil, data.usuario, sessionToken);
        setDescricao(data.perfil.descricao || "");
        setNomePerfil(data.perfil.nome || data.usuario?.name || "");
        setCargaHoraria(data.perfil.carga_horaria || "");
        setDisponibilidade(data.perfil.disponibilidade || "");
        dadosSalvosRef.current = { nome: data.perfil.nome || data.usuario?.name || "", cargaHoraria: data.perfil.carga_horaria || "", disponibilidade: data.perfil.disponibilidade || "" };
        setFoto(profilePhotoUrl(data.perfil.foto_url));
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
        setSolicitacoes(data.filter((item) => ["finalizada"].includes(
          String(item.status).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        )));
      })
      .catch((error) => { if (ativo) setErroAvaliacao(getApiErrorMessage(error, error.message || "Não foi possível carregar as solicitações para avaliação.")); })
      .finally(() => { if (ativo) setCarregandoSolicitacoes(false); });
    return () => { ativo = false; };
  }, [empresa, sessionToken]);

  const solicitacaoSelecionada = solicitacoes.find((item) => String(item.id) === idSolicitacao);
  const autonomosAvaliacao = [...new Map(
    solicitacoes
      .filter((item) => item.autonomo?.id)
      .map((item) => [item.autonomo.id, item.autonomo])
  ).values()];

  function selecionarSolicitacao(event) {
    const id = event.target.value;
    const item = solicitacoes.find((solicitacao) => String(solicitacao.id) === id);
    setIdSolicitacao(id);
    setNota(item?.avaliacao?.nota || 0);
    setComentarios(item?.avaliacao?.comentarios || "");
    setMensagem("");
    setErroAvaliacao("");
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
      setErroAvaliacao("Selecione uma solicitação finalizada e uma nota de 1 a 5 estrelas.");
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
      setSolicitacoes((atuais) => atuais.map((item) => item.id === solicitacaoSelecionada.id ? { ...item, avaliacao: data } : item));
      setMensagem(`Avaliação ${avaliacaoExistente ? "atualizada" : "registrada"} para a solicitação #${solicitacaoSelecionada.id}, com ${data.nota} estrela${data.nota > 1 ? "s" : ""}.`);
    } catch (error) {
      setErroAvaliacao(getApiErrorMessage(error, error.message || "Não foi possível salvar a avaliação."));
    } finally {
      setEnviandoAvaliacao(false);
    }
  }

  async function salvarDadosPerfil() {
    if (salvandoDados || carregandoPerfil) return;
    const nomeNormalizado = nomePerfil.trim();
    if (!nomeNormalizado) {
      setErroDados("Informe um nome válido.");
      return;
    }
    setErroDados("");
    setMensagemDados("");
    setSalvandoDados(true);
    try {
      const payload = { nome: nomeNormalizado };
      if (autonomo) {
        payload.carga_horaria = cargaHoraria.trim() || null;
        payload.disponibilidade = disponibilidade.trim() || null;
      }
      const { data } = await axios.put(apiUrl("perfil"), payload, { headers: authHeaders(session) });
      if (!data?.perfil) throw new Error("A API não confirmou os dados do perfil.");
      updateProfile(data.perfil, data.usuario || null, sessionToken);
      setNomePerfil(data.perfil.nome || nomeNormalizado);
      setCargaHoraria(data.perfil.carga_horaria || "");
      setDisponibilidade(data.perfil.disponibilidade || "");
      dadosSalvosRef.current = { nome: data.perfil.nome || nomeNormalizado, cargaHoraria: data.perfil.carga_horaria || "", disponibilidade: data.perfil.disponibilidade || "" };
      setEditandoDados(false);
      setMensagemDados("Dados do perfil salvos com sucesso.");
    } catch (error) {
      setErroDados(getApiErrorMessage(error, error.message || "Não foi possível salvar os dados do perfil."));
    } finally {
      setSalvandoDados(false);
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
      setFoto(profilePhotoUrl(novaFoto));
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
          {autonomo && <Link to="/pedidos" className="rounded-lg bg-green-500 px-5 py-3 font-bold text-slate-950 hover:bg-green-400">Ver meus pedidos</Link>}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-green-100 text-5xl dark:bg-gray-700">
              {foto ? (
                <img src={foto} alt={`Foto de perfil de ${nome}`} className="h-full w-full object-cover" onError={() => setFoto("")} />
              ) : (
                <span aria-hidden="true">{empresa ? "🏢" : "🧰"}</span>
              )}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Dados do perfil</h2>
              <button type="button" onClick={() => { if (editandoDados) { setNomePerfil(dadosSalvosRef.current.nome); setCargaHoraria(dadosSalvosRef.current.cargaHoraria); setDisponibilidade(dadosSalvosRef.current.disponibilidade); } setEditandoDados((atual) => !atual); setErroDados(""); setMensagemDados(""); }} className="rounded-lg border border-green-500 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 dark:hover:bg-gray-700">{editandoDados ? "Cancelar" : "Editar dados"}</button>
            </div>
            {editandoDados ? (
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-semibold">Nome
                  <input value={nomePerfil} onChange={(event) => setNomePerfil(event.target.value)} maxLength={100} className="mt-2 w-full rounded-lg border border-green-500 bg-transparent p-3 outline-none" />
                </label>
                {autonomo && <>
                  <label className="block text-sm font-semibold">Carga horária
                    <input value={cargaHoraria} onChange={(event) => setCargaHoraria(event.target.value)} maxLength={100} placeholder="Ex.: 8 horas por dia" className="mt-2 w-full rounded-lg border border-green-500 bg-transparent p-3 outline-none" />
                  </label>
                  <label className="block text-sm font-semibold">Disponibilidade de horários
                    <input value={disponibilidade} onChange={(event) => setDisponibilidade(event.target.value)} maxLength={100} placeholder="Ex.: segunda a sexta, das 8h às 18h" className="mt-2 w-full rounded-lg border border-green-500 bg-transparent p-3 outline-none" />
                  </label>
                </>}
                <button type="button" onClick={salvarDadosPerfil} disabled={salvandoDados} className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-950 hover:bg-green-400 disabled:opacity-60">{salvandoDados ? "Salvando..." : "Salvar dados"}</button>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 text-sm text-gray-600 dark:text-gray-300"><p><span className="font-semibold">Nome:</span> {nomePerfil || "—"}</p>{autonomo && <><p><span className="font-semibold">Carga horária:</span> {cargaHoraria || "Não informada"}</p><p><span className="font-semibold">Disponibilidade:</span> {disponibilidade || "Não informada"}</p></>}</div>
            )}
            {erroDados && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">{erroDados}</p>}
            {mensagemDados && <p role="status" className="mt-3 text-sm font-semibold text-green-600">{mensagemDados}</p>}
            <h2 className="mt-7 text-xl font-bold">Descrição</h2>
            <textarea aria-label="Descrição do perfil" value={descricao} onChange={(event) => { setDescricao(event.target.value); setMensagemDescricao(""); }} maxLength={5000} disabled={carregandoPerfil || salvandoDescricao} className="mt-4 w-full rounded-lg border border-green-500 bg-transparent p-4 outline-none" rows={4} placeholder={autonomo ? "Fale sobre sua experiência e especialidades" : "Adicione uma descrição para sua empresa"} />
            <button type="button" onClick={salvarDescricao} disabled={carregandoPerfil || salvandoDescricao} className="mt-3 rounded-lg bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600">{carregandoPerfil ? "Carregando..." : salvandoDescricao ? "Salvando..." : "Salvar descrição"}</button>
            {erroDescricao && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">{erroDescricao}</p>}
            {mensagemDescricao && <p role="status" className="mt-3 text-sm font-semibold text-green-600">{mensagemDescricao}</p>}
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
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-2xl font-bold">Avaliar atendimento</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">A avaliação fica disponível somente para contas empresariais e solicitações finalizadas.</p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Autônomos do atendimento</h3>
              {autonomosAvaliacao.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {autonomosAvaliacao.map((autonomoItem) => (
                    <div key={autonomoItem.id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                      <FotoAutonomo autonomo={autonomoItem} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{autonomoItem.nome || "Autônomo"}</p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{autonomoItem.especialidade || "Profissional"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">O profissional aparecerá aqui quando houver uma solicitação finalizada.</p>
              )}
            </div>
            <form onSubmit={avaliar} className="mt-6">
              <label className="block text-sm font-semibold" htmlFor="solicitacao-avaliacao">Solicitação finalizada</label>
              <select id="solicitacao-avaliacao" value={idSolicitacao} onChange={selecionarSolicitacao} disabled={carregandoSolicitacoes || enviandoAvaliacao} required className="mt-2 mb-4 w-full rounded-lg border border-green-500 bg-transparent p-3 outline-none">
                <option value="" className="bg-white text-gray-900">Selecione uma solicitação</option>
                {solicitacoes.map((item) => <option key={item.id} value={item.id} className="bg-white text-gray-900">#{item.id} — {item.servico?.nome || "Serviço"} — {item.autonomo?.nome || "Profissional"}{item.avaliacao ? " (já avaliada)" : ""}</option>)}
              </select>
              {carregandoSolicitacoes && <p className="mb-4 text-sm text-gray-500">Carregando solicitações...</p>}
              {!carregandoSolicitacoes && !solicitacoes.length && !erroAvaliacao && <p className="mb-4 text-sm text-gray-500">Nenhuma solicitação finalizada disponível para avaliação.</p>}
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
            <p className="mt-2 text-gray-600 dark:text-gray-300">Consulte as solicitações recebidas e atualize o andamento dos seus atendimentos.</p>
            <Link to="/pedidos" className="mt-4 inline-flex rounded-lg border border-green-500 px-4 py-2 font-semibold text-green-700 hover:bg-green-100 dark:text-green-300">Abrir página de pedidos</Link>
          </section>
        )}
      </div>
    </div>
  );
}

export default Perfil;
