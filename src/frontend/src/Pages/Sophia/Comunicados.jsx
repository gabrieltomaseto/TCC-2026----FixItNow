function Comunicados() {
  const comunicados = [
    {
      titulo: "BORA JOGAR XADREZ? ",
      data: "25 de agosto de 2026",
    },
    {
      titulo: "OFICINA DE MÚSICA ",
      data: "25 de agosto de 2026",
    },
    {
      titulo: "AULA SUSPENSA",
      data: "21 de agosto de 2026",
    },
  ];

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500 text-white">
          ▤
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Comunicados
          </h2>

          <p className="text-sm text-gray-500">
            Confira as últimas atualizações
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-hidden">
        {comunicados.map((comunicado) => (
          <div
            key={comunicado.titulo}
            className="h-[130px] min-w-[375px] rounded-xl border border-gray-200 bg-white p-4"
          >
            <h3 className="text-sm font-semibold">
              {comunicado.titulo}
            </h3>

            <p className="mt-12 text-xs text-gray-400">
              {comunicado.data}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Comunicados;