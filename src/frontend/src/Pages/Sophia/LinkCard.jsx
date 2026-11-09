import { Link } from "react-router-dom";
function LinkCard({ titulo, descricao, nossoSite }) {
  const interno = typeof nossoSite === "string" && nossoSite.startsWith("/");
  const conteudo = <><div className="flex h-12 items-center"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-500">↗</div></div><div><h3 className="truncate text-sm font-semibold text-gray-800 group-hover:text-gray-600">{titulo}</h3><p className="truncate text-xs text-gray-400">{descricao}</p></div></>;
  const classe = "group flex h-32.5 w-37.5 flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md";
  return interno ? <Link to={nossoSite} className={classe}>{conteudo}</Link> : <a href={nossoSite} target="_blank" rel="noopener noreferrer" className={classe}>{conteudo}</a>;
}
export default LinkCard;
