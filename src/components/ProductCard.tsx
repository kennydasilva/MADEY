import { Link } from 'react-router-dom'
import { useUi } from '../context/ui'
import { badgeOf, type Product } from '../data/products'
import { formatPrice, productPath, requestLabel } from '../lib/format'
import { img } from '../lib/images'
import { WhatsAppIcon } from './Icons'

export function Badge({ badge, className = '' }: { badge?: string; className?: string }) {
  if (!badge) return null
  const promo = badge === 'Promoção'
  return (
    <span
      className={`pointer-events-none px-2.5 py-1.5 text-[10px] leading-none font-bold tracking-[0.16em] uppercase ${promo ? 'bg-sale text-white' : 'bg-white text-navy'} ${className}`}
    >
      {badge}
    </span>
  )
}

export function Price({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={`font-bold ${product.was ? 'text-sale' : ''}`}>{formatPrice(product.price)}</span>
      {product.was && <span className="text-xs text-faint line-through">{formatPrice(product.was)}</span>}
    </div>
  )
}

export function ProductCard({ product: p }: { product: Product }) {
  const { openQuick, requestWhatsApp } = useUi()
  const to = productPath(p)

  return (
    <article className="group flex min-w-0 flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        <Link to={to} aria-label={p.name} className="absolute inset-0">
          <img
            src={img(p.image)}
            alt={p.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <Badge badge={badgeOf(p)} className="absolute top-3 left-3" />
        {/* A vista rápida só aparece com rato; em ecrãs táteis o toque abre o produto. */}
        <button
          onClick={() => openQuick(p)}
          className="absolute inset-x-3 bottom-3 hidden h-9 translate-y-2 bg-white text-[11px] font-semibold tracking-[0.2em] uppercase opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 lg:block"
        >
          Vista rápida
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <span className="text-[10px] font-semibold tracking-[0.22em] text-muted uppercase">{p.brand}</span>
        <Link to={to} className="mt-1.5 font-serif text-[19px] leading-[1.2] font-medium hover:text-muted sm:text-[22px]">
          {p.name}
        </Link>
        <span className="mt-1 text-xs text-muted">{p.model}</span>
        <Price product={p} className="mt-3 mb-4" />
        <button
          onClick={() => requestWhatsApp(p)}
          className="mt-auto flex h-11 items-center justify-center gap-2 border border-navy px-2 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors hover:border-wa hover:bg-wa hover:text-white sm:text-[11px] sm:tracking-[0.14em]"
        >
          <WhatsAppIcon size={16} className="flex-none" />
          <span className="sm:hidden">{requestLabel(p, true)}</span>
          <span className="hidden sm:inline">{requestLabel(p)}</span>
        </button>
      </div>
    </article>
  )
}

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-3.5 gap-y-[clamp(36px,4vw,56px)] sm:grid-cols-3 sm:gap-x-6 ${columns === 4 ? 'lg:grid-cols-4' : ''}`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
