import { Link } from "react-router-dom";


function SelectUser() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <img src="src/imagens/logo.png" alt="Logo" className="h-16 mb-4" />
        </div>

       
          <div className="mb-6">
            <label htmlFor="user" className="text-2xl font-bold text-gray-800">
              Selecione o tipo de usuário:
            </label>
          </div>

          <nav className="flex flex-col space-y-3">
           <Link to="/cadastro-autorizado" className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors text-center">   Autônomo   </Link>

       <Link to="/cadastro-empresa"className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors text-center">Empresa</Link>
          </nav>
   
      </div>
    </div>
  );
}

export default SelectUser;