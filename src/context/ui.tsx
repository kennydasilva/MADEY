import { track } from '@vercel/analytics'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Product } from '../data/products'
import { messageFor, whatsappUrl, type OrderLine } from '../lib/format'

interface WaRequest {
  lines: OrderLine[]
}

interface UiState {
  menuOpen: boolean
  searchOpen: boolean
  orderOpen: boolean
  /** Preferência do utilizador para a coluna fixa do pedido em ecrãs largos. */
  dockOpen: boolean
  setDockOpen: (open: boolean) => void
  wa: WaRequest | null
  toast: string | null
  openMenu: () => void
  openSearch: () => void
  openOrder: () => void
  /** No telemóvel abre logo o WhatsApp; no desktop mostra primeiro a mensagem para confirmar ou copiar. */
  requestWhatsApp: (p: Product, qty?: number) => void
  /** Envia o pedido completo, com todos os artigos e o total. */
  requestOrder: (lines: OrderLine[]) => void
  closeAll: () => void
  flash: (message: string) => void
  copy: (text: string, message: string) => Promise<void>
}

const UiContext = createContext<UiState | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [dockOpen, setDockOpen] = useState(true)
  const [wa, setWa] = useState<WaRequest | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const closeAll = useCallback(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setOrderOpen(false)
    setWa(null)
  }, [])

  const flash = useCallback((message: string) => {
    window.clearTimeout(timer.current)
    setToast(message)
    timer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const copy = useCallback(
    async (text: string, message: string) => {
      try {
        await navigator.clipboard.writeText(text)
        flash(message)
      } catch {
        flash('Não foi possível copiar neste navegador')
      }
    },
    [flash],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeAll()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeAll])

  const overlayOpen = menuOpen || searchOpen || orderOpen || !!wa
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : ''
  }, [overlayOpen])

  const send = useCallback((lines: OrderLine[]) => {
    setOrderOpen(false)
    setSearchOpen(false)
    // O próprio WhatsApp já mostra a mensagem antes de enviar: em ecrãs táteis o modal seria um passo a mais.
    if (window.matchMedia('(pointer: coarse)').matches) {
      window.open(whatsappUrl(messageFor(lines)), '_blank', 'noopener')
      return
    }
    setWa({ lines })
  }, [])

  const value = useMemo<UiState>(
    () => ({
      menuOpen,
      searchOpen,
      orderOpen,
      dockOpen,
      setDockOpen,
      wa,
      toast,
      openMenu: () => setMenuOpen(true),
      openSearch: () => {
        setMenuOpen(false)
        setSearchOpen(true)
      },
      openOrder: () => {
        setMenuOpen(false)
        setSearchOpen(false)
        setOrderOpen(true)
      },
      requestWhatsApp: (product, qty = 1) => {
        track('pedido_whatsapp', { produto: product.name, referencia: product.ref, estado: product.stock, artigos: qty })
        send([{ product, qty }])
      },
      requestOrder: (lines) => {
        if (!lines.length) return
        track('pedido_whatsapp', {
          produto: lines.length === 1 ? lines[0].product.name : 'Pedido com vários artigos',
          referencia: lines.map((l) => l.product.ref).join(', '),
          artigos: lines.reduce((n, l) => n + l.qty, 0),
          total: lines.reduce((n, l) => n + l.product.price * l.qty, 0),
        })
        send(lines)
      },
      closeAll,
      flash,
      copy,
    }),
    [menuOpen, searchOpen, orderOpen, dockOpen, wa, toast, closeAll, flash, copy, send],
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi tem de ser usado dentro de <UiProvider>')
  return ctx
}
