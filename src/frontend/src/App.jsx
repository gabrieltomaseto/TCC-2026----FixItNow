
import { Navigate, Route, Routes } from 'react-router-dom'
import { useConfig } from './Context/useConfig'
import ConteudoMain from './Components/ConteudoMain'
import Rodape from './Components/Rodape'
import BarraNav from './Components/BarraNav'
import Painel from './Pages/Painel'
import NovoChamado from './Pages/NovoChamado'
import Historico from './Pages/Historico'
import Config from './Pages/Config'
import Perfil from './Pages/Perfil'
import CadastroAut from './Pages/CadastroAut'
import CadastroEmp from './Pages/CadastroEmp'
import SelectUser from './Pages/SelectUser'
import Sophia from './Pages/Sophia/Sophia'

function SiteLayout({ children }) {
  const { modo, tamanho, contraste } = useConfig()
  const bgColor = modo === 'escuro' ? 'bg-gray-900' : 'bg-gray-50'
  const headerColor = modo === 'escuro' ? 'bg-gray-800 border-gray-700' : 'bg-white'

  return (
    <div className={`flex min-h-screen flex-col ${bgColor} ${tamanho} ${contraste}`}>
      <header className={`${headerColor} sticky top-0 z-50 shadow-md`}>
        <BarraNav />
      </header>
      <main id="inicio" className="grow">{children}</main>
      <footer className="mt-auto border-t bg-gray-800 px-4 py-6 text-center text-white">
        <Rodape />
      </footer>
    </div>
  )
}

function SiteRoutes() {
  return (
    <SiteLayout>
      <Routes>
        <Route index element={<ConteudoMain />} />
        <Route path="painel" element={<Painel />} />
        <Route path="novo-chamado" element={<NovoChamado />} />
        <Route path="historico" element={<Historico />} />
        <Route path="configuracoes" element={<Config />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="cadastro-autorizado" element={<CadastroAut />} />
        <Route path="cadastro-empresa" element={<CadastroEmp />} />
        <Route path="selecionar-usuario" element={<SelectUser />} />
        <Route path="*" element={<Navigate to="/site" replace />} />
      </Routes>
    </SiteLayout>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Sophia />} />
      <Route path="/site/*" element={<SiteRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
