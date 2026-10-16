import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { config, whatsappDisplay } from '../config'
import { GENERAL_MESSAGE, whatsappUrl } from '../lib/format'
import { shopUrl } from '../lib/shop'
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from './Icons'
import { Logo } from './Logo'

const link = 'self-start py-2 text-white underline-offset-4 hover:underline lg:py-1'

const SHOP_LINKS = [
  { label: 'Todos os relógios', to: shopUrl() },
  { label: 'Novidades', to: shopUrl({ sort: 'novidades' }) },
  { label: 'Acessórios', to: shopUrl({ cats: ['acessorios'] }) },
  { label: 'Entregas e pagamentos', to: '/entregas-e-pagamentos' },
]

const SOCIAL = [
  { label: 'Instagram', href: config.instagramUrl, Icon: InstagramIcon },
  { label: 'TikTok', href: config.tiktokUrl, Icon: TikTokIcon },
  { label: 'WhatsApp', href: whatsappUrl(GENERAL_MESSAGE), Icon: WhatsAppIcon },
].filter((s) => s.href)

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="mb-3 font-serif text-[1.375rem] leading-none font-medium text-gold-light">{title}</h2>
      {children}
    </div>
  )
}

/** Rodapé em três colunas (marca com as redes, loja, contacto) e a nota legal por baixo. */
export function Footer() {
  return (
    <footer id="contacto" className="on-dark bg-navy text-sm text-white">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-[clamp(56px,7vw,88px)] lg:grid-cols-3">
          <div className="col-span-2 flex flex-col items-start gap-7 lg:col-span-1">
            <Logo variant="full" className="h-24 text-gold-light" />
            <ul className="flex gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full border border-gold-light/60 text-gold-light transition-colors hover:border-gold-light hover:bg-gold-light hover:text-navy"
                  >
                    <Icon size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
            <span className="py-2 text-line lg:py-1">{config.location}</span>
          </Group>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/15 py-6 text-xs leading-[1.6] text-line md:flex-row md:items-center md:justify-between md:gap-8">
          <span>© 2026 MADEY</span>
          <span>Loja independente, não é distribuidora oficial das marcas. Preços sujeitos a confirmação.</span>
        </div>
      </div>
    </footer>
  )
}
