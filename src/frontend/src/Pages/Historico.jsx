function Historico (){
    const historicoSolicitacoes = [
        { tipoServico: 'Manutenção', data: '01-10-2023', status: 'Não aceita', custo: 'R$ 150,00' },
        { tipoServico: 'Suporte', data: '02-10-2023', status: 'Em andamento', custo: 'R$ 100,00' },
        { tipoServico: 'Manutenção', data: '05-10-2023', status: 'Concluída', custo: 'R$ 200,00' },
        { tipoServico: 'Suporte', data: '08-10-2023', status: 'Finalizada', custo: 'R$ 150,00' },
    ];

    return(

        <div className="min-h-screen bg-zinc-100 text-zinc-800">
            <div className="px-7 pt-7 pb-4 bg-white shadow-sm">
                <h1 className="text-4xl font-bold text-black">
                    Histórico <span className="text-green-500">de</span> Solicitações
                </h1>
            </div>

            <div className="mx-7 h-px bg-zinc-300" />

            <div className="p-7">
                <h2 className="text-xl font-bold text-zinc-800">Opções de Filtragem</h2>
                <div className="mb-8 rounded-2xl border border-zinc-300 bg-white p-5 shadow-sm md:flex md:items-end md:justify-between md:space-x-8">
                    
                    <form action="" method="#" className="flex flex-col gap-2">
                        <label htmlFor="tipoServ" className="text-sm font-semibold text-zinc-700">
                            Tipo de serviço
                        </label>
                        <select
                            name="tipoServ"
                            id="tipoServ"
                            className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="1">Manutenção</option>
                            <option value="2">Suporte</option>
                            <option value="3">Todos</option>
                        </select>
                    </form>

                    <form action="" method="#" className="mt-4 flex flex-col gap-2 md:mt-0">
                        <label htmlFor="dataSolicitacao" className="text-sm font-semibold text-zinc-700">
                            Data
                        </label>
                        <input
                            type="date"
                            name="dataSolicitacao"
                            id="dataSolicitacao"
                            className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </form>

                    <form action="" method="#" className="mt-4 flex flex-col gap-2 md:mt-0" >
                        <label htmlFor="status" className="text-sm font-semibold text-zinc-700">
                            Status
                        </label>
                        <select
                            name="status"
                            id="status"
                            className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="1">Não aceita</option>
                            <option value="2">Em andamento</option>
                            <option value="3">Concluída</option>
                
                        </select>
                    </form>

                    <form action="" className="mt-4 flex flex-col gap-2 md:mt-0" >
                        <label htmlFor="custo" className="text-sm font-semibold text-zinc-700">
                            Custo
                        </label>
                        <input
                            type="number"
                            name="custo"
                            id="custo"
                            className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </form>
                </div>

                <div className="overflow-hidden rounded-2xl border border-zinc-300 bg-white shadow-sm">
                    <table className="min-w-full text-left text-sm text-zinc-700">
                        <thead className="bg-zinc-200 text-zinc-800">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Tipo de Serviço</th>
                                <th className="px-5 py-3 font-semibold">Data</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold">Custo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoSolicitacoes.map((item, index) => (
                                <tr
                                    key={`${item.tipoServico}-${item.data}-${index}`}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}
                                >
                                    <td className="border-t border-zinc-200 px-5 py-3">{item.tipoServico}</td>
                                    <td className="border-t border-zinc-200 px-5 py-3">{item.data}</td>
                                    <td className="border-t border-zinc-200 px-5 py-3">
                                        <span className="inline-flex rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="border-t border-zinc-200 px-5 py-3">{item.custo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Historico;