import { Routes, Route } from 'react-router-dom'
import { useConfig } from './Context/useConfig'
import ConteudoMain from "./Components/ConteudoMain";
import Rodape from "./Components/Rodape";
import BarraNav from "./Components/BarraNav";

// Pages
import Painel from "./Pages/Painel";
import NovoChamado from "./Pages/NovoChamado";
import Historico from "./Pages/Historico";
import Config from "./Pages/Config";
import Perfil from "./Pages/Perfil";
import CadastroAut from "./Pages/CadastroAut";
import CadastroEmp from "./Pages/CadastroEmp";
import SelectUser from "./Pages/SelectUser";



function App() {
  const { modo, tamanho, contraste } = useConfig()
  
  const bgColor = modo === "escuro" ? "bg-gray-900" : "bg-gray-50"
  
  return (
    <>
      <div className={`flex flex-col min-h-screen ${bgColor} ${tamanho} ${contraste}`}>
        <header className={`${modo === "escuro" ? "bg-gray-800 border-gray-700" : "bg-white"} shadow-md sticky top-0 z-50`}>
          <BarraNav />
        </header>
        
        <main id="inicio" className="flex-grow">
          <Routes>
            <Route path="/" element={<ConteudoMain />} />
            <Route path="/painel" element={<Painel />} />
            <Route path="/novo-chamado" element={<NovoChamado />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/configuracoes" element={<Config />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/cadastro-autorizado" element={<CadastroAut />} />
            <Route path="/cadastro-empresa" element={<CadastroEmp />} />
            <Route path="/selecionar-usuario" element={<SelectUser />} />
            
          </Routes>
        </main>

        <footer className={`${modo === "escuro" ? "bg-gray-800 border-gray-700" : "bg-gray-800"} text-white text-center py-6 px-4 mt-auto border-t`}>
          <Rodape />
        </footer>   
      </div>
    </>
  );
}

export default App;