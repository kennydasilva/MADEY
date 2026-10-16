import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUi } from '../context/ui'
import { PRODUCTS } from '../data/products'
import { formatPrice, productPath } from '../lib/format'
import { useDialog } from '../lib/dialog'
import { matchesQuery, shopUrl } from '../lib/shop'
import { CloseIcon, SearchIcon } from './Icons'
import { Photo } from './Photo'
import { RequestLabel, RequestLink } from './ProductCard'

const POPULAR = ['G-Shock', 'Tissot PRX', 'Seiko 5', 'Cronógrafo', 'Vintage', 'Estojo']

function CloseButton({ label = 'Fechar' }: { label?: string }) {
  const { closeAll } = useUi()
  return (
    <button onClick={closeAll} aria-label={label} className="flex size-11 flex-none items-center justify-center">
      <CloseIcon />
    </button>
  )
}

export function SearchOverlay() {
  const { searchOpen, closeAll } = useUi()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const ref = useDialog<HTMLDivElement>(searchOpen)

  useEffect(() => {
    if (!searchOpen) return
    setQ('')
    input.current?.focus()
  }, [searchOpen])

  if (!searchOpen) return null

  const term = q.trim()
  const results = term ? PRODUCTS.filter((p) => matchesQuery(p, term)) : []
  const seeAll = () => {
    closeAll()
    navigate(shopUrl(results.length ? { q: term } : {}))
  }

  return (
    <div onClick={closeAll} className="overlay-in fixed inset-0 z-[80] bg-navy/55">
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Pesquisar"
        className="panel-top max-h-[88vh] overflow-y-auto bg-white"
      >
        <div className="mx-auto max-w-[880px] px-[clamp(20px,4vw,48px)] pt-5 pb-8">
          <div className="flex items-center gap-3.5 border-b border-gold">
            <SearchIcon size={22} className="flex-none" />
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && term && seeAll()}
              placeholder="Pesquisar marca, modelo ou referência"
              aria-label="Pesquisar"
              className="h-[68px] min-w-0 flex-1 font-serif text-[clamp(24px,3vw,32px)] placeholder:text-faint focus-visible:outline-none"
            />
            <CloseButton label="Fechar pesquisa" />
          </div>

          {!term && (
            <div className="flex flex-col gap-3 pt-[22px]">
              <span className="eyebrow text-muted">Pesquisas populares</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((label) => (
                  <button
                    key={label}
                    onClick={() => setQ(label)}
                    className="h-11 border border-faint px-3.5 text-[13px] hover:border-gold sm:h-9"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {term && results.length > 0 && (
            <div className="flex flex-col">
              {results.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-3.5"
                >
                  <Photo name={p.image} sizes="72px" alt="" className="size-[72px] bg-stone object-cover" />
                  <Link to={productPath(p)} onClick={closeAll} className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-serif text-lg leading-tight font-medium">{p.name}</span>
                    <span className="text-caption text-muted">{p.brand}</span>
                    <span className="text-sm font-bold">{formatPrice(p.price)}</span>
                  </Link>
                  <RequestLink
                    product={p}
                    className="flex h-11 flex-none items-center gap-2 bg-wa px-3.5 text-label font-bold tracking-[0.14em] text-white uppercase hover:bg-wa-dark sm:h-10"
                  >
                    <RequestLabel product={p} size={15} />
                  </RequestLink>
                </div>
              ))}
              <button
                onClick={seeAll}
                className="link-arrow mt-[18px] self-start"
              >
                Ver todos os resultados ({results.length})
              </button>
            </div>
          )}

          {term && results.length === 0 && (
            <div className="flex flex-col items-start gap-3.5 pt-6 pb-1">
              <span role="status" className="text-[15px]">
                Sem resultados para “{term}”.
              </span>
              <button onClick={seeAll} className="link-arrow">
                Ver todos os relógios
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Toast() {
  const { toast } = useUi()
  if (!toast) return null
  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-[110] max-w-[calc(100vw-32px)] -translate-x-1/2 bg-gold px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_12px_32px_rgba(20,31,51,0.3)] lg:bottom-6"
    >
      {toast}
    </div>
  )
}
