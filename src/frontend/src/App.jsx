
import BarraNav from "./Components/BarraNav"  
import ConteudoMain from "./Components/ConteudoMain"
import Rodape from "./Components/Rodape"


function App() {
  return (
     <>


   
     <header>
         <BarraNav />
     </header>
     <main id="inicio" className="">  
          <ConteudoMain/>
     </main>
     <footer className="bg-gray-600 text-white text-center p-4">
        <Rodape/>
     </footer>

     </>
  )
}

export default App
