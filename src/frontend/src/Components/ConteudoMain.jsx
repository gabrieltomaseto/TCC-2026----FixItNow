import CardConteudo from "./CardConteudo";

function ConteudoMain() {
  return (
 
    <div className="grid grid-cols-2 bg-gray-800 space-between p-4 text-amber-50">

        <div className="flex flex-col items-start justify-start p-4 ">

            <h1 className="text-3xl font-bold">Bem-vindo!</h1>

            <br />

            <p className="text-lg">A solução inteligente para sua<span className="text-lg text-green-500"> manutenção.</span>
            </p> 
            <p className="text-lg">
            Manutenção rápida e confiável, quando e 
            onde você precisar. Encontre profissionais qualificados para  resolver os problemas da sua empresa com rapidez e segurança.    
            </p>    
             <p className="text-lg">Somos referência em agilidade de trabalho e de custo e beneficio.</p>      

             
      <CardConteudo name='Autonômos recomendados' img='https://tse2.mm.bing.net/th/id/OIP.tPA7TR3nLF2O77Fck3g-egAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'/>                            
        </div>

      <div className="flex flex-col p-4 items-start">
        <h2 className="text-lg font-bold">Serviços <span className="text-green-500">disponiveis:</span></h2>
        <p className="text-lg">
          Hoje possuimos os serviços de manutenção de assistencia e manutenção de fiação elétrica, hidráulica, pintura, calibragem de máquinas industriais e muito mais!
        </p>
       
      <CardConteudo 
      custom='flex flex-row-reverse py-7'
       name='- Profissionais qualificados' img='src\Imagens\Contatos.png' 
       />

       <CardConteudo 
      custom='flex flex-row-reverse py-7'
       name='- Rápido e eficiente' 
       img='src\Imagens\Relogio.png' 
       />

       <CardConteudo 
      custom='flex flex-row-reverse py-7 '
       name='- Profissionais qualificados' img='src\Imagens\Tabela.png' 
       />

   
        
      </div>
    </div>
    

  );
}
export default ConteudoMain;