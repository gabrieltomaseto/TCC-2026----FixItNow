import { useState } from 'react';

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
    empresa: '',
    local: '',
    telefone: '',
    tipoServico: 'Elétrica',
    prioridade: 'Média',
    data: '',
    descricao: '',
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setEnviado(true);
  };

  const [limpar,setLimpar] = useState(false);

  function limpForm(){
    setLimpar(!limpar)
  }
 
  return (
  <>

     
<div className='flex'>
    <aside className="w-64 bg-slate-950 text-white flex flex-col">
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-500">
            ● FIX IT NOW
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Portal de Gestão
          </p>
        </div>

  
        <nav className="px-4 space-y-2">

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800">
            ▦
            <span>Painel</span>
          </button>

          <button className="w-full flex items-center gap-3 bg-green-500 text-slate-950 px-4 py-3 rounded-lg font-semibold">
            ▤
            <span>Abrir Chamado</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800">
            ◷
            <span>Histórico</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800">
            ♙
            <span>Profissionais</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800">
            ☆
            <span>Avaliações</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800">
            ⚙
            <span>Configurações</span>
          </button>

        </nav>

        <div className="mt-auto p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-800 rounded-lg">
          
            <span>Sair</span>
          </button>
        </div>

      </aside>

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
                Chamado enviado com sucesso. Nossa equipe entrará em contato em breve.
              </div>
            )}

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
                Empresa / local
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Nome da empresa ou setor"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-green-500 focus:bg-white"
                />
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
                onClick={() => limpForm()} 
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Limpar
              </button>

              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700"
              >
                Enviar chamado
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
