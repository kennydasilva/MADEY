import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CopyIcon, ShareIcon, WhatsAppIcon } from '../components/Icons'
import { Badge, ProductGrid } from '../components/ProductCard'
import { useUi } from '../context/ui'
import { PRODUCTS, STOCK_INFO, productBySlug, type Product } from '../data/products'
import { formatPrice, productLink } from '../lib/format'
import { img } from '../lib/images'
import { shopUrl } from '../lib/shop'
import NotFound from './NotFound'

const MAX_QTY = 9

/** Mesma marca primeiro, depois mesma categoria, depois o resto do catálogo. */
function relatedTo(p: Product) {
  const others = PRODUCTS.filter((x) => x.id !== p.id)
  const sameBrand = others.filter((x) => x.brand === p.brand)
  const sameCat = others.filter((x) => !sameBrand.includes(x) && x.cats.some((c) => p.cats.includes(c)))
  const rest = others.filter((x) => !sameBrand.includes(x) && !sameCat.includes(x))
  return [...sameBrand, ...sameCat, ...rest].slice(0, 4)
}

/** Fotos do produto: a principal mais as vistas extra que existirem (ex.: p-boss-2.jpg). */
function galleryOf(p: Product) {
  return [img(p.image), img(`${p.image}-2`), img(`${p.image}-3`)].filter(Boolean)
}

export default function ProductPage() {
  const { slug = '' } = useParams()
  const p = productBySlug(slug)
  const { requestWhatsApp, copy } = useUi()
  const [photo, setPhoto] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setPhoto(0)
    setQty(1)
  }, [slug])

  if (!p) return <NotFound />

  const gallery = galleryOf(p)
  const stock = STOCK_INFO[p.stock]
  const link = productLink(p)
  const crumb = 'text-muted hover:text-navy'

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: `MADEY — ${p.name}`, url: link })
      else await copy(link, 'Link do produto copiado')
    } catch {
      // O utilizador fechou a folha de partilha: nada a fazer.
    }
  }

  return (
    <>
      <section className="wrap pt-[clamp(24px,3vw,40px)]">
        <div className="mb-[clamp(20px,3vw,32px)] flex flex-wrap gap-2 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
          <Link to="/" className={crumb}>
            Início
          </Link>
          <span>/</span>
          <Link to={shopUrl()} className={crumb}>
            Loja
          </Link>
          <span>/</span>
          <Link to={shopUrl({ brands: [p.brand] })} className={crumb}>
            {p.brand}
          </Link>
          <span>/</span>
          <span className="text-navy">{p.name}</span>
        </div>

        <div className="grid items-start gap-[clamp(28px,5vw,80px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="flex w-full max-w-[560px] min-w-0 flex-col gap-3">
            <div className="relative aspect-[4/5] max-h-[72vh] overflow-hidden bg-stone">
              <img src={gallery[photo]} alt={p.name} className="absolute inset-0 size-full object-cover" />
              <Badge badge={p.badge} className="absolute top-4 left-4" />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setPhoto(i)}
                    aria-label={`Fotografia ${i + 1}`}
                    className={`size-[88px] overflow-hidden border bg-stone ${photo === i ? 'border-navy' : 'border-line'}`}
                  >
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-[22px] lg:sticky lg:top-[100px]">
            <div className="flex flex-col gap-2.5">
              <Link to={shopUrl({ brands: [p.brand] })} className="eyebrow self-start text-muted hover:text-navy">
                {p.brand}
              </Link>
              <h1 className="display text-[clamp(34px,3.6vw,50px)] text-balance">{p.name}</h1>
              <span className="text-[13px] text-muted">
                {p.model} · Ref. {p.ref}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3.5">
              <span className={`text-[clamp(24px,2.2vw,28px)] font-bold ${p.was ? 'text-sale' : ''}`}>
                {formatPrice(p.price)}
              </span>
              {p.was && (
                <>
                  <span className="text-[15px] text-faint line-through">{formatPrice(p.was)}</span>
                  <span className="bg-navy px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
                    Poupa {formatPrice(p.was - p.price)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-[13px]">
              <span className={`size-2 rounded-full ${stock.dot}`} />
              <span className="font-semibold">{stock.label}</span>
              <span className="text-muted">{stock.note}</span>
            </div>

            <p className="text-[15px] leading-[1.7] text-pretty text-muted">{p.desc}</p>

            <div className="flex items-center gap-4 pt-1">
              <span className="eyebrow tracking-[0.2em]">Quantidade</span>
              <div className="flex border border-line">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir"
                  className="size-11 text-lg hover:bg-mist"
                >
                  −
                </button>
                <span className="flex size-11 items-center justify-center border-x border-line font-bold" aria-live="polite">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                  aria-label="Aumentar"
                  className="size-11 text-lg hover:bg-mist"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button onClick={() => requestWhatsApp(p, qty)} className="btn btn-wa h-14 gap-3">
                <WhatsAppIcon />
                Solicitar no WhatsApp
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={share} className="btn btn-outline h-[46px] gap-2 px-2 text-[11px] tracking-[0.14em]">
                  <ShareIcon size={15} />
                  Partilhar
                </button>
                <button
                  onClick={() => copy(link, 'Link do produto copiado')}
                  className="btn btn-outline h-[46px] gap-2 px-2 text-[11px] tracking-[0.14em]"
                >
                  <CopyIcon size={15} />
                  Copiar link
                </button>
              </div>
              <p className="mt-1 text-xs leading-[1.6] text-muted">
                A mensagem inclui o produto, a referência e o link. Confirmamos disponibilidade, pagamento e entrega
                consigo no WhatsApp.
              </p>
            </div>

            <div className="flex flex-col border-t border-line pt-5">
              <span className="eyebrow mb-2">Especificações</span>
              {[...Object.entries(p.specs), ['Referência', p.ref]].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 border-b border-line py-3 text-sm"
                >
                  <span className="text-muted">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-[clamp(64px,8vw,112px)]">
        <div className="mb-[clamp(28px,4vw,48px)] flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="eyebrow text-muted">Também pode gostar</span>
            <h2 className="display text-[clamp(30px,3.4vw,44px)]">
              {p.accessory ? 'Mais acessórios' : `Mais de ${p.brand}`}
            </h2>
          </div>
          <Link to={shopUrl()} className="border-b border-navy py-2 text-[11px] font-bold tracking-[0.2em] uppercase">
            Ver todos
          </Link>
        </div>
        <ProductGrid products={relatedTo(p)} />
      </section>

      {/* Barra de compra fixa em ecrãs pequenos; o espaçador evita tapar o rodapé. */}
      <div className="h-20 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-[60] flex items-center gap-3.5 border-t border-line bg-white px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(20,31,51,0.08)] lg:hidden">
        <div className="flex max-w-[40%] min-w-0 flex-none flex-col">
          <span className="text-[17px] font-bold whitespace-nowrap">{formatPrice(p.price)}</span>
          <span className="truncate text-[11px] text-muted">{p.name}</span>
        </div>
        <button onClick={() => requestWhatsApp(p, qty)} className="btn btn-wa h-[52px] flex-1 tracking-[0.12em]">
          <WhatsAppIcon size={18} className="flex-none" />
          Solicitar
        </button>
      </div>
    </>
  )
}
