import { useState } from "react"

function Config() {
    const [modo, setModo] = useState("claro")
    const [tamanhoTexto, setTamanhoTexto] = useState("normal")
    const [altoContraste, setAltoContraste] = useState(false)

    const tema = modo === "escuro"
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-900"
    const tamanho = {
        normal: "text-base",
        medio: "text-lg",
        grande: "text-xl",
    }[tamanhoTexto]
    const contraste = altoContraste ? "contrast-125" : ""

    return (
        <main className={`${tema} ${tamanho} ${contraste} min-h-screen p-6 transition-colors`}>
            <div className="mx-auto max-w-2xl">
                <h1 className="text-4xl font-bold">Configurações FIX <span className="text-green-500">IT</span> Now</h1>
                <p className="mt-2">Personalize a sua experiência.</p>

                <form className="mt-6 rounded-lg border-2 border-gray-300 p-6" onSubmit={(event) => event.preventDefault()}>
                    <fieldset>
                        <legend className="text-lg font-bold">Aparência</legend>
                        <label className="mt-4 flex items-center justify-between gap-4" htmlFor="modo">
                            <span>Modo do site</span>
                            <select className="rounded border border-gray-400 p-2 text-green-500 font-bold" name="modo" id="modo" value={modo} onChange={(event) => setModo(event.target.value)}>
                                <option value="claro">Modo claro</option>
                                <option value="escuro">Modo escuro</option>
                            </select>
                        </label>
                    </fieldset>

                    <hr className="my-6 border-gray-300" />

                    <fieldset>
                        <legend className="text-lg font-bold">Acessibilidade</legend>
                        <label className="mt-4 flex items-center justify-between gap-4" htmlFor="tamanho-texto">
                            <span>Tamanho do texto</span>
                            <select className="rounded border border-gray-400 p-2 text-green-500 font-bold" name="tamanhoTexto" id="tamanho-texto" value={tamanhoTexto} onChange={(event) => setTamanhoTexto(event.target.value)}>
                                <option value="normal">Normal</option>
                                <option value="medio">Médio</option>
                                <option value="grande">Grande</option>
                            </select>
                        </label>

                        <label className="mt-4 flex items-center justify-between gap-4" htmlFor="alto-contraste">
                            <span>Alto contraste</span>
                            <input className="h-5 w-5 accent-green-500" type="checkbox" id="alto-contraste" checked={altoContraste} onChange={(event) => setAltoContraste(event.target.checked)} />
                        </label>
                    </fieldset>
                </form>
            </div>
        </main>
    )
}

export default Config;