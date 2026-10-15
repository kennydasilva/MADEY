import { track } from '@vercel/analytics'
import type { ReactNode } from 'react'
import { STOCK_INFO, badgeOf, isSoldOut, type Product } from '../data/products'
import { buildWhatsAppMessage, formatPrice, whatsappUrl } from '../lib/format'
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
      {product.was && (
        <span className="text-caption whitespace-nowrap text-faint line-through">{formatPrice(product.was)}</span>
      )}
    </div>
  )
}

export function StockLine({ product, className = '' }: { product: Product; className?: string }) {
  const stock = STOCK_INFO[product.stock]
  return (
    <div className={`flex flex-wrap items-center gap-x-2.5 text-sm ${className}`}>
      <span className={`size-2 flex-none rounded-full ${stock.dot}`} />
      <span className="font-semibold">{stock.label}</span>
    </div>
  )
}

/** Texto da ação: um esgotado pede aviso em vez de encomenda. */
export const requestText = (p: Product) => (isSoldOut(p) ? 'Avisar-me' : 'Solicitar')

/**
 * Link direto para o WhatsApp com a mensagem do relógio já escrita: um toque e a conversa abre.
 * Sem pedido intermédio nem janela de confirmação, para o cliente não desistir pelo caminho.
 */
export function RequestLink({
  product: p,
  className = '',
  children,
}: {
  product: Product
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={whatsappUrl(buildWhatsAppMessage(p, 1))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('pedido_whatsapp', { produto: p.name, referencia: p.ref, estado: p.stock })}
      className={className}
    >
      {children}
    </a>
  )
}

/** O cartão inteiro é o link: tocar na fotografia, no nome ou no botão abre logo o WhatsApp. */
function ProductCard({ product: p }: { product: Product }) {
  return (
    <RequestLink product={p} className="group flex min-w-0 flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        <Photo
          name={p.image}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
          alt=""
          width={1024}
          height={1280}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <Badge badge={badgeOf(p)} className="absolute top-3 left-3" />
      </div>

      <h3 className="mt-4 font-serif text-title leading-[1.2] font-medium underline-offset-4 group-hover:underline">
        {p.name}
      </h3>
      <span className="mt-1 text-caption text-muted">
        {p.brand} · {p.model}
      </span>

      <div className="mt-auto flex flex-col gap-3 pt-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Price product={p} />
        <span className="flex h-11 items-center justify-center border border-gold px-4 text-label font-bold tracking-[0.14em] uppercase transition-colors group-hover:bg-gold group-hover:text-white sm:h-10">
          {requestText(p)}
        </span>
      </div>
    </RequestLink>
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
