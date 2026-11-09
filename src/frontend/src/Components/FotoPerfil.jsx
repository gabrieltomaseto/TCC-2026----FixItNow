import { useState } from "react";
import { profilePhotoSources } from "../lib/auth";

function FotoPerfil({ src, alt, fallback = null, className = "h-full w-full object-cover" }) {
  const fontes = profilePhotoSources(src);
  const chave = fontes.join("|");
  const [tentativa, setTentativa] = useState({ chave, indice: 0 });
  const indice = tentativa.chave === chave ? tentativa.indice : 0;
  const atual = fontes[indice];

  if (!atual) return fallback;

  return <img key={atual} src={atual} alt={alt} className={className} onError={() => setTentativa({ chave, indice: indice + 1 })} />;
}

export default FotoPerfil;
