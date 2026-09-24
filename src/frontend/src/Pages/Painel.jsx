import './index.css'

function Painel() {
    const solicitacoes = [
    {
      id: "#125",
      servico: "Elétrica",
      local: "Sala 101",
      status: "Em andamento",
      data: "10/05/2026",
    },
    {
      id: "#124",
      servico: "Hidráulica",
      local: "Banheiro",
      status: "Aberta",
      data: "09/05/2026",
    },
    {
      id: "#123",
      servico: "Ar Condicionado",
      local: "Sala 203",
      status: "Concluída",
      data: "08/05/2026",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/*SIDEBAR*/}
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

          <button className="w-full flex items-center gap-3 bg-green-500 text-slate-950 px-4 py-3 rounded-lg font-semibold">
            ▦
            <span>Painel</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800">
            ▤
            <span>Minhas solicitações</span>
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


      <main className="flex-1">

        {/* HEADER */}
        <header className="h-24 bg-white border-b flex items-center justify-between px-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Painel
          </h2>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">
              Olá
            </span>

            <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center">
              👤
            </div>
          </div>
        </header>

        <section className="p-8">

   
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

     
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">
                  SOLICITAÇÕES
                  <br />
                  ABERTAS
                </h3>

                <span className="text-gray-400 text-xl">
                  ◉
                </span>
              </div>

              <p className="text-5xl font-bold mt-6">
                8
              </p>
            </div>

           
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">
                  EM ANDAMENTO
                </h3>

                <span className="text-green-500 text-xl">
                  ↗
                </span>
              </div>

              <p className="text-5xl font-bold mt-6">
                3
              </p>
            </div>

          
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">
                  CONCLUÍDAS
                </h3>

                <span className="text-green-500 text-xl">
                  ✓
                </span>
              </div>

              <p className="text-5xl font-bold mt-6">
                24
              </p>
            </div>

          
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">
                  CANCELADAS
                </h3>

                <span className="text-red-400 text-xl">
                  ⊗
                </span>
              </div>

              <p className="text-5xl font-bold mt-6">
                2
              </p>
            </div>

          </div>

       
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-8 overflow-hidden">

          
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Solicitações recentes
              </h2>

              <button className="text-green-600 font-semibold hover:text-green-700">
                Ver todas →
              </button>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-gray-50 text-left text-sm text-gray-600">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">SERVIÇO</th>
                    <th className="px-6 py-4">LOCAL</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4">DATA</th>
                    <th className="px-6 py-4">AÇÃO</th>
                  </tr>
                </thead>

                <tbody>

                  {solicitacoes.map((solicitacao) => (
                    <tr
                      key={solicitacao.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-6 py-5 font-bold">
                        {solicitacao.id}
                      </td>

                      <td className="px-6 py-5">
                        {solicitacao.servico}
                      </td>

                      <td className="px-6 py-5">
                        {solicitacao.local}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`
                            px-3 py-1 rounded-full text-sm font-medium
                            ${
                              solicitacao.status === "Concluída"
                                ? "bg-green-100 text-green-700"
                                : solicitacao.status === "Em andamento"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          `}
                        >
                          • {solicitacao.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {solicitacao.data}
                      </td>

                      <td className="px-6 py-5">
                        <button className="text-gray-400 hover:text-gray-700 text-xl">
                          ◉
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Painel
