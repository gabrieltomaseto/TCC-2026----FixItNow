
import AsidePainel from "../Components/AsidePainel"

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
    <>
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50">
      
      {/*SIDEBAR*/}
      <AsidePainel />


      <main className="flex-1 w-full">

        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 p-4 lg:h-24 lg:px-10 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Painel
          </h2>

          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <span className="font-semibold text-gray-700 text-sm lg:text-base">
              Olá
            </span>

            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center lg:w-11 lg:h-11">
              👤
            </div>
          </div>
        </header>

        <section className="p-4 sm:p-6 lg:p-8">

   
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

     
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700 text-sm">
                  SOLICITAÇÕES
                  <br />
                  ABERTAS
                </h3>

                <span className="text-gray-400 text-lg">
                  ◉
                </span>
              </div>

              <p className="text-3xl sm:text-5xl font-bold mt-4 sm:mt-6">
                8
              </p>
            </div>

           
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700 text-sm">
                  EM ANDAMENTO
                </h3>

                <span className="text-green-500 text-lg">
                  ↗
                </span>
              </div>

              <p className="text-3xl sm:text-5xl font-bold mt-4 sm:mt-6">
                3
              </p>
            </div>

          
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700 text-sm">
                  CONCLUÍDAS
                </h3>

                <span className="text-blue-500 text-lg">
                  ✓
                </span>
              </div>

              <p className="text-3xl sm:text-5xl font-bold mt-4 sm:mt-6">
                12
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700 text-sm">
                  TAXA DE
                  <br />
                  CONCLUSÃO
                </h3>

                <span className="text-orange-500 text-lg">
                  📊
                </span>
              </div>

              <p className="text-3xl sm:text-5xl font-bold mt-4 sm:mt-6">
                60%
              </p>
            </div>
          </div>

          <div className="mt-8 lg:mt-10">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Últimas Solicitações
            </h3>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Serviço</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Local</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoes.map((sol) => (
                    <tr key={sol.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-green-600">{sol.id}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">{sol.servico}</td>
                      <td className="px-4 py-3 hidden md:table-cell">{sol.local}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          sol.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' :
                          sol.status === 'Concluída' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sol.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">{sol.data}</td>
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
