function Botao(p){
   return(
      <a  href={p.href} className="text-gray-300 hover:text-white transition transform scale-100 duration-300 px-3 py-2 rounded-md text-sm font-medium btn-hover">{p.name}</a>
   );
}

export default Botao;