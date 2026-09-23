function Rodape() {
  return (
     

    <div id="contato" className="text-white text-center p-4 hidden md:flex grid-cols-2 gap-4 justify-between ">

    <div>
        <h2 className="text-white font-bold">FIX IT NOW</h2>
            <ul className="flex flex-row gap-0">
                <li><a href="#" className="text-gray-300 hover:text-white transition transform scale-100 duration-300 px-3 py-2 rounded-md text-sm font-medium btn-hover">Início</a></li>
            </ul>
    </div>      
    <div className="h-50% px-0.5 bg-gray-500"></div>

      <ul className="flex flex-col">
        
        <li >Contatos:</li>
        <li>Email: fixITnow@gmail.com</li>
        <li>Telefone: (19) 1234-5678</li>
      </ul>

    </div>
  );
}

export default Rodape;