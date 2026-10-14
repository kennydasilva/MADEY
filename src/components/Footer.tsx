import { Link } from 'react-router-dom'
import { config, whatsappDisplay } from '../config'
import { GENERAL_MESSAGE, whatsappUrl } from '../lib/format'
import { shopUrl } from '../lib/shop'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './Icons'
import { Logo } from './Logo'

const SHOP_LINKS = [
  { label: 'Todos os relógios', to: shopUrl() },
  { label: 'Novidades', to: shopUrl({ sort: 'novidades' }) },
  { label: 'Acessórios', to: shopUrl({ cats: ['acessorios'] }) },
  { label: 'Entregas e pagamentos', to: '/entregas-e-pagamentos' },
]

const SOCIAL = [
  { label: 'Instagram', href: config.instagramUrl, Icon: InstagramIcon },
  { label: 'Facebook', href: config.facebookUrl, Icon: FacebookIcon },
  { label: 'WhatsApp', href: whatsappUrl(GENERAL_MESSAGE), Icon: WhatsAppIcon },
].filter((s) => s.href)

/**
 * Rodapé centrado, como o próprio logótipo: marca, uma linha de links, as redes e a nota legal,
 * cada grupo separado por espaço em vez de colunas.
 */
export function Footer() {
  return (
    <footer id="contacto" className="on-dark bg-navy text-white">
      <div className="wrap flex flex-col items-center pt-[clamp(64px,8vw,112px)] text-center">
        <Logo variant="full" className="h-28 text-gold-light sm:h-32" />
        <p className="mt-6 max-w-[34ch] text-line">Relógios e acessórios selecionados, com preços em meticais.</p>

        <span aria-hidden="true" className="mt-10 h-px w-16 bg-gold-light/60" />

        <nav aria-label="Rodapé" className="mt-10 flex flex-wrap justify-center gap-x-[clamp(24px,3vw,44px)] gap-y-3">
          {SHOP_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="py-1.5 text-xs font-semibold tracking-[0.16em] uppercase underline-offset-[6px] hover:text-gold-light hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <ul className="mt-10 flex gap-4">
          {SOCIAL.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-12 items-center justify-center rounded-full border border-gold-light/50 text-gold-light transition-colors hover:border-gold-light hover:bg-gold-light hover:text-navy"
              >
                <Icon size={20} />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-line">
          <a href={`tel:+${config.whatsappNumber}`} className="text-white tabular-nums underline-offset-4 hover:underline">
            {whatsappDisplay}
          </a>
          <span aria-hidden="true" className="mx-3 text-gold-light/60">
            ·
          </span>
          {config.location}
        </p>

        <p className="mt-[clamp(56px,7vw,88px)] w-full border-t border-white/15 py-6 text-xs leading-[1.6] text-line">
          © 2026 MADEY · Loja independente, não é distribuidora oficial das marcas. Preços sujeitos a confirmação.
        </p>
      </div>
    </footer>
  )
}
