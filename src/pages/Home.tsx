import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { Logo } from '../components/Logo'
import { Photo } from '../components/Photo'
import { Price, ProductGrid, RequestLink, StockLine, requestText } from '../components/ProductCard'
import { BRANDS, PRODUCTS, type CategoryId } from '../data/products'
import { productPath } from '../lib/format'
import { shopUrl, sortProducts } from '../lib/shop'
import { usePageTitle } from '../lib/title'

const section = 'py-[clamp(64px,8vw,120px)]'

function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-[clamp(28px,4vw,48px)] flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <h2 className="display text-headline text-balance">{title}</h2>
      {action}
    </div>
  )
}

// A loja própria ("MADEY Selection") não é uma marca de relógios para anunciar no hero.
const WATCH_BRANDS = BRANDS.filter((b) => !b.startsWith('MADEY'))
const NEWEST = sortProducts(PRODUCTS, 'novidades').slice(0, 4)
/** Destaque editorial: o relógio em stock de maior valor que não esteja já nas novidades. */
const SPOTLIGHT = PRODUCTS.filter((p) => !p.accessory && p.stock === 'in' && !NEWEST.includes(p)).sort(
  (a, b) => b.price - a.price,
)[0]

function Hero() {
  return (
    <section className="on-dark relative bg-navy text-white">
      <Photo
        name="hero"
        sizes="100vw"
        alt="Relógio cronógrafo em aço com mostrador azul"
        loading="eager"
        fetchPriority="high"
        className="h-[300px] w-full object-cover object-[78%_center] sm:h-[420px] lg:absolute lg:inset-0 lg:h-full"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-3/5 bg-linear-to-r from-navy-deep/85 to-transparent lg:block" />
      <div className="wrap relative flex items-center py-[clamp(40px,6vw,96px)] lg:min-h-[clamp(560px,76vh,740px)]">
        <div className="flex max-w-[660px] flex-col gap-7">
          <Logo variant="mark" className="hidden h-16 self-start text-gold-light lg:block" />
          <h1 className="display text-display leading-[1.02] tracking-[-0.01em] text-balance">
            Relógios escolhidos, entregues em Maputo.
          </h1>
          <p className="max-w-[40ch] text-lead text-line">
            {WATCH_BRANDS.slice(0, 4).join(', ')} e outras marcas, com preço em meticais.
          </p>
          <Link to={shopUrl()} className="btn btn-dark mt-1 self-start">
            Ver relógios
          </Link>
        </div>
      </div>
    </section>
  )
}

function Newest() {
  return (
    <section className={`wrap ${section}`}>
      <SectionHeading
        title="Acabados de chegar"
        action={
          <Link to={shopUrl()} className="link-arrow">
            Ver os {PRODUCTS.length} artigos <ArrowIcon size={14} strokeWidth={2} />
          </Link>
        }
      />
      <ProductGrid products={NEWEST} />
    </section>
  )
}

function Spotlight() {
  const p = SPOTLIGHT
  if (!p) return null
  return (
    <section className={`wrap ${section}`}>
      <div className="grid items-center gap-[clamp(28px,5vw,88px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Link to={productPath(p)} className="group relative block aspect-[4/5] overflow-hidden bg-stone sm:aspect-[5/4] lg:aspect-[4/5]">
          <Photo
            name={p.image}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={p.name}
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="display text-headline text-balance">{p.name}</h2>
            <span className="text-muted">
              {p.brand} · {p.model}
            </span>
          </div>
          <p className="max-w-[52ch] text-lead text-pretty text-muted">{p.desc}</p>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <Price product={p} className="text-[1.75rem]" />
            <StockLine product={p} />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <RequestLink product={p} className="btn btn-dark h-14 sm:w-[280px]">
              {requestText(p)}
            </RequestLink>
            <Link to={productPath(p)} className="link-arrow self-start">
              Ver detalhes <ArrowIcon size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const count = (cat: CategoryId) => PRODUCTS.filter((p) => p.cats.includes(cat)).length

// Fotografias que não se repetem nas secções vizinhas (novidades e destaque).
const COLLECTIONS: { cat: CategoryId; title: string; image: string }[] = [
  { cat: 'homem', title: 'Homem', image: 'p-vintage' },
  { cat: 'senhora', title: 'Senhora', image: 'c-women' },
  { cat: 'classico', title: 'Clássico & Elegante', image: 'p-edifice' },
  { cat: 'acessorios', title: 'Acessórios', image: 'p-case' },
]

function Collections() {
  return (
    <section className="bg-mist">
      <div className={`wrap ${section}`}>
        <SectionHeading title="Encontre o seu estilo" />
        <div className="grid gap-x-3.5 gap-y-8 sm:gap-x-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <Link
            to={shopUrl({ cats: ['desporto'] })}
            className="on-dark group relative flex min-h-[380px] items-end overflow-hidden bg-navy-deep text-white lg:min-h-0"
          >
            <Photo
              name="promo"
              sizes="(min-width: 1024px) 55vw, 100vw"
              alt="Relógio desportivo no pulso, com a cidade à noite em fundo"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-navy-deep/90 via-navy-deep/35 via-45% to-transparent" />
            <div className="relative flex flex-col gap-3 p-[clamp(20px,3vw,40px)]">
              <h3 className="display text-[clamp(2rem,1.5rem+2vw,3rem)] text-balance">
                Desporto &amp; Digital: feito para a cidade, pronto para tudo.
              </h3>
              <span className="link-arrow mt-2 self-start">
                Ver {count('desporto')} relógios <ArrowIcon size={14} strokeWidth={2} />
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 sm:gap-x-6">
            {COLLECTIONS.map((c) => (
              <Link key={c.cat} to={shopUrl({ cats: [c.cat] })} className="group flex min-w-0 flex-col gap-3.5">
                <div className="relative aspect-[5/4] overflow-hidden bg-stone">
                  <Photo
                    name={c.image}
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    alt=""
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-title leading-[1.15] font-medium underline-offset-4 group-hover:underline">
                    {c.title}
                  </span>
                  <ArrowIcon size={16} className="flex-none translate-y-0.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Cada marca com a fotografia de um dos seus relógios (acessórios só se não houver relógio). */
const BRAND_CARDS = BRANDS.map((b) => {
  const items = PRODUCTS.filter((p) => p.brand === b)
  const cover = items.find((p) => !p.accessory) ?? items[0]
  const watches = items.filter((p) => !p.accessory).length
  return { brand: b, image: cover.image, label: watches === items.length ? `${items.length} ${items.length === 1 ? 'relógio' : 'relógios'}` : `${items.length} artigos` }
})

function Brands() {
  return (
    <section id="marcas" className={`wrap ${section}`}>
      <SectionHeading title="Compre por marca" />
      <ul className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
        {BRAND_CARDS.map((c) => (
          <li key={c.brand}>
            <Link to={shopUrl({ brands: [c.brand] })} className="group flex flex-col gap-3.5">
              <div className="relative aspect-square overflow-hidden bg-stone">
                <Photo
                  name={c.image}
                  sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif text-title leading-[1.15] font-medium underline-offset-4 group-hover:underline">
                  {c.brand}
                </span>
                <span className="flex items-center gap-2 text-caption font-semibold text-muted group-hover:text-gold">
                  Ver {c.label}
                  <ArrowIcon size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <Newest />
      <Spotlight />
      <Collections />
      <Brands />
    </>
  )
}
