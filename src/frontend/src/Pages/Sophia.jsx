export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#333] font-sans">
      {/* Sidebar / Menu Lateral */}
      <aside className="w-64 bg-[#F1F3F5] border-r border-gray-200 p-4 flex flex-col justify-between select-none">
        <div>
          {/* Header da Sidebar com Logo FIEC */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-gray-800">FIEC</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>

          <div className="text-xs text-gray-400 font-medium px-2 mb-2">Meus apps</div>

          {/* Lista de Navegação Principal */}
          <nav className="space-y-1 text-sm">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-[#E2E8F0] text-gray-900 rounded-md font-medium">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Início
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Palpites da Copa
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Comunicados
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
              <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 012.121-14.85" />
              </svg>
              Atendimentos
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Visão de Horários
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequência
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Notas Acadêmicas
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
              <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agenda
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Leitura
            </a>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="space-y-1 text-sm border-t border-gray-200 pt-4">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ajuda e novidades
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Minha conta
          </a>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 max-w-6xl">
        {/* Banner de Saudação */}
        <div 
          className="relative rounded-2xl p-8 text-white overflow-hidden bg-cover bg-center shadow-sm min-h-[160px] flex flex-col justify-end"
          style={{ 
            backgroundImage: "linear-gradient(to right, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.4)), url('https://placehold.co/1200x300/1e293b/ffffff?text=%23EUSOUFIEC')" 
          }}
        >
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            Boa tarde, Matheus! 👋
          </h1>
          <p className="text-sm text-gray-300 mt-1">Terça-feira, 25 de agosto</p>
        </div>

        {/* Seção: Links rápidos */}
        <section className="mt-8">
          <h2 className="text-base font-semibold text-gray-800">Links rápidos</h2>
          <p className="text-xs text-gray-400 mb-4">Acesse os principais links rapidamente</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            {/* Card Link 1 */}
            <a href="#" className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between h-24">
              <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">FIEC</div>
              <div>
                <div className="font-semibold text-xs text-gray-800 truncate">Site Instituciona...</div>
                <div className="text-[10px] text-gray-400 truncate">fiec.com.br</div>
              </div>
            </a>

            {/* Card Link 2 */}
            <a href="#" className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between h-24">
              <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">DP</div>
              <div>
                <div className="font-semibold text-xs text-gray-800 truncate">DP (Dependênci...</div>
                <div className="text-[10px] text-gray-400 truncate">alunos.fiec.dev.br</div>
              </div>
            </a>

            {/* Card Link 3 */}
            <a href="#" className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between h-24">
              <div className="w-6 h-6 rounded bg-indigo-900 text-white flex items-center justify-center text-[8px] font-bold">sophia</div>
              <div>
                <div className="font-semibold text-xs text-gray-800 truncate">Biblioteca Virtu...</div>
                <div className="text-[10px] text-gray-400 truncate">biblioteca.sophia.com.br</div>
              </div>
            </a>
          </div>
        </section>

        {/* Seção: Comunicados */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-purple-600 text-white rounded">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-800">Comunicados</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">Confira as últimas atualizações</p>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              
              {/* Card Comunicado 1 */}
              <div className="min-w-[320px] max-w-[320px] bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex gap-3 items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-1">BORA JOGAR XADREZ? ♟️ ...</h3>
                  <span className="text-[10px] text-gray-400 block mt-6">25 de agosto de 2026</span>
                </div>
                <img 
                  src="https://placehold.co/100x100/f1f5f9/334155?text=Xadrez" 
                  alt="Oficina de Xadrez" 
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              </div>

              {/* Card Comunicado 2 */}
              <div className="min-w-[320px] max-w-[320px] bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex gap-3 items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-1">OFICINA DE MÚSICA</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">🎶 Venha participar da nossa Oficina de Música! 🎵 Uma oportunidade para...</p>
                  <span className="text-[10px] text-gray-400 block mt-2">25 de agosto de 2026</span>
                </div>
                <img 
                  src="https://placehold.co/100x100/fee2e2/991b1b?text=M%C3%BAsica" 
                  alt="Oficina de Música" 
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              </div>

              {/* Card Comunicado 3 */}
              <div className="min-w-[320px] max-w-[320px] bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-800">AULA SUSPENSA</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">🚨 Aviso importante: Informamos que, na segunda-feira, dia 24, somente no PERÍODO DA TARDE, as aulas serão SUS...</p>
                </div>
                <span className="text-[10px] text-gray-400 block mt-3">21 de agosto de 2026</span>
              </div>

              {/* Card Comunicado 4 */}
              <div className="min-w-[320px] max-w-[320px] bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between opacity-60">
                <div>
                  <h3 className="text-xs font-bold text-gray-800">CARDÁPIO</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">É com grande prazer...</p>
                </div>
                <span className="text-[10px] text-gray-400 block mt-3">21 de agosto de 2026</span>
              </div>

            </div>

            {/* Botão de Rolagem com Seta SVG */}
            <button className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full border border-gray-200 shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Seção: Atendimentos */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-pink-500 text-white rounded">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 012.121-14.85" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-800">Atendimentos</h2>
          </div>
          <p className="text-xs text-gray-400">Confira as últimas atualizações</p>
        </section>
      </main>
    </div>
  );
}