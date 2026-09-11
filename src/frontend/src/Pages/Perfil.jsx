import CardConteudo from "../Components/CardConteudo"

function Perfil(){
    return (
    
        <div className="">
            <div className="flex flex-col items-center justify-center mt-5">
                <h1 className="text-6xl">Perfil <span className="text-green-500">Empresarial</span></h1>

                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO5dL-EVliC2pRNxVr-ZVXLoc6iLUCM07DoQ4mJZQwiw&s" alt="foto de perfil" className="h-100 w-70 rounded-full p-7 object-cover object-center"/>
                <h1 className="text-2xl">Empresa 2</h1>
            </div>

            <div className="mx-auto max-w-4xl mt-5 flex flex-col justify-center p-6">
    <h1 className="text-2xl font-bold mb-2">Descrição:</h1>
    
    <form action="">
        <label htmlFor="descPerfil" className="sr-only">Descrição do perfil</label>
        <textarea 
            id="descPerfil"
            placeholder="Adicione uma descrição para seu perfil"
            className="w-full p-4 border-3 border-green-500 rounded-lg shadow-sm text-gray-900 focus:bg-gray-100 focus:border-green-700 focus:outline-none "
            rows={4}
        />

        <button
            type="submit"
            className="mt-3 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
        >
            Salvar descrição
        </button>

        <h1 className="mt-10 text-2xl">Minha avaliação: 5⭐</h1>
    </form>
    
        
    
</div>


           <div className="border-2 border-gray-300 m-25"></div>

        {/* Avaliação para empresas e autonomos */}
            <div className="border border-zinc-500  rounded-3xl py-10 ml-20 mr-20 ">
                <div className="ml-40">
                    <CardConteudo name='Autonômos recomendados' img='https://tse2.mm.bing.net/th/id/OIP.tPA7TR3nLF2O77Fck3g-egAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'/>
                    <button>Avançar</button>
                </div>
            </div>
        </div>
    )
}

export default Perfil;