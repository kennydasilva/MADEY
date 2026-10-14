import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { config, whatsappDisplay } from '../config'
import { shopUrl } from '../lib/shop'
import { Logo } from './Logo'

const link = 'self-start py-2 text-white underline-offset-4 hover:underline lg:py-1'

const SHOP_LINKS = [
  { label: 'Todos os relógios', to: shopUrl() },
  { label: 'Novidades', to: shopUrl({ sort: 'novidades' }) },
  { label: 'Acessórios', to: shopUrl({ cats: ['acessorios'] }) },
  { label: 'Entregas e pagamentos', to: '/entregas-e-pagamentos' },
]

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="mb-2 font-serif text-[1.375rem] leading-none font-medium text-gold-light">{title}</h2>
      {children}
    </div>
  )
}

/** Rodapé curto: a marca à esquerda, dois grupos de links à direita e a nota legal por baixo. */
export function Footer() {
  return (
    <footer id="contacto" className="on-dark bg-navy text-sm text-white">
      <div className="wrap">
        <div className="grid gap-12 py-[clamp(56px,7vw,96px)] md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="flex flex-col items-start gap-5">
            <Logo variant="full" className="h-24 text-gold-light lg:h-28" />
            <p className="max-w-[32ch] leading-[1.7] text-line">Relógios e acessórios selecionados, com preços em meticais.</p>
          </div>

          <div className="grid grid-cols-2 gap-x-[clamp(40px,6vw,96px)] gap-y-10">
            <Group title="Loja">
              {SHOP_LINKS.map((l) => (
                <Link key={l.label} to={l.to} className={link}>
                  {l.label}
                </Link>
              ))}
            </Group>
            <Group title="Contacto">
              <a href={`tel:+${config.whatsappNumber}`} className={`${link} tabular-nums`}>
                {whatsappDisplay}
              </a>
              {config.instagramUrl && (
                <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  Instagram
                </a>
              )}
              <span className="py-2 text-line lg:py-1">{config.location}</span>
            </Group>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/15 py-6 text-xs leading-[1.6] text-line md:flex-row md:justify-between md:gap-8">
          <span className="flex-none">© 2026 MADEY</span>
          <span className="max-w-[80ch] md:text-right">
            Loja independente, não é distribuidora oficial das marcas apresentadas. Preços e disponibilidade sujeitos a
            confirmação.
          </span>
        </div>
      </div>
    </footer>
  )
}
