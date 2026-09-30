import { btnPainel } from "../Mock's/mockData"
import { Link, useLocation } from 'react-router-dom'

function AsidePainel() {
  const location = useLocation()
  
  const isActive = (href) => {
    return location.pathname === href
  }

  return (
    <aside className="w-full bg-slate-950 text-white lg:w-64 lg:min-h-screen">
      
      <div className="p-4 lg:p-6">
        <h1 className="text-xl font-bold text-green-500 lg:text-2xl">
          ● FIX IT NOW
        </h1>

        <p className="text-xs text-gray-400 mt-1 lg:text-sm">
          Portal de Gestão
        </p>
      </div>

      <nav className="px-3 space-y-1 pb-4 lg:px-4 lg:space-y-2 lg:pb-0">

        {btnPainel.map(item => (
          <Link 
            key={item.id}
            to={item.href}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm lg:py-3 transition ${
              isActive(item.href)
                ? "bg-green-500 text-slate-950 font-semibold" 
                : "text-gray-300 hover:bg-slate-800"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.nome}</span>
          </Link>
        ))}

      </nav>

      <div className="mt-auto border-t border-slate-800 p-4 lg:p-4">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-800 rounded-lg text-sm lg:py-3">
          <span>Sair</span>
        </button>
      </div>

    </aside>
  )
}

export default AsidePainel
