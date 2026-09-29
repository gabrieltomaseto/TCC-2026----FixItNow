function Sidebar() {
  const itens = [
    "Início",
    "Palpites da Copa",
    "Comunicados",
    "Atendimentos",
    "Visão de Horários",
    "Frequência",
    "Notas Acadêmicas",
    "Agenda",
    "Leitura",
  ];

  return (
    <aside className="fixed left-0 top-0 z-10 h-screen w-[270px] border-r border-gray-200 bg-[#f5f6f7]">
      <div className="flex h-[105px] items-center justify-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-700">
          FIEC
        </h1>
      </div>

      <div className="px-4 py-5">
        <p className="mb-3 px-3 text-xs font-medium text-gray-400">
          Meus apps
        </p>

        <div className="space-y-1">
          {itens.map((item, index) => (
            <div
              key={item}
              className={`flex h-10 items-center rounded-lg px-4 text-sm ${
                index === 0
                  ? "bg-[#e1e5e9] font-semibold text-gray-800"
                  : "text-gray-600"
              }`}
            >
              <span className="mr-3 text-base">
                {index === 0 && "⌂"}
                {index === 1 && "🏆"}
                {index === 2 && "▤"}
                {index === 3 && "💬"}
                {index === 4 && "◷"}
                {index === 5 && "✓"}
                {index === 6 && "☆"}
                {index === 7 && "▣"}
                {index === 8 && "▤"}
              </span>

              {item}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;