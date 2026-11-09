import { Link } from "react-router-dom";

function SelectUser() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl sm:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-400">FIX IT NOW</p>
        <h1 className="text-3xl font-bold">Criar uma conta</h1>
        <p className="mt-2 text-slate-400">Selecione o tipo de conta que deseja cadastrar.</p>
        <nav className="mt-8 grid gap-3">
          <Link to="/cadastro-empresa" className="rounded-lg bg-green-500 px-4 py-3 text-center font-bold text-slate-950 transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300">
            Empresa
          </Link>
          <Link to="/cadastro-autorizado" className="rounded-lg border border-slate-600 px-4 py-3 text-center font-bold text-white transition hover:border-green-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-300">
            Autônomo
          </Link>
        </nav>
        <p className="mt-6 text-center text-sm text-slate-400">
          Já tem uma conta? <Link to="/login" className="font-semibold text-green-400 hover:text-green-300">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

export default SelectUser;
