import type { MouseEvent } from 'react'
import { useLocation } from 'react-router-dom'
import type { CategoryId } from '../data/products'
import { parseFilters, shopUrl } from './shop'

export interface NavItem {
  label: string
  to: string
  active: boolean
  onClick?: (e: MouseEvent) => void
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/** Itens do menu principal, partilhados pelo header e pelo menu mobile. */
export function useNavItems(): NavItem[] {
  const { pathname, search } = useLocation()
  const inShop = pathname === '/loja'
  const f = parseFilters(new URLSearchParams(search))
  const only = (c: CategoryId) => inShop && f.cats.length === 1 && f.cats[0] === c && !f.brands.length

  return [
    { label: 'Loja', to: shopUrl(), active: inShop && !f.cats.length && !f.brands.length },
    { label: 'Marcas', to: '/#marcas', active: inShop && f.brands.length > 0 },
    { label: 'Acessórios', to: shopUrl({ cats: ['acessorios'] }), active: only('acessorios') },
    {
      label: 'Contacto',
      to: '#contacto',
      active: false,
      // O rodapé existe em todas as páginas: basta deslizar até ele.
      onClick: (e) => {
        e.preventDefault()
        scrollToId('contacto')
      },
    },
  ]
}
