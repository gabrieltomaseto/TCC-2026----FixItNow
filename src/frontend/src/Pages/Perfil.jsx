import CardConteudo from "../Components/CardConteudo";
import { useState } from "react";

function Perfil() {
  const [nota, setNota] = useState(0);

  function avaliar(e) {
    e.preventDefault();
    alert(`Você avaliou com ${nota} estrelas!`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center py-8 sm:py-10 lg:py-16 px-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl text-center">
          Perfil <span className="text-green-500">Empresarial</span>
        </h1>

        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO5dL-EVliC2pRNxVr-ZVXLoc6iLUCM07DoQ4mJZQwiw&s"
          alt="foto de perfil"
          className="h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full p-6 sm:p-7 object-cover object-center mt-6"
        />
        <h2 className="text-xl sm:text-2xl mt-6 font-semibold">Empresa 2</h2>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">Descrição:</h3>

        <form className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="descPerfil" className="sr-only">
            Descrição do perfil
          </label>
          <textarea
            id="descPerfil"
            placeholder="Adicione uma descrição para seu perfil"
            className="w-full p-4 border-2 border-green-500 rounded-lg shadow-sm text-gray-900 focus:bg-green-50 focus:border-green-700 focus:outline-none text-sm sm:text-base"
            rows={4}
          />

          <button
            type="submit"
            className="mt-3 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
          >
            Salvar descrição
          </button>

          <h3 className="mt-8 sm:mt-10 text-xl sm:text-2xl font-semibold">Minha avaliação: 5⭐</h3>
        </form>
      </div>

      <div className="border-2 border-gray-300 my-8 sm:my-10 mx-4 sm:mx-6 lg:mx-8"></div>

      <div className="border-2 border-gray-300 rounded-3xl py-8 sm:py-10 px-4 sm:px-6 lg:px-20 mx-4 sm:mx-6 lg:mx-20">
        <div className="mx-auto max-w-2xl">
          <CardConteudo
            name="Autonômos recomendados"
            img="https://tse2.mm.bing.net/th/id/OIP.tPA7TR3nLF2O77Fck3g-egAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
          />
          <button className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base">
            Avançar
          </button>

          <div className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Avaliar empresa</h2>

            <form onSubmit={avaliar}>
              <p className="mb-4 text-sm sm:text-base">Selecione as estrelas:</p>

              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <button
                    key={estrela}
                    type="button"
                    onClick={() => setNota(estrela)}
                    className={`text-3xl sm:text-4xl lg:text-5xl transition-transform hover:scale-110 ${
                      estrela <= nota ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={nota === 0}
                className="rounded-lg bg-green-500 px-5 py-2 text-white font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
              >
                Enviar avaliação
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
}

export default Perfil;
