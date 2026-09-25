function Dashboard() {
  const avisos = [
    {
      id: 1,
      titulo: "Entrega de atividades",
      descricao: "Confira as atividades pendentes da semana.",
    },
    {
      id: 2,
      titulo: "Prova próxima",
      descricao: "Sua próxima avaliação está chegando.",
    },
    {
      id: 3,
      titulo: "Novo material",
      descricao: "Um novo material foi disponibilizado.",
    },
  ];

  const atalhos = [
    "Minhas disciplinas",
    "Atividades",
    "Notas",
    "Frequência",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 p-5 hidden md:block">
        <h1 className="text-2xl font-bold text-blue-700 mb-8">
          Sophia
        </h1>

        <nav className="space-y-2">
          <a
            href="#"
            className="block bg-blue-600 text-white px-4 py-3 rounded-lg"
          >
            Início
          </a>

          <a
            href="#"
            className="block px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Disciplinas
          </a>

          <a
            href="#"
            className="block px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Atividades
          </a>

          <a
            href="#"
            className="block px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Notas
          </a>

          <a
            href="#"
            className="block px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            Configurações
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-6">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-500">
              Bem-vindo novamente
            </p>

            <h2 className="text-3xl font-bold text-gray-800">
              Olá Matheus 👋
            </h2>
          </div>

          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            M
          </div>
        </header>


        <section className="bg-blue-600 text-white rounded-2xl p-6 mb-6">
          <p className="text-blue-100 mb-2">
            Portal do aluno
          </p>

          <h2 className="text-2xl font-bold mb-2">
            Continue seus estudos
          </h2>

          <p className="text-blue-100">
            Acesse suas disciplinas, atividades e acompanhe seu desempenho.
          </p>
        </section>

    
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Acesso rápido
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {atalhos.map((atalho) => (
              <div
                key={atalho}
                className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md cursor-pointer"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                  ✓
                </div>

                <h3 className="font-semibold text-gray-800">
                  {atalho}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* PARTE INFERIOR */}
        <div className="grid md:grid-cols-2 gap-6">

    
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Avisos
            </h2>

            <div className="space-y-4">
              {avisos.map((aviso) => (
                <div
                  key={aviso.id}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <h3 className="font-semibold text-gray-800">
                    {aviso.titulo}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {aviso.descricao}
                  </p>
                </div>
              ))}
            </div>
          </section>

 
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Meu desempenho
            </h2>

            <div className="space-y-5">

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Atividades
                  </span>

                  <span className="font-bold">
                    80%
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full w-[80%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Frequência
                  </span>

                  <span className="font-bold">
                    92%
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Notas
                  </span>

                  <span className="font-bold">
                    75%
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full w-[75%]" />
                </div>
              </div>

            </div>
          </section>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;