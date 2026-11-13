
import contatos from "../Imagens/Contatos.png";
import relogio from "../Imagens/Relogio.png";
import tabela from "../Imagens/Tabela.png";

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

             
                          
        </div>

      <div className="flex flex-col p-4 items-start">
        <h2 className="text-lg font-bold">Serviços <span className="text-green-500">disponiveis:</span></h2>
        <p className="text-lg">
          Hoje possuimos os serviços de manutenção de assistencia e manutenção de fiação elétrica, hidráulica, pintura, calibragem de máquinas industriais e muito mais!
        </p>


   
        
      </div>
    </div>
    

  );
}
export default ConteudoMain;
