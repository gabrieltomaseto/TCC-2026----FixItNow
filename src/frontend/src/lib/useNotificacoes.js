import { useEffect, useState } from "react";
import { getSession, isAutonomo } from "./auth";
import { NOTIFICACOES_EVENT, contarNaoLidas } from "./notificacoes";

const INTERVALO_MS = 15000;

export function useNotificacoes() {
  const session = getSession();
  const token = session?.token;
  const habilitado = isAutonomo(session) && Boolean(token);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!habilitado) return undefined;
    let ativo = true;

    function atualizar() {
      contarNaoLidas({ token })
        .then((quantidade) => { if (ativo) setTotal(quantidade); })
        .catch(() => undefined);
    }

    atualizar();
    const intervalo = window.setInterval(atualizar, INTERVALO_MS);
    window.addEventListener(NOTIFICACOES_EVENT, atualizar);
    window.addEventListener("focus", atualizar);
    return () => {
      ativo = false;
      window.clearInterval(intervalo);
      window.removeEventListener(NOTIFICACOES_EVENT, atualizar);
      window.removeEventListener("focus", atualizar);
    };
  }, [habilitado, token]);

  return habilitado ? total : 0;
}
