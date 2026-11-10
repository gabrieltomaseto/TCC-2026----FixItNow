const SESSION_KEY = "fixitnow_session";
const SESSION_UPDATED_EVENT = "fixitnow:session-updated";

function notifySessionUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
  }
}

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session && ["empresa", "autonomo"].includes(session.tipo) && session.token ? session : null;
  } catch {
    return null;
  }
}

export function setSession(data) {
  const session = {
    tipo: data.tipo || data.usuario?.tipo,
    usuario: data.usuario || null,
    empresa: data.empresa || null,
    autonomo: data.autonomo || null,
    token: data.token || null,
    tokenNome: data.token_nome || data.tokenNome || null,
    permissoes: data.permissoes || [],
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notifySessionUpdated();
  return session;
}

export function updateProfile(perfil, usuario = null, expectedToken = null) {
  const session = getSession();
  if (!session || (expectedToken && session.token !== expectedToken)) return null;

  const profileKey = session.tipo === "empresa" ? "empresa" : "autonomo";
  const updatedSession = {
    ...session,
    usuario: usuario || session.usuario,
    [profileKey]: {
      ...(session[profileKey] || {}),
      ...perfil,
    },
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  notifySessionUpdated();
  return updatedSession;
}

export function updateProfilePhoto(fotoUrl, expectedToken = null) {
  return updateProfile({ foto_url: fotoUrl }, null, expectedToken);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  notifySessionUpdated();
}

export function isEmpresa(session = getSession()) { return session?.tipo === "empresa"; }
export function isAutonomo(session = getSession()) { return session?.tipo === "autonomo"; }

export function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;
  const validationError = Object.values(data?.errors || {}).flat().find((message) => typeof message === "string");
  return data?.mensagem || validationError || data?.message || fallback;
}

export function authHeaders(session = getSession()) {
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

export function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL || "/api";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function profilePhotoUrl(value) {
  if (!value) return "";
  if (typeof window === "undefined") return value;

  try {
    const apiBase = import.meta.env.VITE_API_URL || window.location.origin;
    const apiOrigin = /^https?:\/\//i.test(apiBase)
      ? new URL(apiBase).origin
      : window.location.origin;
    const resolved = new URL(value, apiOrigin);

    if (resolved.pathname.startsWith("/storage/profile-photos/")) {
      return new URL(resolved.pathname, apiOrigin).toString();
    }

    return resolved.toString();
  } catch {
    return value;
  }
}
