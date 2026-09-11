
import { useState } from "react"


function Config() {
    const [modo, setModo] = useState("claro")
    const [tamanhoTexto, setTamanhoTexto] = useState("normal")
    const [altoContraste, setAltoContraste] = useState(false)
    const [notificacoes, setNotificacoes] = useState(true)
    const [idioma, setIdioma] = useState("pt-BR")
    const [salvo, setSalvo] = useState(false)

    const tema = modo === "escuro"
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-900"
    const tamanho = {
        normal: "text-base",
        medio: "text-lg",
        grande: "text-xl",
    }[tamanhoTexto]
    const contraste = altoContraste ? "contrast-125" : ""

    const handleSalvar = () => {
        setSalvo(true)
        setTimeout(() => setSalvo(false), 3000)
    }

    return (
       
         

        <main className={`${tema} ${tamanho} ${contraste} min-h-screen p-6 transition-colors`}>
            <div className="mx-auto max-w-2xl">
                <h1 className="text-4xl font-bold">Configurações <span className="text-green-500">FIX IT</span> Now</h1>
                <p className="mt-2 text-gray-600">Personalize a sua experiência.</p>

                {salvo && (
                    <div className="mt-4 rounded-lg bg-green-100 border border-green-400 text-green-700 p-4">
                        ✓ Configurações salvas com sucesso!
                    </div>
                )}

                <form className="mt-6 rounded-lg border-2 border-gray-300 p-6 space-y-6" onSubmit={(event) => event.preventDefault()}>
                    
                    <fieldset>
                        <legend className="text-lg font-bold mb-4">Aparência</legend>
                        <label className="flex items-center justify-between gap-4 mb-4" htmlFor="modo">
                            <span>Modo do site</span>
                            <select className="rounded border border-gray-400 p-2 text-green-500 font-bold" name="modo" id="modo" value={modo} onChange={(event) => setModo(event.target.value)}>
                                <option value="claro">Modo claro</option>
                                <option value="escuro">Modo escuro</option>
                            </select>
                        </label>

                        <label className="flex items-center justify-between gap-4" htmlFor="idioma">
                            <span>Idioma</span>
                            <select className="rounded border border-gray-400 p-2 text-green-500 font-bold" name="idioma" id="idioma" value={idioma} onChange={(event) => setIdioma(event.target.value)}>
                                <option value="pt-BR">Português (Brasil)</option>
                                <option value="en-US">English (USA)</option>
                                <option value="es-ES">Español</option>
                            </select>
                        </label>
                    </fieldset>

                    <hr className="border-gray-300" />

                    <fieldset>
                        <legend className="text-lg font-bold mb-4">Acessibilidade</legend>
                        <label className="flex items-center justify-between gap-4 mb-4" htmlFor="tamanho-texto">
                            <span>Tamanho do texto</span>
                            <select className="rounded border border-gray-400 p-2 text-green-500 font-bold" name="tamanhoTexto" id="tamanho-texto" value={tamanhoTexto} onChange={(event) => setTamanhoTexto(event.target.value)}>
                                <option value="normal">Normal</option>
                                <option value="medio">Médio</option>
                                <option value="grande">Grande</option>
                            </select>
                        </label>

                        <label className="flex items-center justify-between gap-4" htmlFor="alto-contraste">
                            <span>Alto contraste</span>
                            <input className="h-5 w-5 accent-green-500 cursor-pointer" type="checkbox" id="alto-contraste" checked={altoContraste} onChange={(event) => setAltoContraste(event.target.checked)} />
                        </label>
                    </fieldset>

                    <hr className="border-gray-300" />

                    <fieldset>
                        <legend className="text-lg font-bold mb-4">Notificações</legend>
                        <label className="flex items-center justify-between gap-4 mb-4" htmlFor="notificacoes">
                            <span>Notificações gerais</span>
                            <input className="h-5 w-5 accent-green-500 cursor-pointer" type="checkbox" id="notificacoes" checked={notificacoes} onChange={(event) => setNotificacoes(event.target.checked)} />
                        </label>
                    </fieldset>

                    <hr className="border-gray-300" />

                    <div className="flex gap-4 pt-4">
                        <button 
                            type="submit" 
                            onClick={handleSalvar}
                            className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors"
                        >
                            Salvar Configurações
                        </button>
                        <button 
                            type="reset" 
                            className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded transition-colors"
                        >
                            Restaurar Padrão
                        </button>
                    </div>
                </form>
            </div>
        </main>
   
    
    )
}

export default Config;