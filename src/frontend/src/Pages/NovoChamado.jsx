import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import AsidePainel from "../Components/AsidePainel";
import { apiUrl, authHeaders, getApiErrorMessage, getSession, isEmpresa } from "../lib/auth";
import { INITIAL_CHAMADO, chamadoPayload } from "../lib/chamado";

const tiposServico = [
  'Elétrica',
  'Hidráulica',
  'Ar-condicionado',
  'Manutenção predial',
  'Pintura',
  'Refrigeração',
  'Informática / redes',
  'Outros',
];

const prioridades = ['Baixa', 'Média', 'Alta', 'Urgente'];

function NovoChamado() {
  const [formData, setFormData] = useState({ ...INITIAL_CHAMADO });
  const [autonomos, setAutonomos] = useState([]);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [idCriado, setIdCriado] = useState(null);
  const session = getSession();
  const tipoConta = session?.tipo;
  useEffect(() => {
    if (tipoConta !== 'empresa') return;
    let ativo = true;
    axios.get(apiUrl('autonomos')).then(({ data }) => {
      if (!ativo) return;
      setAutonomos(Array.isArray(data) ? data.filter((item) => item.ativo !== false) : []);
    }).catch(() => { if (ativo) setErro('Não foi possível carregar os autônomos disponíveis.'); });
    return () => { ativo = false; };
  }, [tipoConta]);

  const [enviado, setEnviado] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setEnviado(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (enviando) return;
    setErro('');
    setEnviado(false);
    if (!isEmpresa(session)) { setErro('Somente empresas podem abrir chamados.'); return; }
    if (!formData.id_autonomo) { setErro('Selecione o autônomo que receberá o pedido.'); return; }
    try {
      const payload = chamadoPayload(formData);
      setEnviando(true);
      const { data } = await axios.post(apiUrl('solicitacoes'), payload, { headers: authHeaders(session) });
      if (!data?.id) throw new Error('A API não confirmou o número do chamado. Confira o histórico antes de reenviar.');
      setIdCriado(data.id);
      setEnviado(true);
    } catch (error) {
      setErro(getApiErrorMessage(error, error.message || 'Não foi possível enviar o pedido.'));
    } finally {
      setEnviando(false);
    }
  };

  function limpForm(event) {
    event.preventDefault();
    if (enviando) return;
    setFormData({ ...INITIAL_CHAMADO });
    setErro('');
    setEnviado(false);
    setIdCriado(null);
  }

  if (!isEmpresa(session)) return <Navigate to="/perfil" replace />;
 
  return (
  <>
     
<div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex-row">
<AsidePainel />

    <section id="chamado" className="min-w-0 flex-1 bg-slate-100 dark:bg-slate-950 py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
            Atendimento
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
            Abertura de chamado de serviço
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.3fr]">
          <div className="rounded-2xl bg-slate-900 p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold text-green-400">Como funciona?</h3>
            <ul className="mt-6 space-y-5 text-sm text-slate-200">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-green-400" />
                <span>Informe o tipo de problema e o local da ocorrência.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-green-400" />
                <span>Defina a prioridade para agilizar a resposta do técnico.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-green-400" />
                <span>Receba acompanhamento do status do chamado em seguida.</span>
              </li>
            </ul>

            <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tempo médio</p>
              <p className="mt-2 text-3xl font-bold text-white">24h</p>
              <p className="text-sm text-slate-300">para confirmação e agendamento.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} onReset={limpForm} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg md:p-8">
            {erro && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{erro}</div>}
            {enviado && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Chamado #{idCriado} enviado com sucesso. Nossa equipe entrará em contato em breve.
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nome
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Endereço da empresa 
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Nome da empresa ou setor"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Local da ocorrência
                <input
                  type="text"
                  name="local"
                  value={formData.local}
                  onChange={handleChange}
                  placeholder="Ex.: Sala 02, andar 1"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Telefone
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tipo de serviço
                <select
                  name="tipoServico"
                  value={formData.tipoServico}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                >
                  {tiposServico.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 md:col-span-2">
                Autônomo responsável
                <select name="id_autonomo" value={formData.id_autonomo} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none focus:border-green-500">
                  <option value="">Selecione um autônomo</option>
                  {autonomos.map((autonomo) => <option key={autonomo.id} value={autonomo.id}>{autonomo.nome} — {autonomo.especialidade || 'Profissional'}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 us">
                Prioridade
                <select
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                >
                  {prioridades.map((prioridade) => (
                    <option key={prioridade} value={prioridade}>
                      {prioridade}
                    </option>
                  ))}
                </select>

              </label>

              <label htmlFor="preco" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Preço estimado
                <input
                  type="text" 
                  placeholder="R$ 0,00"
                  value={formData.preco}
                  onChange={handleChange}
                  name="preco"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                  />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 md:col-span-2">
                Data preferencial
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                />
              </label>

            

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 md:col-span-2">
                Descrição do problema
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o problema, sintomas, equipamentos envolvidos e o que você precisa."
                  rows="5"
                  className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-700"
                  required
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="reset"
                disabled={enviando}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-2.5 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Limpar
              </button>

              <button
                type="submit"
                disabled={enviando || enviado}
                className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700"
              >
                {enviando ? 'Enviando...' : 'Enviar chamado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
</div>
    </>
  );
}

export default NovoChamado;
