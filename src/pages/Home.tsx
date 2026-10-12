import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon, ChatIcon, LayersIcon, SearchIcon, TagIcon } from '../components/Icons'
import { ProductGrid } from '../components/ProductCard'
import { BRANDS, PRODUCTS, type CategoryId } from '../data/products'
import { countLabel } from '../lib/format'
import { img } from '../lib/images'
import { scrollToId } from '../lib/nav'
import { shopUrl, sortProducts } from '../lib/shop'
import { usePageTitle } from '../lib/title'

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-[clamp(28px,4vw,48px)] flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-3">
        <span className="eyebrow text-muted">{eyebrow}</span>
        <h2 className="display text-[clamp(34px,4vw,52px)] text-balance">{title}</h2>
      </div>
      {action}
    </div>
  )
}

function Hero() {
  return (
    <section className="relative bg-navy text-white">
      <img
        src={img('hero')}
        alt="Relógio cronógrafo em aço com mostrador azul"
        className="h-[340px] w-full object-cover object-[78%_center] sm:h-[460px] lg:absolute lg:inset-0 lg:h-full"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-3/5 bg-linear-to-r from-navy-deep/80 to-transparent lg:block" />
      <div className="wrap relative flex items-center py-[clamp(40px,6vw,96px)] lg:min-h-[clamp(560px,78vh,760px)]">
        <div className="flex max-w-[560px] flex-col gap-6">
          <span className="text-[11px] font-semibold tracking-[0.24em] text-line uppercase">Coleção 2026</span>
          <h1 className="display text-[clamp(48px,5.6vw,84px)] leading-[1.02] tracking-[-0.01em] text-balance">
            Time, Defined by You.
          </h1>
          <p className="max-w-[36ch] text-[17px] leading-[1.6] text-line">
            Descubra relógios que unem precisão, carácter e design intemporal.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link to={shopUrl()} className="btn btn-light">
              Explorar coleção
            </Link>
            <button onClick={() => scrollToId('marcas')} className="btn border-line text-white hover:bg-navy-soft">
              Descobrir marcas
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const COLLECTIONS: { cat: CategoryId; title: string; image: string; dark?: boolean; place: string }[] = [
  { cat: 'homem', title: 'Homem', image: 'p-boss', place: 'col-span-2 lg:col-span-1 lg:row-span-2' },
  { cat: 'senhora', title: 'Senhora', image: 'c-women', dark: true, place: '' },
  { cat: 'desporto', title: 'Desporto & Digital', image: 'p-gshock', place: '' },
  { cat: 'classico', title: 'Clássico & Elegante', image: 'p-prx', place: '' },
  { cat: 'acessorios', title: 'Acessórios', image: 'p-case', place: '' },
]

function Collections() {
  return (
    <section className="wrap pt-[clamp(64px,8vw,112px)]">
      <SectionHeading eyebrow="Coleções" title="Encontre o seu estilo" />
      <div className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[260px] lg:auto-rows-[clamp(220px,22vw,280px)] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.cat}
            to={shopUrl({ cats: [c.cat] })}
            className={`group relative min-w-0 overflow-hidden bg-stone ${c.dark ? 'text-white hover:text-white' : ''} ${c.place}`}
          >
            <img
              src={img(c.image)}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t to-transparent ${c.dark ? 'from-navy/70' : 'from-white/90'}`}
            />
            <div className="absolute inset-x-[clamp(16px,2vw,24px)] bottom-[clamp(14px,2vw,22px)] flex items-end justify-between gap-3">
              <span className="display text-[clamp(22px,2.4vw,32px)]">{c.title}</span>
              <ArrowIcon className="mb-1 flex-none transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Featured() {
  return (
    <section className="wrap py-[clamp(64px,8vw,112px)]">
      <SectionHeading
        eyebrow="Em destaque"
        title="Seleção MADEY"
        action={
          <Link
            to={shopUrl()}
            className="flex items-center gap-2.5 border-b border-navy py-2 text-[11px] font-bold tracking-[0.2em] uppercase"
          >
            Ver todos <ArrowIcon size={14} strokeWidth={2} />
          </Link>
        }
      />
      <ProductGrid products={sortProducts(PRODUCTS, 'destaques')} />
    </section>
  )
}

function Brands() {
  return (
    <section id="marcas" className="border-t border-line bg-mist">
      <div className="wrap flex flex-col items-center gap-8 py-[clamp(56px,7vw,96px)]">
        <span className="eyebrow text-muted">Marcas disponíveis</span>
        <div className="grid w-full grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-6">
          {BRANDS.map((b) => (
            <Link
              key={b}
              to={shopUrl({ brands: [b] })}
              className="flex h-[clamp(88px,9vw,112px)] flex-col items-center justify-center gap-0.5 border-r border-b border-line bg-white px-3 text-center transition-colors hover:bg-navy hover:text-white"
            >
              <span className="display text-[clamp(22px,2vw,28px)] leading-[1.1]">{b}</span>
              <span className="text-[11px] tracking-[0.08em] opacity-70">
                {countLabel(PRODUCTS.filter((p) => p.brand === b).length)}
              </span>
            </Link>
          ))}
        </div>
        <p className="max-w-[60ch] text-center text-xs text-muted">
          A MADEY é uma loja independente e não é distribuidora oficial das marcas apresentadas.
        </p>
      </div>
    </section>
  )
}

function Promo() {
  return (
    <section className="grid bg-navy text-white lg:grid-cols-2">
      <div className="relative min-h-[clamp(320px,40vw,520px)] bg-navy-deep">
        <img
          src={img('promo')}
          alt="Relógio desportivo no pulso, com a cidade à noite em fundo"
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="flex items-center px-[clamp(20px,5vw,96px)] py-[clamp(40px,6vw,96px)]">
        <div className="flex max-w-[480px] flex-col gap-[22px]">
          <span className="eyebrow text-line">Desporto &amp; Digital</span>
          <h2 className="display text-[clamp(36px,4vw,56px)] leading-[1.08] text-balance">
            Feito para a cidade. Pronto para tudo.
          </h2>
          <p className="text-base leading-[1.65] text-line">
            Resistência, leitura rápida e um design que acompanha cada movimento. Conheça a nossa seleção G-Shock e
            Casio.
          </p>
          <div className="mt-2 flex">
            <Link to={shopUrl({ cats: ['desporto'] })} className="btn btn-light">
              Ver coleção desporto
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const REASONS = [
  {
    icon: ChatIcon,
    title: 'Atendimento personalizado',
    text: 'Fale diretamente connosco pelo WhatsApp e tire todas as dúvidas sobre tamanho, bracelete e disponibilidade.',
  },
  {
    icon: SearchIcon,
    title: 'Pedidos fáceis',
    text: 'Um clique envia-nos o produto, a referência e o preço. Sem formulários, sem contas.',
  },
  {
    icon: LayersIcon,
    title: 'Coleções selecionadas',
    text: 'Uma curadoria de modelos com estilo e carácter, do desportivo ao clássico.',
  },
  {
    icon: TagIcon,
    title: 'Preços claros',
    text: 'Preço em meticais e informação do produto sempre visíveis, antes de nos contactar.',
  },
]

function Why() {
  return (
    <section className="wrap py-[clamp(64px,8vw,112px)]">
      <SectionHeading eyebrow="Porquê a MADEY" title="Uma forma simples de escolher o seu relógio" />
      <div className="grid gap-x-[clamp(24px,3vw,40px)] gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((r) => (
          <div key={r.title} className="flex flex-col gap-3 border-t border-line pt-7">
            <r.icon size={22} strokeWidth={1.5} />
            <h3 className="display text-[26px] leading-[1.15]">{r.title}</h3>
            <p className="text-sm leading-[1.65] text-muted">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <Collections />
      <Featured />
      <Brands />
      <Promo />
      <Why />
    </>
  )
}
