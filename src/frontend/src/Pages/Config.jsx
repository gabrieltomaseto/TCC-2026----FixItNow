import { useState } from "react"
import { useConfig } from "../Context/useConfig"
import AsidePainel from "../Components/AsidePainel"

function Config() {
    const { 
        modo, setModo, 
        tamanhoTexto, setTamanhoTexto, 
        altoContraste, setAltoContraste, 
        notificacoes, setNotificacoes,
        idioma, setIdioma,
        tema, 
        tamanho, 
        contraste 
    } = useConfig()
    const [salvo, setSalvo] = useState(false)

    const handleSalvar = () => {
        setSalvo(true)
        setTimeout(() => setSalvo(false), 3000)
    }

    const handleRestaurar = () => {
        setModo('claro')
        setTamanhoTexto('normal')
        setAltoContraste(false)
        setNotificacoes(true)
        setIdioma('pt-BR')
        setSalvo(true)
        setTimeout(() => setSalvo(false), 3000)
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">

        <AsidePainel />
    
       <div className={`${tema} ${tamanho} ${contraste} min-h-screen  transition-colors`}>
            <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold">Configurações <span className="text-green-500">FIX IT</span> Now</h1>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">Personalize a sua experiência.</p>

                {salvo && (
                    <div className="mt-4 rounded-lg bg-green-100 border border-green-400 text-green-700 p-3 sm:p-4 text-sm sm:text-base">
                        ✓ Configurações salvas com sucesso!
                    </div>
                )}

                <form className="mt-6 rounded-lg border-2 border-gray-300 p-4 sm:p-6 space-y-6" onSubmit={(event) => event.preventDefault()}>
                    
                    <fieldset>
                        <legend className="text-lg sm:text-xl font-bold mb-4">Aparência</legend>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <label htmlFor="modo" className="text-sm sm:text-base">Modo do site</label>
                            <select 
                              className="rounded border border-gray-400 p-2 text-green-500 font-bold text-sm w-full sm:w-auto" 
                              name="modo" 
                              id="modo" 
                              value={modo} 
                              onChange={(event) => setModo(event.target.value)}
                            >
                                <option value="claro">Modo claro</option>
                                <option value="escuro">Modo escuro</option>
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <label htmlFor="idioma" className="text-sm sm:text-base">Idioma</label>
                            <select 
                              className="rounded border border-gray-400 p-2 text-green-500 font-bold text-sm w-full sm:w-auto" 
                              name="idioma" 
                              id="idioma" 
                              value={idioma} 
                              onChange={(event) => setIdioma(event.target.value)}
                            >
                                <option value="pt-BR">Português (Brasil)</option>
                                <option value="en-US">English (USA)</option>
                                <option value="es-ES">Español</option>
                            </select>
                        </div>
                    </fieldset>

                    <hr className="border-gray-300" />

                    <fieldset>
                        <legend className="text-lg sm:text-xl font-bold mb-4">Acessibilidade</legend>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <label htmlFor="tamanho-texto" className="text-sm sm:text-base">Tamanho do texto</label>
                            <select 
                              className="rounded border border-gray-400 p-2 text-green-500 font-bold text-sm w-full sm:w-auto" 
                              name="tamanhoTexto" 
                              id="tamanho-texto" 
                              value={tamanhoTexto} 
                              onChange={(event) => setTamanhoTexto(event.target.value)}
                            >
                                <option value="normal">Normal</option>
                                <option value="medio">Médio</option>
                                <option value="grande">Grande</option>
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <label htmlFor="alto-contraste" className="text-sm sm:text-base">Alto contraste</label>
                            <input 
                              className="h-5 w-5 accent-green-500 cursor-pointer" 
                              type="checkbox" 
                              id="alto-contraste" 
                              checked={altoContraste} 
                              onChange={(event) => setAltoContraste(event.target.checked)} 
                            />
                        </div>
                    </fieldset>

                    <hr className="border-gray-300" />

                    <fieldset>
                        <legend className="text-lg sm:text-xl font-bold mb-4">Notificações</legend>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <label htmlFor="notificacoes" className="text-sm sm:text-base">Notificações gerais</label>
                            <input 
                              className="h-5 w-5 accent-green-500 cursor-pointer" 
                              type="checkbox" 
                              id="notificacoes" 
                              checked={notificacoes} 
                              onChange={(event) => setNotificacoes(event.target.checked)} 
                            />
                        </div>
                    </fieldset>

                    <hr className="border-gray-300" />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button 
                            type="submit" 
                            onClick={handleSalvar}
                            className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors text-sm sm:text-base"
                        >
                            Salvar configurações
                        </button>
                        <button 
                            type="reset" 
                            onClick={handleRestaurar}
                            className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded transition-colors text-sm sm:text-base"
                        >
                            Restaurar padrões
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
    );
}

export default Config;
