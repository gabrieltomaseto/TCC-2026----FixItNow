import LinkCard from "./LinkCard";

function LinksRapidos({ nossoSite }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900">
        Links rápidos
      </h2>

      <p className="mb-3 text-sm text-gray-500">
        Acesse os principais links rapidamente
      </p>

      <div className="flex gap-2">
        {/* Cards apenas visuais */}
        <div className="flex h-[130px] w-[150px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-12 items-center">
            <span className="text-2xl font-bold text-gray-500">
              FIEC
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Site Institucional
            </h3>

            <p className="text-xs text-gray-400">
              fiergs.org.br
            </p>
          </div>
        </div>

        <div className="flex h-[130px] w-[150px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-12 items-center">
            <span className="text-2xl">🏫</span>
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              DP (Dependências)
            </h3>

            <p className="text-xs text-gray-400">
              Portal acadêmico
            </p>
          </div>
        </div>

        <div className="flex h-[130px] w-[150px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-12 items-center">
            <span className="text-2xl">📚</span>
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Biblioteca Virtual
            </h3>

            <p className="text-xs text-gray-400">
              Biblioteca
            </p>
          </div>
        </div>

       
        <LinkCard
          titulo="Nosso Site"
          descricao="Acessar nosso site"
          nossoSite={nossoSite}
        />
      </div>
    </section>
  );
}

export default LinksRapidos;