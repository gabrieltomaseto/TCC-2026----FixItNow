import Botao from "./Button";

function BarraNav() {
  
 return (
    <nav className="bg-gray-800 p-4 w-full ">
      <div className="container mx-auto flex items-center justify-between ">
        <img src="src/imagens/LogoSemNome.png" alt="Logo" className="max-h-20 max-w-60 hidden md:flex " />       
        <h1 className="text-white font-bold text-xl">FIX IT <div className="text-green-500 mr-10">NOW</div></h1>

        <div className="border border-green-500 py-4">
          
          <Botao href='#inicio' name='Inicio'/>
          <Botao href='#' name='Sobre'/>
          <Botao href='#contato' name='Contato'/>
          <Botao href='#' name='Serviços'/>
          <Botao href='#' name='Configurações'/>

        </div>
        <div className="flex items-center">
             <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4" href="#">Cadastrar</button>
            <button className="border border-green-500 hover:bg-green-700 hover:text-white transition transform scale-100 text-white font-bold py-2 px-4 rounded ml-4"  href="#">Entrar</button>
        </div>
      </div>
    </nav>

 )
}
export default BarraNav;