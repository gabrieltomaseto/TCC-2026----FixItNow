import {useState } from "react";
import axios from "axios";


function CadastroEmp() {
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cnpj: '',
    telefone: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

 function handleChange(e) {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
}

  async function cadastrarEmpresa(e) {
    e.preventDefault(); 

    try {
      const response = await axios.post(
       "http://127.0.0.1:8000/api/auth/autonomo/cadastro",
        formData
      );
      console.log(response.data);
      alert('Empresa cadastrada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar empresa. Verifique os dados.');
    } }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center mb-6">
          <img src="src/imagens/logo.png" alt="Logo" className="mb-4 h-16" />
          <h1 className="text-3xl font-bold text-gray-800">Cadastro de Empresa</h1>
        </div>

        <form className="space-y-4" onSubmit={cadastrarEmpresa}>
          <div>
            <label htmlFor="nome" className="block text-lg font-medium text-gray-700 mb-1">
              Nome da Empresa:
            </label>
            <input 
            value={formData.nome}
            onChange={handleChange}
              type="text" 
              id="nome" 
              name="nome"
              placeholder="Coloque seu nome aqui" 
              required 
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endereco" className="block text-lg font-medium text-gray-700 mb-1" >
              Endereço:
            </label>
             <input 
              value={formData.endereco}
            onChange={handleChange}
              type="text" 
              id="endereco" 
              name="endereco"
              placeholder="Coloque seu endereço aqui" 
              required 
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

           <div>
            <label htmlFor="cnpj" className="block text-lg font-medium text-gray-700 mb-1">
              CNPJ:
            </label>
            <input 
             value={formData.cnpj}
            onChange={handleChange}
              type="text" 
              id="cnpj" 
              name="cnpj" 
              placeholder="Coloque seu CNPJ aqui" 
              required 
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input 
             value={formData.email}
            onChange={handleChange}
              type="email" 
              id="email" 
              name="email" 
              placeholder="Coloque seu email aqui" 
              required 
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

           <div>
        <label htmlFor="telefone" className="block text-lg font-medium text-gray-700 mb-1">
        Telefone:
         </label>
           <input
          value={formData.telefone}
           onChange={handleChange}
           type="text"
          id="telefone"
          name="telefone"
           placeholder="Coloque seu telefone aqui"
         required
        className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
        </div>
        

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-1">
              Senha:
            </label>
            <input 
             value={formData.password}
            onChange={handleChange}
              type="password" 
              id="password" 
              name="password" 
              placeholder="Coloque sua senha aqui" 
              required 
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  <div>
  <label htmlFor="password_confirmation" className="block text-lg font-medium text-gray-700 mb-1">
    Confirmar Senha:
  </label>

  <input
  value={formData.password_confirmation}
    onChange={handleChange}
    type="password"
    id="password_confirmation"
    name="password_confirmation"
    placeholder="Confirme sua senha"
    required
    className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

         

          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 text-lg transition-colors"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Já tem uma conta? <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold">Entre por aqui.</a>
        </p>
      </div>
    </div>
  );
}

export default CadastroEmp;