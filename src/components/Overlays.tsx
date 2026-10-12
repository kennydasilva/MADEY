import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { whatsappDisplay } from '../config'
import { useUi } from '../context/ui'
import { PRODUCTS, STOCK_INFO } from '../data/products'
import {
  GENERAL_MESSAGE,
  buildWhatsAppMessage,
  formatPrice,
  productLink,
  productPath,
  requestLabel,
  whatsappUrl,
} from '../lib/format'
import { useDialog } from '../lib/dialog'
import { img } from '../lib/images'
import { matchesQuery, shopUrl } from '../lib/shop'
import { CloseIcon, CopyIcon, ImageIcon, SearchIcon, WhatsAppIcon } from './Icons'
import { Price } from './ProductCard'

const POPULAR = ['G-Shock', 'Tissot PRX', 'Seiko 5', 'Cronógrafo', 'Vintage', 'Estojo']

function CloseButton({ label = 'Fechar' }: { label?: string }) {
  const { closeAll } = useUi()
  return (
    <button onClick={closeAll} aria-label={label} className="flex size-11 flex-none items-center justify-center">
      <CloseIcon />
    </button>
  )
}

export function QuickView() {
  const { quick: p, closeAll, requestWhatsApp } = useUi()
  const ref = useDialog<HTMLDivElement>(!!p)
  if (!p) return null
  const stock = STOCK_INFO[p.stock]

  return (
    <div onClick={closeAll} className="overlay-in fixed inset-0 z-[70] flex justify-end bg-navy/55">
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Vista rápida"
        className="panel-right flex h-full w-[min(480px,100%)] flex-col overflow-y-auto bg-white"
      >
        <div className="flex items-center justify-between border-b border-line py-2.5 pr-3 pl-6">
          <span className="eyebrow">Vista rápida</span>
          <CloseButton />
        </div>
        <div className="relative aspect-square flex-none bg-stone">
          <img src={img(p.image)} alt={p.name} className="absolute inset-0 size-full object-cover" />
        </div>
        <div className="flex flex-col gap-3.5 px-6 py-7">
          <span className="eyebrow text-muted">{p.brand}</span>
          <h2 className="display text-[32px] leading-[1.1]">{p.name}</h2>
          <span className="text-[13px] text-muted">
            {p.model} · Ref. {p.ref}
          </span>
          <Price product={p} className="text-[22px]" />
          <div className="flex items-center gap-2.5 text-[13px]">
            <span className={`size-2 rounded-full ${stock.dot}`} />
            {stock.label}
          </div>
          <button onClick={() => requestWhatsApp(p)} className="btn btn-wa mt-2 h-[54px] gap-3">
            <WhatsAppIcon size={18} />
            {requestLabel(p)}
          </button>
          <Link
            to={productPath(p)}
            onClick={closeAll}
            className="btn btn-outline hover:bg-navy hover:text-white"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  )
}

export function SearchOverlay() {
  const { searchOpen, closeAll, requestWhatsApp } = useUi()
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
    navigate(shopUrl({ q: term }))
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
          <div className="flex items-center gap-3.5 border-b border-navy">
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
                    className="h-11 border border-faint px-3.5 text-[13px] hover:border-navy sm:h-9"
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
                  <img src={img(p.image)} alt="" className="size-[72px] bg-stone object-cover" />
                  <Link to={productPath(p)} onClick={closeAll} className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">{p.brand}</span>
                    <span className="font-serif text-xl leading-tight font-medium">{p.name}</span>
                    <span className="text-sm font-bold">{formatPrice(p.price)}</span>
                  </Link>
                  <button
                    onClick={() => requestWhatsApp(p)}
                    aria-label={`${requestLabel(p)}: ${p.name}`}
                    className="flex h-11 items-center gap-2 border border-navy px-3.5 text-[11px] font-bold tracking-[0.14em] uppercase hover:border-wa hover:bg-wa hover:text-white"
                  >
                    <WhatsAppIcon size={16} />
                    <span className="hidden sm:inline">{requestLabel(p, true)}</span>
                  </button>
                </div>
              ))}
              <button
                onClick={seeAll}
                className="mt-[18px] self-start border-b border-navy py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase"
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
              <a
                href={whatsappUrl(GENERAL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline h-11 px-[18px] text-[11px] tracking-[0.14em]"
              >
                <WhatsAppIcon size={16} className="text-wa" />
                Perguntar no WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function WhatsAppModal() {
  const { wa, closeAll, copy, flash } = useUi()
  const ref = useDialog<HTMLDivElement>(!!wa)
  if (!wa) return null
  const { product: p, qty } = wa
  const message = buildWhatsAppMessage(p, qty)

  const shareWithPhoto = async () => {
    try {
      if (!navigator.share) return await copy(message, 'Partilha indisponível aqui — mensagem copiada')
      const blob = await (await fetch(img(p.image))).blob()
      const file = new File([blob], `${p.ref}.jpg`, { type: blob.type || 'image/jpeg' })
      const withFile = navigator.canShare?.({ files: [file] })
      await navigator.share(withFile ? { text: message, files: [file] } : { text: message, url: productLink(p) })
    } catch (e) {
      // Cancelar a partilha não é um erro; qualquer outra falha cai na cópia.
      if ((e as Error)?.name !== 'AbortError') copy(message, 'Mensagem copiada — cole-a no WhatsApp')
    }
  }

  const small = 'btn btn-outline h-[46px] gap-2 px-2 text-[11px] tracking-[0.12em]'

  return (
    <div onClick={closeAll} className="overlay-in fixed inset-0 z-[100] grid place-items-center bg-navy/60 p-4">
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Solicitar no WhatsApp"
        className="panel-pop flex max-h-[calc(100dvh-32px)] w-[min(540px,100%)] flex-col overflow-y-auto bg-white shadow-[0_24px_60px_rgba(20,31,51,0.3)]"
      >
        <div className="flex items-center justify-between border-b border-line py-3 pr-3 pl-7">
          <h2 className="font-serif text-[26px] font-medium">{requestLabel(p)}</h2>
          <CloseButton />
        </div>
        <div className="flex flex-col gap-[18px] px-7 pt-[22px] pb-7">
          <div className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-4">
            <img src={img(p.image)} alt="" className="size-[76px] bg-stone object-cover" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
                {p.brand} · {p.ref}
              </span>
              <span className="font-serif text-[22px] leading-[1.15] font-medium">{p.name}</span>
              <span className="text-sm font-bold">
                {qty > 1 ? `${qty} × ${formatPrice(p.price)}` : formatPrice(p.price)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow tracking-[0.2em]">Mensagem para {whatsappDisplay}</span>
            <div className="border border-line bg-mist px-[18px] py-4 text-[13px] leading-[1.6] break-words whitespace-pre-wrap">
              {message}
            </div>
          </div>
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              closeAll()
              flash('A abrir o WhatsApp…')
            }}
            className="btn btn-wa h-14 gap-3"
          >
            <WhatsAppIcon />
            Abrir WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={shareWithPhoto} className={small}>
              <ImageIcon size={15} />
              Partilhar com foto
            </button>
            <button onClick={() => copy(message, 'Mensagem copiada — cole-a no WhatsApp')} className={small}>
              <CopyIcon size={15} />
              Copiar mensagem
            </button>
          </div>
          <p className="border-t border-line pt-3.5 text-xs leading-[1.6] text-muted">
            O WhatsApp não anexa fotografias automaticamente através de links. A mensagem inclui o link do produto e a
            referência. No telemóvel, use “Partilhar com foto” para enviar também a imagem.
          </p>
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
      className="fixed bottom-24 left-1/2 z-[110] max-w-[calc(100vw-32px)] -translate-x-1/2 bg-navy px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_12px_32px_rgba(20,31,51,0.3)] lg:bottom-6"
    >
      {toast}
    </div>
  )
}
