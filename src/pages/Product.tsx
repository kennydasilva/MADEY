import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowIcon, CopyIcon, ShareIcon } from '../components/Icons'
import { Photo } from '../components/Photo'
import { Badge, ProductGrid, RequestLink, StockLine, requestText } from '../components/ProductCard'
import { useUi } from '../context/ui'
import { PRODUCTS, badgeOf, productBySlug, type Product } from '../data/products'
import { formatPrice, productLink } from '../lib/format'
import { img } from '../lib/images'
import { shopUrl } from '../lib/shop'
import { usePageTitle } from '../lib/title'
import NotFound from './NotFound'

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
  return [p.image, `${p.image}-2`, `${p.image}-3`].filter(img)
}

export default function ProductPage() {
  const { slug = '' } = useParams()
  const p = productBySlug(slug)
  const { copy } = useUi()
  const [photo, setPhoto] = useState(0)

  useEffect(() => {
    setPhoto(0)
  }, [slug])

  usePageTitle(p ? `${p.name} · ${p.brand}` : 'Página não encontrada')

  if (!p) return <NotFound />

  const gallery = galleryOf(p)
  const link = productLink(p)
  const crumb = 'text-muted hover:text-gold'
  const quiet = 'flex h-11 items-center gap-2 text-caption font-semibold underline-offset-4 hover:underline'

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
        <nav aria-label="Caminho" className="mb-[clamp(20px,3vw,32px)] flex flex-wrap gap-2 text-caption text-muted">
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
          <span className="text-gold">{p.name}</span>
        </nav>

        <div className="grid items-start gap-[clamp(28px,5vw,80px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="flex w-full max-w-[560px] min-w-0 flex-col gap-3">
            <div className="relative aspect-[4/5] max-h-[72vh] overflow-hidden bg-stone">
              <Photo
                name={gallery[photo]}
                sizes="(min-width: 1024px) 560px, 100vw"
                alt={p.name}
                loading="eager"
                fetchPriority="high"
                className="absolute inset-0 size-full object-cover"
              />
              <Badge badge={badgeOf(p)} className="absolute top-4 left-4" />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setPhoto(i)}
                    aria-label={`Fotografia ${i + 1}`}
                    className={`size-[88px] overflow-hidden border bg-stone ${photo === i ? 'border-gold' : 'border-line'}`}
                  >
                    <Photo name={src} sizes="88px" alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-[22px] lg:sticky lg:top-[100px]">
            <div className="flex flex-col gap-2.5">
              <h1 className="display text-headline text-balance">{p.name}</h1>
              <span className="text-muted">
                <Link to={shopUrl({ brands: [p.brand] })} className="underline underline-offset-4 hover:text-gold">
                  {p.brand}
                </Link>{' '}
                · {p.model} · Ref. {p.ref}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3.5 tabular-nums">
              <span className={`text-[1.875rem] font-bold ${p.was ? 'text-sale' : ''}`}>{formatPrice(p.price)}</span>
              {p.was && (
                <>
                  <span className="text-faint line-through">{formatPrice(p.was)}</span>
                  <span className="bg-gold px-2 py-1 text-label font-bold tracking-[0.14em] text-white uppercase">
                    Poupa {formatPrice(p.was - p.price)}
                  </span>
                </>
              )}
            </div>

            <StockLine product={p} />

            <p className="max-w-[58ch] text-lead text-pretty text-muted">{p.desc}</p>

            <div className="flex flex-col gap-2.5">
              <RequestLink product={p} className="btn btn-wa h-14">
                {requestText(p)}
              </RequestLink>
              <div className="flex gap-6">
                <button onClick={share} className={quiet}>
                  <ShareIcon size={15} />
                  Partilhar
                </button>
                <button onClick={() => copy(link, 'Link do produto copiado')} className={quiet}>
                  <CopyIcon size={15} />
                  Copiar link
                </button>
              </div>
            </div>

            <div className="flex flex-col border-t border-line pt-5">
              <h2 className="mb-2 font-semibold">Especificações</h2>
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
          <h2 className="display text-headline">Também pode gostar</h2>
          <Link to={shopUrl()} className="link-arrow">
            Ver todos <ArrowIcon size={14} strokeWidth={2} />
          </Link>
        </div>
        <ProductGrid products={relatedTo(p)} />
      </section>

      {/* Botão de pedido fixo em ecrãs pequenos; o espaçador evita tapar o rodapé. */}
      <div className="h-20 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-[60] flex items-center gap-3.5 border-t border-line bg-white px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(20,31,51,0.08)] lg:hidden">
        <span className="flex-none text-[1.0625rem] font-bold whitespace-nowrap tabular-nums">{formatPrice(p.price)}</span>
        <RequestLink product={p} className="btn btn-wa h-14 min-w-0 flex-1 px-3">
          {requestText(p)}
        </RequestLink>
      </div>
    </>
  )
}
