import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useConfig } from "./Context/useConfig";
import { getSession } from "./lib/auth";
import ConteudoMain from "./Components/ConteudoMain";
import Rodape from "./Components/Rodape";
import BarraNav from "./Components/BarraNav";
import Painel from "./Pages/Painel";
import NovoChamado from "./Pages/NovoChamado";
import Historico from "./Pages/Historico";
import Config from "./Pages/Config";
import Perfil from "./Pages/Perfil";
import CadastroAut from "./Pages/CadastroAut";
import CadastroEmp from "./Pages/CadastroEmp";
import SelectUser from "./Pages/SelectUser";
import Login from "./Pages/Login";
import Pedidos from "./Pages/Pedidos";
import SwipeFuncionarios from "./Pages/SwipeFuncionarios";
import Entrada from "./Pages/Entrada";
import Sophia from "./Pages/Sophia/Sophia";

const publicPaths = ["/", "/acessar", "/login", "/selecionar-usuario", "/cadastro-autorizado", "/cadastro-empresa"];

function App() {
  const { modo, tamanho, contraste } = useConfig();
  const { pathname } = useLocation();
  const session = getSession();
  const bgColor = modo === "escuro" ? "bg-gray-900" : "bg-gray-50";

  if (pathname === "/" || pathname === "/sophia") return <Sophia />;
  if (!session && !publicPaths.includes(pathname)) return <Navigate to="/" replace />;
  if (pathname === "/acessar") return <Entrada />;
  if (pathname === "/login") return <Login />;
  if (pathname === "/selecionar-usuario") return <SelectUser />;
  if (pathname === "/cadastro-autorizado") return <CadastroAut />;
  if (pathname === "/cadastro-empresa") return <CadastroEmp />;

  return (
    <div className={`flex min-h-screen flex-col ${bgColor} ${tamanho} ${contraste}`}>
      <header className={`${modo === "escuro" ? "border-gray-700 bg-gray-800" : "bg-white"} sticky top-0 z-50 shadow-md`}>
        <BarraNav />
      </header>
      <main id="inicio" className="grow">
        <Routes>
          <Route path="/site" element={<ConteudoMain />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/novo-chamado" element={<NovoChamado />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/swipe-funcionarios" element={<SwipeFuncionarios />} />
          <Route path="/configuracoes" element={<Config />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<Navigate to="/site" replace />} />
        </Routes>
      </main>
      <footer className={`${modo === "escuro" ? "bg-gray-800 border-gray-700" : "bg-gray-800"} mt-auto border-t px-4 py-6 text-center text-white`}>
        <Rodape />
      </footer>
    </div>
  );
}

export default App;
