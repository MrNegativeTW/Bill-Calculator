// @ts-nocheck
import { type I18n } from 'vue-i18n'
import { SUPPORT_LOCALES } from '../i18n'

export interface SeoMetadata {
  title: string
  description: string
}

export function updateSeoMetadata(i18n: I18n, locale: string, customMetadata?: Partial<SeoMetadata>) {
  // Ensure valid locale
  if (!SUPPORT_LOCALES.includes(locale)) {
    locale = 'en'
  }

  // Get metadata from i18n files
  const metadata: SeoMetadata = {
    title: i18n.global.t(`global.meta_title`),
    description: i18n.global.t(`global.meta_description`),
    ...customMetadata
  }

  // Update document metadata
  document.title = metadata.title
  
  // Update meta description
  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', metadata.description)
  }
  
  // Update Open Graph metadata
  const ogTitleMeta = document.querySelector('meta[property="og:title"]')
  const ogDescriptionMeta = document.querySelector('meta[property="og:description"]')
  
  if (ogTitleMeta) ogTitleMeta.setAttribute('content', metadata.title)
  if (ogDescriptionMeta) ogDescriptionMeta.setAttribute('content', metadata.description)
  
  // Update HTML lang attribute
  document.documentElement.setAttribute('lang', locale)
  
  return metadata
}