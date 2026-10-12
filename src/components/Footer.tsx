import { Link } from 'react-router-dom'
import { config, whatsappDisplay } from '../config'
import { BRANDS, CATEGORIES } from '../data/products'
import { GENERAL_MESSAGE, whatsappUrl } from '../lib/format'
import { shopUrl } from '../lib/shop'
import { WhatsAppIcon } from './Icons'

const linkClass = 'self-start py-[5px] text-sm text-white underline-offset-[3px] hover:underline'

export function Footer() {
  const columns = [
    { title: 'Categorias', links: CATEGORIES.map((c) => ({ label: c.label, to: shopUrl({ cats: [c.id] }) })) },
    { title: 'Marcas', links: BRANDS.map((b) => ({ label: b, to: shopUrl({ brands: [b] }) })) },
    {
      title: 'Loja',
      links: [
        { label: 'Início', to: '/' },
        { label: 'Ver todos', to: shopUrl() },
        { label: 'Novidades', to: shopUrl({ sort: 'novidades' }) },
      ],
    },
  ]

  return (
    <footer id="contacto" className="bg-navy text-white">
      <div className="wrap pt-[clamp(56px,7vw,88px)]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-11 pb-14 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className="col-span-2 flex flex-col items-start gap-5 lg:col-span-1">
            <span className="font-serif text-[28px] leading-none font-medium tracking-[0.36em]">MADEY</span>
            <p className="max-w-[40ch] text-sm leading-[1.7] text-line">
              Relógios e acessórios selecionados de marcas como Casio, G-Shock, Hugo Boss, Seiko e Tissot. Escolha
              online, encomende pelo WhatsApp.
            </p>
            <a
              href={whatsappUrl(GENERAL_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa h-12 px-[22px] tracking-[0.12em]"
            >
              <WhatsAppIcon size={18} />
              {whatsappDisplay}
            </a>
            <span className="text-[13px] text-line">{config.location}</span>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-0.5">
              <span className="eyebrow mb-3 text-line">{col.title}</span>
              {col.links.map((l) => (
                <Link key={l.label} to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              ))}
              {col.title === 'Loja' && (
                <>
                  {config.instagramUrl && (
                    <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Instagram
                    </a>
                  )}
                  <span className="py-[5px] text-sm text-faint">Entregas e devoluções: a definir</span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-navy-soft pt-[22px] pb-7 text-xs text-line">
          © 2026 MADEY. Preços e disponibilidade sujeitos a confirmação. Marcas mencionadas pertencem aos respetivos
          proprietários.
        </div>
      </div>
    </footer>
  )
}
