import { createContext, useState, useEffect } from 'react'

export const ConfigContext = createContext()

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
  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem('idioma') || 'pt-BR'
  })

  // Aplicar tema ao elemento root
  useEffect(() => {
    const root = document.documentElement
    if (modo === 'escuro') {
      root.classList.add('dark')
      document.body.style.backgroundColor = '#111827'
      document.body.style.color = 'white'
    } else {
      root.classList.remove('dark')
      document.body.style.backgroundColor = 'white'
      document.body.style.color = '#111827'
    }
    localStorage.setItem('modo', modo)
  }, [modo])

  // Aplicar tamanho de texto
  useEffect(() => {
    const root = document.documentElement
    if (tamanhoTexto === 'medio') {
      root.style.fontSize = '18px'
    } else if (tamanhoTexto === 'grande') {
      root.style.fontSize = '20px'
    } else {
      root.style.fontSize = '16px'
    }
    localStorage.setItem('tamanhoTexto', tamanhoTexto)
  }, [tamanhoTexto])

  // Aplicar alto contraste
  useEffect(() => {
    const root = document.documentElement
    if (altoContraste) {
      root.style.filter = 'contrast(1.25)'
    } else {
      root.style.filter = 'contrast(1)'
    }
    localStorage.setItem('altoContraste', altoContraste)
  }, [altoContraste])

  useEffect(() => {
    localStorage.setItem('notificacoes', notificacoes)
  }, [notificacoes])

  useEffect(() => {
    localStorage.setItem('idioma', idioma)
    document.documentElement.lang = idioma
  }, [idioma])

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
      idioma,
      setIdioma,
      tema,
      tamanho,
      contraste
    }}>
      {children}
    </ConfigContext.Provider>
  )
}
