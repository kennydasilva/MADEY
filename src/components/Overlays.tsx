import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { whatsappDisplay } from '../config'
import { useUi } from '../context/ui'
import { PRODUCTS } from '../data/products'
import {
  GENERAL_MESSAGE,
  formatPrice,
  itemsLabel,
  messageFor,
  productLink,
  productPath,
  requestLabel,
  whatsappUrl,
} from '../lib/format'
import { useDialog } from '../lib/dialog'
import { img } from '../lib/images'
import { matchesQuery, shopUrl } from '../lib/shop'
import { CloseIcon, CopyIcon, ImageIcon, SearchIcon, WhatsAppIcon } from './Icons'
import { Photo } from './Photo'
import { AddButton } from './ProductCard'

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
                  <Photo name={p.image} sizes="72px" alt="" className="size-[72px] bg-stone object-cover" />
                  <Link to={productPath(p)} onClick={closeAll} className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-serif text-xl leading-tight font-medium">{p.name}</span>
                    <span className="text-caption text-muted">{p.brand}</span>
                    <span className="text-sm font-bold">{formatPrice(p.price)}</span>
                  </Link>
                  <AddButton product={p} />
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
  const { lines } = wa
  const single = lines.length === 1 ? lines[0] : null
  const message = messageFor(lines)
  const total = lines.reduce((n, l) => n + l.product.price * l.qty, 0)
  const title = single ? requestLabel(single.product) : 'Solicitar pedido'

  const shareWithPhoto = async () => {
    if (!single) return
    const p = single.product
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
        aria-label={title}
        className="panel-pop flex max-h-[calc(100dvh-32px)] w-[min(540px,100%)] flex-col overflow-y-auto bg-white shadow-[0_24px_60px_rgba(20,31,51,0.3)]"
      >
        <div className="flex items-center justify-between border-b border-line py-3 pr-3 pl-7">
          <h2 className="font-serif text-[26px] font-medium">{title}</h2>
          <CloseButton />
        </div>
        <div className="flex flex-col gap-[18px] px-7 pt-[22px] pb-7">
          {single ? (
            <div className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-4">
              <Photo name={single.product.image} sizes="76px" alt="" className="size-[76px] bg-stone object-cover" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-serif text-[22px] leading-[1.15] font-medium">{single.product.name}</span>
                <span className="text-caption text-muted">
                  {single.product.brand} · Ref. {single.product.ref}
                </span>
                <span className="text-sm font-bold tabular-nums">
                  {single.qty > 1
                    ? `${single.qty} × ${formatPrice(single.product.price)}`
                    : formatPrice(single.product.price)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex">
                {lines.slice(0, 4).map((l) => (
                  <Photo
                    key={l.product.id}
                    name={l.product.image}
                    sizes="56px"
                    alt=""
                    className="-mr-2 size-14 border-2 border-white bg-stone object-cover"
                  />
                ))}
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-caption text-muted">{itemsLabel(lines.reduce((n, l) => n + l.qty, 0))}</span>
                <span className="font-bold tabular-nums">Total estimado: {formatPrice(total)}</span>
              </div>
            </div>
          )}
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
          <div className={`grid gap-2.5 ${single ? 'grid-cols-2' : ''}`}>
            {single && (
              <button onClick={shareWithPhoto} className={small}>
                <ImageIcon size={15} />
                Partilhar com foto
              </button>
            )}
            <button onClick={() => copy(message, 'Mensagem copiada — cole-a no WhatsApp')} className={small}>
              <CopyIcon size={15} />
              Copiar mensagem
            </button>
          </div>
          <p className="border-t border-line pt-3.5 text-xs leading-[1.6] text-muted">
            {single
              ? 'O WhatsApp não anexa fotografias automaticamente através de links. A mensagem inclui o link do produto e a referência. No telemóvel, use “Partilhar com foto” para enviar também a imagem.'
              : 'A mensagem leva a referência e o link de cada artigo. O pedido continua guardado neste dispositivo até o limpar.'}
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
