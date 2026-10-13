import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useOrder } from '../context/order'
import { useUi } from '../context/ui'

const WIDE = '(min-width: 1280px)'

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches)
  useEffect(() => {
    const mq = window.matchMedia(WIDE)
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

/**
 * Onde o pedido se mostra. Em ecrãs largos, no início e na loja, fica numa coluna
 * fixa ao lado do catálogo; no resto abre como painel por cima da página.
 */
export function useOrderView() {
  const { dockOpen, setDockOpen, openOrder } = useUi()
  const { count } = useOrder()
  const { pathname } = useLocation()
  const wide = useWide()
  const dockable = wide && (pathname === '/' || pathname === '/loja') && count > 0

  return {
    docked: dockable && dockOpen,
    /** Mostra o pedido da forma adequada a este ecrã e página. */
    show: () => (dockable ? setDockOpen(true) : openOrder()),
    toggle: () => (dockable ? setDockOpen(!dockOpen) : openOrder()),
  }
}
