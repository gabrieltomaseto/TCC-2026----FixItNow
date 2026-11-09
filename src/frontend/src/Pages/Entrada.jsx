import { Link } from "react-router-dom";

function Entrada() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl sm:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-400">FIX IT NOW</p>
        <h1 className="text-3xl font-bold tracking-tight">Como deseja continuar?</h1>
        <p className="mt-3 text-slate-400">Entre na sua conta ou cadastre-se para começar a usar o FixItNow.</p>
        <div className="mt-8 grid gap-3">
          <Link to="/login" className="w-full rounded-lg bg-green-500 px-4 py-3 text-center font-bold text-slate-950 transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-slate-900">
            Entrar
          </Link>
          <Link to="/selecionar-usuario" className="w-full rounded-lg border border-slate-600 px-4 py-3 text-center font-bold text-white transition hover:border-green-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-300">
            Cadastrar
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Entrada;
