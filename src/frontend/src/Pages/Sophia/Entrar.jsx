function Entrar() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center mb-6">
          <img src="src/imagens/logo.png" alt="Logo" className="mb-4 h-16" />
          <h1 className="text-3xl font-bold text-gray-800">Entrar</h1>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Coloque seu email aqui" 
              required 
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-1">
              Senha:
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Coloque sua senha aqui" 
              required 
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

         

          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 text-lg transition-colors"
          >
          Entrar
          </button>
        </form>

      </div>
    </div>
  );
}

export default Entrar;