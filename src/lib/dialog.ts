import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

/**
 * Comportamento de diálogo modal: ao abrir leva o foco para dentro, mantém o Tab
 * preso no painel e, ao fechar, devolve o foco ao elemento que o abriu.
 */
export function useDialog<T extends HTMLElement>(open: boolean) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!open || !node) return
    const opener = document.activeElement as HTMLElement | null
    const focusables = () => [...node.querySelectorAll<HTMLElement>(FOCUSABLE)]

    if (!node.contains(document.activeElement)) (focusables()[0] ?? node).focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    node.addEventListener('keydown', onKey)
    return () => {
      node.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [open])

  return ref
}
