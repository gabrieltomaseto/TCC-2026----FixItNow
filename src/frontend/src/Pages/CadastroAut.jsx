import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CadastroAut() {

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  async function cadastrar(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
  "http://127.0.0.1:8000/api/auth/autonomo/cadastro",
  {
    nome: nome,
    cpf: cpf,
    telefone: telefone,
    email: email,
    especialidade: especialidade,
    disponibilidade: disponibilidade,
    password: password,
    password_confirmation: passwordConfirmation
  }
)

      console.log(response.data);
      alert("Autônomo cadastrado com sucesso!");

    }   catch (error) {
  console.log("ERRO COMPLETO:", error);
  console.log("MENSAGEM:", error.message);
  console.log("RESPOSTA:", error.response);
  alert("Erro: " + error.message);
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-8">

        <div className="flex flex-col items-center justify-center mb-6">
          <img src="src/imagens/logo.png" alt="Logo" className="mb-4 h-16" />
          <h1 className="text-3xl font-bold text-gray-800">
            Cadastro de Autonômo
          </h1>
        </div>

        <form className="space-y-4" onSubmit={cadastrar}>

          <div>
            <label htmlFor="nome" className="block text-lg font-medium text-gray-700 mb-1">
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Coloque seu nome aqui"
              required
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="cpf" className="block text-lg font-medium text-gray-700 mb-1">
              CPF:
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Coloque seu CPF aqui"
              required
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="block text-lg font-medium text-gray-700 mb-1">
              Telefone:
            </label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Coloque seu telefone aqui"
              required
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="especialidade" className="block text-lg font-medium text-gray-700 mb-1">
              Especialidade:
            </label>
            <input
              type="text"
              id="especialidade"
              name="especialidade"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              placeholder="Coloque sua especialidade aqui"
              required
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="disponibilidade" className="block text-lg font-medium text-gray-700 mb-1">
              Disponibilidade:
            </label>
            <input
              type="text"
              id="disponibilidade"
              name="disponibilidade"
              value={disponibilidade}
              onChange={(e) => setDisponibilidade(e.target.value)}
              placeholder="Ex: Segunda a sexta"
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Coloque sua senha aqui"
              required
              className="w-full border border-gray-400 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirmation" className="block text-lg font-medium text-gray-700 mb-1">
              Confirmar senha:
            </label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
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
          Já tem uma conta?{" "}
          <Link
            to="/painel"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Entre por aqui.
          </Link>
        </p>

      </div>
    </div>
  );
}

export default CadastroAut;