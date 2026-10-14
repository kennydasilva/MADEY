import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrder } from '../context/order'
import { useUi } from '../context/ui'
import { STOCK_INFO, badgeOf, isSoldOut, type Product } from '../data/products'
import { formatPrice, productPath } from '../lib/format'
import { useOrderView } from '../lib/orderView'
import { ArrowIcon, CheckIcon, CloseIcon, PlusIcon } from './Icons'
import { Photo } from './Photo'

export function Badge({ badge, className = '' }: { badge?: string; className?: string }) {
  if (!badge) return null
  const promo = badge === 'Promoção'
  return (
    <span
      className={`pointer-events-none px-2.5 py-1.5 text-label leading-none font-bold tracking-[0.14em] uppercase ${promo ? 'bg-sale text-white' : 'bg-white text-gold'} ${className}`}
    >
      {badge}
    </span>
  )
}

export function Price({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 tabular-nums ${className}`}>
      <span className={`font-bold whitespace-nowrap ${product.was ? 'text-sale' : ''}`}>{formatPrice(product.price)}</span>
      {product.was && <span className="text-caption whitespace-nowrap text-faint line-through">{formatPrice(product.was)}</span>}
    </div>
  )
}

export function StockLine({ product, className = '' }: { product: Product; className?: string }) {
  const stock = STOCK_INFO[product.stock]
  return (
    <div className={`flex flex-wrap items-center gap-x-2.5 text-sm ${className}`}>
      <span className={`size-2 flex-none rounded-full ${stock.dot}`} />
      <span className="font-semibold">{stock.label}</span>
      {stock.note && <span className="text-muted">{stock.note}</span>}
    </div>
  )
}

/**
 * Botão de juntar ao pedido. Depois de adicionado passa a abrir o pedido;
 * um artigo esgotado pede aviso em vez de entrar na lista.
 */
export function AddButton({
  product: p,
  qty = 1,
  full = false,
  short = false,
}: {
  product: Product
  qty?: number
  full?: boolean
  /** Etiquetas curtas para a barra fixa do telemóvel. */
  short?: boolean
}) {
  const { add, qtyOf, count } = useOrder()
  const { requestWhatsApp, flash, setDockOpen } = useUi()
  const { show } = useOrderView()
  const inOrder = qtyOf(p)

  const size = full
    ? `btn h-14 w-full ${short ? 'px-3 tracking-[0.1em]' : ''}`
    : 'flex h-11 flex-none items-center justify-center gap-2 border px-3.5 text-label font-bold tracking-[0.14em] uppercase transition-colors sm:h-10'

  if (isSoldOut(p)) {
    return (
      <button
        onClick={() => requestWhatsApp(p)}
        aria-label={full ? undefined : `Avisar-me quando voltar: ${p.name}`}
        className={`${size} ${full ? 'btn-outline' : 'border-line hover:border-gold'}`}
      >
        {full && !short ? 'Avisar-me quando voltar' : 'Avisar-me'}
      </button>
    )
  }
  if (inOrder) {
    return (
      <button
        onClick={show}
        aria-label={full ? undefined : `${p.name} está no pedido. Ver pedido`}
        className={`${size} ${full ? 'btn-outline' : 'border-gold bg-gold text-white hover:bg-gold-dark'}`}
      >
        <CheckIcon size={full ? 14 : 11} className="flex-none" />
        {full ? (short ? `No pedido (${inOrder})` : `No pedido (${inOrder}) · Ver pedido`) : 'No pedido'}
      </button>
    )
  }
  return (
    <button
      onClick={() => {
        // O primeiro artigo abre sempre a coluna do pedido; depois respeita quem a recolheu.
        if (!count) setDockOpen(true)
        add(p, qty)
        flash(`${p.name} foi adicionado ao pedido`)
      }}
      aria-label={full ? undefined : `Adicionar ao pedido: ${p.name}`}
      className={`${size} ${full ? 'btn-dark' : 'border-line hover:border-gold hover:bg-gold hover:text-white'}`}
    >
      <PlusIcon size={full ? 18 : 14} className="flex-none" />
      {full && !short ? 'Adicionar ao pedido' : 'Adicionar'}
    </button>
  )
}

interface CardProps {
  product: Product
  open: boolean
  panelId: string
  onToggle: () => void
}

function ProductCard({ product: p, open, panelId, onToggle }: CardProps) {
  return (
    <article className="group flex min-w-0 flex-col">
      {/* A fotografia abre o detalhe com o rato; quem usa teclado ou leitor de ecrã usa o botão do nome. */}
      <div
        onClick={onToggle}
        className={`relative aspect-[4/5] cursor-pointer overflow-hidden bg-stone outline-offset-0 ${open ? 'outline-2 outline-navy' : ''}`}
      >
        <Photo
          name={p.image}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          alt=""
          width={1024}
          height={1280}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <Badge badge={badgeOf(p)} className="absolute top-3 left-3" />
        <span
          aria-hidden="true"
          className={`absolute right-3 bottom-3 flex size-9 items-center justify-center bg-white transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        >
          <PlusIcon size={16} />
        </span>
      </div>

      <h3 className="mt-4 font-serif text-title leading-[1.2] font-medium">
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="text-left underline-offset-4 hover:underline"
        >
          {p.name}
        </button>
      </h3>
      <span className="mt-1 text-caption text-muted">
        {p.brand} · {p.model}
      </span>

      <div className="mt-auto flex flex-col gap-3 pt-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Price product={p} />
        <AddButton product={p} />
      </div>
    </article>
  )
}

/** O detalhe do relógio, aberto na própria grelha a ocupar a linha inteira. */
function CardDetail({ product: p, id, onClose }: { product: Product; id: string; onClose: () => void }) {
  const { requestWhatsApp } = useUi()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [p.id])

  return (
    <div
      ref={ref}
      id={id}
      role="region"
      aria-label={`Detalhes: ${p.name}`}
      className="panel-reveal relative col-span-full grid scroll-mb-6 bg-mist md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
    >
      <div className="relative aspect-square bg-stone md:aspect-auto md:min-h-[440px]">
        <Photo
          name={p.image}
          sizes="(min-width: 768px) 45vw, 100vw"
          alt={p.name}
          className="absolute inset-0 size-full object-cover"
        />
        <Badge badge={badgeOf(p)} className="absolute top-4 left-4" />
      </div>

      <div className="flex min-w-0 flex-col gap-5 p-[clamp(20px,3.5vw,48px)]">
        <div className="flex flex-col gap-2 pr-10">
          <h3 className="display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] text-balance">{p.name}</h3>
          <span className="text-caption text-muted">
            {p.brand} · {p.model} · Ref. {p.ref}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <Price product={p} className="text-[1.375rem]" />
          <StockLine product={p} />
        </div>

        <p className="max-w-[58ch] text-pretty text-muted">{p.desc}</p>

        <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
          <div className="min-w-[240px] flex-1">
            <AddButton product={p} full />
          </div>
          {!isSoldOut(p) && (
            <button onClick={() => requestWhatsApp(p)} className="btn btn-outline h-14 min-w-[220px] flex-1 px-5">
              Solicitar agora
            </button>
          )}
        </div>
        <Link to={productPath(p)} className="link-arrow self-start">
          Ver página completa <ArrowIcon size={14} strokeWidth={2} />
        </Link>
      </div>

      <button
        onClick={onClose}
        aria-label="Fechar detalhes"
        className="absolute top-2 right-2 flex size-11 items-center justify-center bg-white hover:bg-stone md:bg-transparent"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  const [openId, setOpenId] = useState<number | null>(null)
  const baseId = useId()
  const grid = useRef<HTMLDivElement>(null)
  const open = products.find((p) => p.id === openId)
  const { docked } = useOrderView()
  // Com o pedido ao lado há menos largura: uma coluna a menos até o ecrã ser bem largo.
  const cols =
    columns === 4
      ? docked
        ? 'lg:grid-cols-3 min-[1700px]:grid-cols-4'
        : 'lg:grid-cols-4'
      : docked
        ? 'sm:grid-cols-2 min-[1536px]:grid-cols-3'
        : ''

  const close = () => {
    // O painel desaparece: o foco volta ao nome do relógio que o abriu.
    const trigger = grid.current?.querySelector<HTMLElement>('[aria-expanded="true"]')
    setOpenId(null)
    if (grid.current?.contains(document.activeElement)) trigger?.focus()
  }

  return (
    // "dense" deixa o detalhe ocupar a linha seguinte sem abrir buracos na linha do cartão.
    <div
      ref={grid}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation()
          close()
        }
      }}
      className={`grid grid-flow-row-dense grid-cols-2 gap-x-3.5 gap-y-[clamp(36px,4vw,56px)] sm:grid-cols-3 sm:gap-x-6 ${cols}`}
    >
      {products.map((p) => [
        <ProductCard
          key={p.id}
          product={p}
          open={open?.id === p.id}
          panelId={`${baseId}-detalhe`}
          onToggle={() => (open?.id === p.id ? close() : setOpenId(p.id))}
        />,
        open?.id === p.id && <CardDetail key="detalhe" product={p} id={`${baseId}-detalhe`} onClose={close} />,
      ])}
    </div>
  )
}
