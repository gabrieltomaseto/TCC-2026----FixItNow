import { Link } from 'react-router-dom'
import logo from '../../Imagens/Logo.png'

function Sophia() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-slate-900">
      <section className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl sm:p-14">
        <img
          src={logo}
          alt="Logo do FixItNow"
          className="mx-auto mb-8 h-24 w-auto object-contain"
        />
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
          Sophia
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Bem-vindo ao FixItNow
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-600">
          Entre no sistema para gerenciar seus serviços de manutenção.
        </p>
        <Link
          to="/site"
          className="mt-9 inline-flex min-h-12 items-center justify-center rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
        >
          Abrir o site
        </Link>
      </section>
    </main>
  )
}

export default Sophia
