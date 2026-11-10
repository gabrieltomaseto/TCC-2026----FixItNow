import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { apiUrl, authHeaders, getSession, isAutonomo, isEmpresa, clearSession } from "../lib/auth";
function AsidePainel() {
  const location = useLocation(); const session = getSession(); const autonomo = isAutonomo(session); const empresa = isEmpresa(session);
  const links = [{ id: 1, nome: "Painel", href: "/painel", icon: "▦" }, ...(autonomo ? [] : [{ id: 2, nome: "Abrir Chamado", href: "/novo-chamado", icon: "▤" }]), { id: 3, nome: autonomo ? "Pedidos recebidos" : "Histórico", href: autonomo ? "/pedidos" : "/historico", icon: "◷" }, ...(empresa ? [{ id: 4, nome: "Avaliações", href: "/perfil", icon: "☆" }] : []), { id: 5, nome: "Perfil", href: "/perfil", icon: "◉" }, { id: 6, nome: "Configurações", href: "/configuracoes", icon: "⚙" }];
  async function sair() {
    try {
      await axios.post(apiUrl("auth/logout"), {}, { headers: authHeaders(session), timeout: 10000 });
    } catch {
      // Mesmo sem rede, encerra a sessão neste navegador. O token só é revogado se a API responder.
    } finally {
      clearSession();
      window.location.href = "/";
    }
  }
  return <aside className="w-full bg-slate-950 text-white lg:min-h-screen lg:w-64"><div className="p-4 lg:p-6"><h1 className="text-xl font-bold text-green-500 lg:text-2xl">● FIX IT NOW</h1><p className="mt-1 text-xs text-gray-400 lg:text-sm">Portal de {autonomo ? "Autônomos" : "Gestão"}</p></div><nav className="space-y-1 px-3 pb-4 lg:space-y-2 lg:px-4">{links.map((item) => <Link key={item.id} to={item.href} className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm transition lg:py-3 ${location.pathname === item.href ? "bg-green-500 font-semibold text-slate-950" : "text-gray-300 hover:bg-slate-800"}`}><span>{item.icon}</span><span>{item.nome}</span></Link>)}</nav><div className="border-t border-slate-800 p-4"><button onClick={sair} className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-slate-800">Sair</button></div></aside>;
}
export default AsidePainel;
