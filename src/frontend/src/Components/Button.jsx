import { Link } from 'react-router-dom'

function Botao(p){
   return(
      <Link to={p.href} className="text-green-500 hover:text-white transition transform scale-100 duration-300 px-3 py-2 rounded-md text-sm font-medium btn-hover">{p.name}</Link>
   );
}

export default Botao;