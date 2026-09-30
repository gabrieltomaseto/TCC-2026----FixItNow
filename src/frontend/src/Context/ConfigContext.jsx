import { createContext, useState, useContext, useEffect } from 'react'

const ConfigContext = createContext()

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig deve ser usado dentro de um ConfigProvider')
  }
  return context
}

export function ConfigProvider({ children }) {
  const [modo, setModo] = useState(() => {
    return localStorage.getItem('modo') || 'claro'
  })
  const [tamanhoTexto, setTamanhoTexto] = useState(() => {
    return localStorage.getItem('tamanhoTexto') || 'normal'
  })
  const [altoContraste, setAltoContraste] = useState(() => {
    return localStorage.getItem('altoContraste') === 'true'
  })
  const [notificacoes, setNotificacoes] = useState(() => {
    return localStorage.getItem('notificacoes') !== 'false'
  })

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('modo', modo)
  }, [modo])

  useEffect(() => {
    localStorage.setItem('tamanhoTexto', tamanhoTexto)
  }, [tamanhoTexto])

  useEffect(() => {
    localStorage.setItem('altoContraste', altoContraste)
  }, [altoContraste])

  useEffect(() => {
    localStorage.setItem('notificacoes', notificacoes)
  }, [notificacoes])

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
    <ConfigContext.Provider value={{
      modo,
      setModo,
      tamanhoTexto,
      setTamanhoTexto,
      altoContraste,
      setAltoContraste,
      notificacoes,
      setNotificacoes,
      tema,
      tamanho,
      contraste
    }}>
      {children}
    </ConfigContext.Provider>
  )
}
