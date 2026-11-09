import axios from "axios";
import { apiUrl, authHeaders, getSession } from "./auth";

export const NOTIFICACOES_EVENT = "fixitnow:notificacoes-updated";

export function avisarNotificacoes() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(NOTIFICACOES_EVENT));
}

export async function contarNaoLidas(session = getSession()) {
  const { data } = await axios.get(apiUrl("notificacoes/contagem"), { headers: authHeaders(session) });
  return Number(data?.nao_lidas) || 0;
}

export async function listarNaoLidas(session = getSession()) {
  const { data } = await axios.get(apiUrl("notificacoes"), {
    headers: authHeaders(session),
    params: { apenas_nao_lidas: 1 },
  });
  return Array.isArray(data) ? data : [];
}

export async function marcarTodasLidas(session = getSession()) {
  await axios.post(apiUrl("notificacoes/ler-todas"), {}, { headers: authHeaders(session) });
  avisarNotificacoes();
}
