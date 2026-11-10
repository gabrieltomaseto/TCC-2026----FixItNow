import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiUrl, getApiErrorMessage, setSession } from "../lib/auth";

const tiposDeConta = [
  { id: "empresa", nome: "Empresa" },
  { id: "autonomo", nome: "Autônomo" },
];

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipoSolicitado = searchParams.get("tipo");
  const tipoValido = tiposDeConta.some((tipo) => tipo.id === tipoSolicitado);
  const nomeTipo = tiposDeConta.find((tipo) => tipo.id === tipoSolicitado)?.nome;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event) {
    setFormData((atual) => ({ ...atual, [event.target.name]: event.target.value }));
  }

  async function entrar(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const { data } = await axios.post(apiUrl("auth/login"), {
        ...formData,
        ...(tipoValido ? { tipo: tipoSolicitado } : {}),
      });
      const tipoAutenticado = data.tipo || data.usuario?.tipo;

      if (tipoValido && tipoAutenticado !== tipoSolicitado) {
        setErro(`Esta conta não corresponde ao perfil ${nomeTipo}. Confira o tipo de conta ou use outras credenciais.`);
        return;
      }

      setSession(data);
      navigate("/site");
    } catch (error) {
      setErro(getApiErrorMessage(error, "Não foi possível entrar. Confira seus dados."));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-400">FIX IT NOW</p>
        <h1 className="text-3xl font-bold">{nomeTipo ? `Entre como ${nomeTipo}` : "Entre para continuar"}</h1>
        <p className="mt-2 text-slate-400">Acesse os recursos da sua conta de empresa ou de autônomo no FixItNow.</p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1" aria-label="Escolha o tipo de conta">
          {tiposDeConta.map((tipo) => {
            const selecionado = tipo.id === tipoSolicitado;
            return (
              <Link
                key={tipo.id}
                to={`/login?tipo=${tipo.id}`}
                aria-current={selecionado ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${selecionado ? "bg-green-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}
              >
                {tipo.nome}
              </Link>
            );
          })}
        </div>

        <form onSubmit={entrar} className="mt-6 space-y-5">
          <label className="block text-sm font-medium">
            E-mail
            <input className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-green-400" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label className="block text-sm font-medium">
            Senha
            <input className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-green-400" type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          {erro && <p role="alert" className="rounded-lg bg-red-950/60 p-3 text-sm text-red-300">{erro}</p>}
          <button disabled={carregando} className="w-full rounded-lg bg-green-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-green-400 disabled:cursor-wait disabled:opacity-60">
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Ainda não tem conta? <Link className="font-semibold text-green-400 hover:text-green-300" to="/selecionar-usuario">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
