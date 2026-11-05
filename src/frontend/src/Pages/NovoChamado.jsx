import { useEffect, useState } from 'react';
import axios from 'axios';
import AsidePainel from "../Components/AsidePainel";
const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

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
  const [formData, setFormData] = useState({
    nome: '',
    id_empresa: '',
    local: '',
    telefone: '',
    tipoServico: 'Elétrica',
    prioridade: 'Média',
    data: '',
    descricao: '',
  });

  const [enviado, setEnviado] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [carregandoEmpresas, setCarregandoEmpresas] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/empresas`)
      .then(({ data }) => setEmpresas(data))
      .catch(() => setErro('Não foi possível carregar as empresas. Confira se a API está ativa.'))
      .finally(() => setCarregandoEmpresas(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEnviado(false);
    setErro('');
    setEnviando(true);
    const detalhes = [
      formData.descricao.trim(),
      `Solicitante: ${formData.nome.trim()}`,
      `Local da ocorrência: ${formData.local.trim()}`,
      `Telefone para contato: ${formData.telefone.trim()}`,
      `Prioridade: ${formData.prioridade}`,
      formData.data ? `Data preferencial: ${formData.data}` : '',
    ].filter(Boolean).join('\n');
    try {
      await axios.post(`${API_URL}/api/solicitacoes`, {
        data_solicitacao: new Date().toISOString().slice(0, 10),
        data_inicio: formData.data || null,
        descricao_problema: detalhes,
        id_empresa: Number(formData.id_empresa),
        categoria_servico: formData.tipoServico,
      });
      setEnviado(true);
      setFormData((prev) => ({ ...prev, nome: '', local: '', telefone: '', data: '', descricao: '' }));
    } catch (error) {
      const validation = error.response?.data?.errors;
      setErro(validation ? Object.values(validation).flat().join(' ') : (error.response?.data?.message || 'Não foi possível salvar o chamado. Confira a API e tente novamente.'));
    } finally {
      setEnviando(false);
    }
  };
 
  return (
  <>
     
<div className='flex flex-col lg:flex-row'>
<AsidePainel />

    <section id="chamado" className="bg-slate-100 py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
            Atendimento
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
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

          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
            {enviado && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Chamado salvo no banco de dados. Nossa equipe entrará em contato em breve.
              </div>
            )}
            {erro && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{erro}</div>}

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Nome
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Empresa
                <select
                  name="id_empresa"
                  value={formData.id_empresa}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                  required
                  disabled={carregandoEmpresas || empresas.length === 0}
                >
                  <option value="">{carregandoEmpresas ? 'Carregando empresas…' : empresas.length ? 'Selecione sua empresa' : 'Nenhuma empresa cadastrada'}</option>
                  {empresas.map((empresa) => <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>)}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Local da ocorrência
                <input
                  type="text"
                  name="local"
                  value={formData.local}
                  onChange={handleChange}
                  placeholder="Ex.: Sala 02, andar 1"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Telefone
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Tipo de serviço
                <select
                  name="tipoServico"
                  value={formData.tipoServico}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                >
                  {tiposServico.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Prioridade
                <select
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                >
                  {prioridades.map((prioridade) => (
                    <option key={prioridade} value={prioridade}>
                      {prioridade}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Data preferencial
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                Descrição do problema
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva o problema, sintomas, equipamentos envolvidos e o que você precisa."
                  rows="5"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                  required
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="reset"
                onClick={() => { setFormData({ nome: '', id_empresa: '', local: '', telefone: '', tipoServico: 'Elétrica', prioridade: 'Média', data: '', descricao: '' }); setEnviado(false); setErro(''); }}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Limpar
              </button>

              <button
                type="submit"
                disabled={enviando || carregandoEmpresas || empresas.length === 0}
                className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? 'Salvando…' : 'Enviar chamado'}
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
