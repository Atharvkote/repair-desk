import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'

export const useLanguage = () => {
  const { i18n } = useTranslation()

  const changeLanguage = useCallback(
    (lng) => {
      if (lng === 'en' || lng === 'mr') {
        i18n.changeLanguage(lng)
        localStorage.setItem('preferredLanguage', lng)
      }
    },
    [i18n]
  )

  const currentLanguage = i18n.language || 'en'

  return {
    currentLanguage,
    changeLanguage,
    t: useTranslation().t, // Expose translation function
  }
}

