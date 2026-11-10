import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, getApiErrorMessage, setSession } from "../lib/auth";
import { celularValido, cpfValido, formatarCelular, formatarCpf } from "../lib/validacaoCadastro";

const inputClass = "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-500/20";
const labelClass = "block text-sm font-medium text-slate-200";

function CadastroAut() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    especialidade: "",
    disponibilidade: "",
    carga_horaria: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    const formatado = name === "cpf" ? formatarCpf(value) : name === "telefone" ? formatarCelular(value) : value;
    setFormData((atual) => ({ ...atual, [name]: formatado }));
  }

  async function cadastrar(event) {
    event.preventDefault();
    setErro("");
    if (!cpfValido(formData.cpf)) { setErro("Informe um CPF válido com 11 dígitos."); return; }
    if (!celularValido(formData.telefone)) { setErro("Informe um celular válido com DDD (10 ou 11 dígitos)."); return; }
    setCarregando(true);
    try {
      const { data } = await axios.post(apiUrl("auth/autonomo/cadastro"), formData);
      setSession({ ...data, tipo: data.usuario?.tipo || "autonomo" });
      navigate("/site", { replace: true });
    } catch (error) {
      setErro(getApiErrorMessage(error, "Erro ao cadastrar. Verifique os dados."));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-white sm:py-12">
      <section className="my-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-400">FIX IT NOW</p>
        <h1 className="text-3xl font-bold">Criar conta de autônomo</h1>
        <p className="mt-2 text-slate-400">Preencha seus dados profissionais para continuar.</p>

        <form onSubmit={cadastrar} className="mt-7 space-y-4">
          <label className={labelClass} htmlFor="nome">Nome completo
            <input className={inputClass} id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} autoComplete="name" placeholder="Seu nome completo" required />
          </label>
          <label className={labelClass} htmlFor="cpf">CPF
            <input className={inputClass} id="cpf" name="cpf" type="text" inputMode="numeric" maxLength={14} value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
          </label>
          <label className={labelClass} htmlFor="telefone">Telefone
            <input className={inputClass} id="telefone" name="telefone" type="tel" inputMode="tel" maxLength={15} value={formData.telefone} onChange={handleChange} autoComplete="tel" placeholder="(00) 00000-0000" required />
          </label>
          <label className={labelClass} htmlFor="especialidade">Especialidade
            <select className={inputClass} id="especialidade" name="especialidade" value={formData.especialidade} onChange={handleChange} required>
              <option value="" className="bg-slate-950 text-white">Selecione sua especialidade</option>
              <option value="Elétrica" className="bg-slate-950 text-white">Elétrica</option>
              <option value="Hidráulica" className="bg-slate-950 text-white">Hidráulica</option>
              <option value="Ar-condicionado" className="bg-slate-950 text-white">Ar-condicionado</option>
              <option value="Manutenção predial" className="bg-slate-950 text-white">Manutenção predial</option>
              <option value="Pintura" className="bg-slate-950 text-white">Pintura</option>
              <option value="Refrigeração" className="bg-slate-950 text-white">Refrigeração</option>
              <option value="Informática / redes" className="bg-slate-950 text-white">Informática / redes</option>
              <option value="Outros" className="bg-slate-950 text-white">Outros</option>
            </select>
          </label>
          <label className={labelClass} htmlFor="carga_horaria">Carga horária <span className="font-normal text-slate-400">(opcional)</span>
            <input className={inputClass} id="carga_horaria" name="carga_horaria" type="text" value={formData.carga_horaria} onChange={handleChange} placeholder="Ex.: 8 horas por dia" />
          </label>
          <label className={labelClass} htmlFor="disponibilidade">Disponibilidade <span className="font-normal text-slate-400">(opcional)</span>
            <input className={inputClass} id="disponibilidade" name="disponibilidade" type="text" value={formData.disponibilidade} onChange={handleChange} placeholder="Ex.: segunda a sexta" />
          </label>
          <label className={labelClass} htmlFor="email">E-mail
            <input className={inputClass} id="email" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" placeholder="voce@exemplo.com" required />
          </label>
          <label className={labelClass} htmlFor="password">Senha
            <input className={inputClass} id="password" name="password" type="password" value={formData.password} onChange={handleChange} autoComplete="new-password" minLength={6} placeholder="Crie uma senha" required />
          </label>
          <label className={labelClass} htmlFor="password_confirmation">Confirmar senha
            <input className={inputClass} id="password_confirmation" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} autoComplete="new-password" minLength={6} placeholder="Digite a senha novamente" required />
          </label>
          {erro && <p role="alert" className="rounded-lg bg-red-950/60 p-3 text-sm text-red-300">{erro}</p>}
          <button disabled={carregando} className="w-full rounded-lg bg-green-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-green-400 disabled:cursor-wait disabled:opacity-60">
            {carregando ? "Cadastrando..." : "Cadastrar como autônomo"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Já tem uma conta? <Link to="/login" className="font-semibold text-green-400 hover:text-green-300">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

export default CadastroAut;
