import { useEffect } from 'react'

export const SITE_TITLE = 'MADEY — Relógios e acessórios'

/** Título do separador para a página atual; sem argumento usa o título do site. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — MADEY` : SITE_TITLE
  }, [title])
}
