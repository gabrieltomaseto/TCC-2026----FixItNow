import AsidePainel from "../Components/AsidePainel"

function Historico (){
    const historicoSolicitacoes = [
        { tipoServico: 'Manutenção', data: '01-10-2023', status: 'Não aceita', custo: 'R$ 150,00' },
        { tipoServico: 'Suporte', data: '02-10-2023', status: 'Em andamento', custo: 'R$ 100,00' },
        { tipoServico: 'Manutenção', data: '05-10-2023', status: 'Concluída', custo: 'R$ 200,00' },
        { tipoServico: 'Suporte', data: '08-10-2023', status: 'Finalizada', custo: 'R$ 150,00' },
    ];

    return(
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">

        <AsidePainel />

        <main className="flex-1 w-full">
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-7 pt-6 sm:pt-7 pb-4 bg-white shadow-sm border-b">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Histórico <span className="text-green-500">de</span> Solicitações
              </h1>
            </div>

            <div className="p-4 sm:p-6 lg:p-7">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Opções de Filtragem</h2>
              <div className="mb-8 rounded-2xl border border-gray-300 bg-white p-4 sm:p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                    
                <div className="flex flex-col gap-2">
                  <label htmlFor="tipoServ" className="text-sm font-semibold text-gray-700">
                    Tipo de serviço
                  </label>
                  <select
                    name="tipoServ"
                    id="tipoServ"
                    className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    <option value="1">Manutenção</option>
                    <option value="2">Suporte</option>
                    <option value="3">Todos</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="dataSolicitacao" className="text-sm font-semibold text-gray-700">
                    Data
                  </label>
                  <input
                    type="date"
                    name="dataSolicitacao"
                    id="dataSolicitacao"
                    className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="status" className="text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    <option value="1">Não aceita</option>
                    <option value="2">Em andamento</option>
                    <option value="3">Concluída</option>
                  </select>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Solicitações</h2>
              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs sm:text-sm">Tipo de Serviço</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Data</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs sm:text-sm hidden md:table-cell">Custo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoSolicitacoes.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.tipoServico}</td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{item.data}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.status === 'Concluída' ? 'bg-green-100 text-green-800' :
                            item.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'Finalizada' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 hidden md:table-cell">{item.custo}</td>
                      </tr>
                    ))}
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
