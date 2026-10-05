import { useContext } from 'react'
import { ConfigContext } from './ConfigContext'
import { translations } from './translations'

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig deve ser usado dentro de um ConfigProvider')
  }
  return context
}

export const useTranslation = () => {
  const { idioma } = useConfig()
  return (key) => {
    return translations[idioma]?.[key] || translations['pt-BR']?.[key] || key
  }
}
