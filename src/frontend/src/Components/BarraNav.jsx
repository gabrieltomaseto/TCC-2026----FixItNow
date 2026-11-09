import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useConfig } from "../Context/useConfig";
import { getSession, isEmpresa } from "../lib/auth";
import { useNotificacoes } from "../lib/useNotificacoes";
import Badge from "./Badge";
import FotoPerfil from "./FotoPerfil";

function BarraNav() {
  const { modo } = useConfig();
  const [session, setSession] = useState(getSession);
  const naoLidas = useNotificacoes();

  useEffect(() => {
    const atualizarSessao = () => setSession(getSession());
    window.addEventListener("fixitnow:session-updated", atualizarSessao);
    return () => window.removeEventListener("fixitnow:session-updated", atualizarSessao);
  }, []);

  const empresa = isEmpresa(session);
  const perfil = empresa ? session?.empresa : session?.autonomo;
  const nome = perfil?.nome || session?.usuario?.name || (empresa ? "Empresa" : "Autônomo");
  const foto = perfil?.foto_url || perfil?.avatar_url || perfil?.foto;
  const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();
  const textColor = modo === "escuro" ? "text-white" : "text-black";
  const outroTipo = empresa ? "autonomo" : "empresa";
  const outroNome = empresa ? "autônomo" : "empresa";

  return (
    <nav className={`${modo === "escuro" ? "bg-gray-800" : "border-b border-gray-200 bg-white"} w-full p-4`}>
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
        <Link to={session ? "/inicio" : "/"} className={`${textColor} text-xl font-bold`}>
          FIX IT <span className="text-green-500">NOW</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <Link className="rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" to="/inicio">Início</Link>
          {session && <>
            <Link className="rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" to="/painel">Painel</Link>
            <Link className="rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" to="/perfil">Perfil</Link>
            {!empresa && (
              <Link className="inline-flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" to="/pedidos">
                Pedidos
                <Badge total={naoLidas} rotulo="novos pedidos" />
              </Link>
            )}
            <Link
              to={`/login?tipo=${outroTipo}`}
              className="rounded-lg border border-green-600 px-3 py-2 font-bold text-green-700 transition hover:bg-green-600 hover:text-white"
              aria-label={`Trocar de conta e entrar como ${outroNome}`}
            >
              Trocar para {outroNome}
            </Link>
          </>}
        </div>
        {session ? (
          <Link to="/perfil" className="flex items-center gap-3 rounded-full border border-green-500/40 px-3 py-1.5 transition hover:bg-green-50 dark:hover:bg-gray-700">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-500 font-bold text-slate-950">
              <FotoPerfil src={foto} alt={`Foto de ${nome}`} fallback={iniciais} />
            </span>
            <span className={`${textColor} max-w-40 truncate text-sm font-bold`} title={nome}>{nome}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/selecionar-usuario" className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600">Cadastrar</Link>
            <Link to="/login" className="rounded border border-green-500 px-4 py-2 font-bold text-green-500 transition hover:bg-green-500 hover:text-white">Entrar</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default BarraNav;
