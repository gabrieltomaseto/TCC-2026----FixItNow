import ConteudoMain from "./Components/ConteudoMain";
import Rodape from "./Components/Rodape";
import CadastroEmp from "./Pages/CadastroEmp";
import CadastroAut from "./Pages/CadastroAut";
import SelectUser from "./Pages/SelectUser"; 

import BarraNav from "./Components/BarraNav";

import Historico from "./Pages/Historico";
import Config from "./Pages/Config";
import Perfil from "./Pages/Perfil";

function App() {

  return (
  <>
 
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-md sticky top-0 z-50">
        <BarraNav />
      </header>
      
      <main id="inicio">
        <ConteudoMain />
      </main>

      <footer className="bg-gray-800 text-white text-center py-6 px-4 mt-auto border-t border-gray-700">
        <Rodape />
      </footer>
        
        <CadastroEmp/>
        <CadastroAut/>
        <SelectUser/>

        <Config/>
        <Historico />
        <Perfil/>
       
    </div>
  


    
  </>
  );
}

export default App;