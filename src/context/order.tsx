import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isSoldOut, productById, type Product } from '../data/products'
import type { OrderLine } from '../lib/format'

export const MAX_QTY = 9
const STORAGE_KEY = 'madey:pedido'

interface StoredItem {
  id: number
  qty: number
}

interface OrderState {
  lines: OrderLine[]
  /** Número total de unidades no pedido. */
  count: number
  total: number
  qtyOf: (p: Product) => number
  add: (p: Product, qty?: number) => void
  setQty: (p: Product, qty: number) => void
  remove: (p: Product) => void
  clear: () => void
}

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.round(n)))

/** O pedido fica guardado no browser para não se perder ao fechar a página. */
function load(): StoredItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(raw)) return []
    return raw
      .filter((x): x is StoredItem => typeof x?.id === 'number' && typeof x?.qty === 'number')
      .map((x) => ({ id: x.id, qty: clampQty(x.qty) }))
  } catch {
    return []
  }
}

const OrderContext = createContext<OrderState | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredItem[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Sem armazenamento (modo privado, quota): o pedido vive só nesta visita.
    }
  }, [items])

  const add = useCallback((p: Product, qty = 1) => {
    if (isSoldOut(p)) return
    setItems((list) =>
      list.some((x) => x.id === p.id)
        ? list.map((x) => (x.id === p.id ? { ...x, qty: clampQty(x.qty + qty) } : x))
        : [...list, { id: p.id, qty: clampQty(qty) }],
    )
  }, [])
  const setQty = useCallback(
    (p: Product, qty: number) => setItems((list) => list.map((x) => (x.id === p.id ? { ...x, qty: clampQty(qty) } : x))),
    [],
  )
  const remove = useCallback((p: Product) => setItems((list) => list.filter((x) => x.id !== p.id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<OrderState>(() => {
    // Um artigo que saiu do catálogo ou esgotou entretanto deixa de contar para o pedido.
    const lines = items.flatMap((x) => {
      const product = productById(x.id)
      return product && !isSoldOut(product) ? [{ product, qty: x.qty }] : []
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.product.price * l.qty, 0),
      qtyOf: (p) => lines.find((l) => l.product.id === p.id)?.qty ?? 0,
      add,
      setQty,
      remove,
      clear,
    }
  }, [items, add, setQty, remove, clear])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder tem de ser usado dentro de <OrderProvider>')
  return ctx
}
