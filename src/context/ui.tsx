import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Product } from '../data/products'

interface WaRequest {
  product: Product
  qty: number
}

interface UiState {
  menuOpen: boolean
  searchOpen: boolean
  quick: Product | null
  wa: WaRequest | null
  toast: string | null
  openMenu: () => void
  openSearch: () => void
  openQuick: (p: Product) => void
  /** Abre a confirmação com a mensagem pré-preenchida antes de ir para o WhatsApp. */
  requestWhatsApp: (p: Product, qty?: number) => void
  closeAll: () => void
  flash: (message: string) => void
  copy: (text: string, message: string) => Promise<void>
}

const UiContext = createContext<UiState | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quick, setQuick] = useState<Product | null>(null)
  const [wa, setWa] = useState<WaRequest | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const closeAll = useCallback(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setQuick(null)
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

  const overlayOpen = menuOpen || searchOpen || !!quick || !!wa
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? 'hidden' : ''
  }, [overlayOpen])

  const value = useMemo<UiState>(
    () => ({
      menuOpen,
      searchOpen,
      quick,
      wa,
      toast,
      openMenu: () => setMenuOpen(true),
      openSearch: () => {
        setMenuOpen(false)
        setSearchOpen(true)
      },
      openQuick: (p) => setQuick(p),
      requestWhatsApp: (product, qty = 1) => {
        setQuick(null)
        setSearchOpen(false)
        setWa({ product, qty })
      },
      closeAll,
      flash,
      copy,
    }),
    [menuOpen, searchOpen, quick, wa, toast, closeAll, flash, copy],
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi tem de ser usado dentro de <UiProvider>')
  return ctx
}
