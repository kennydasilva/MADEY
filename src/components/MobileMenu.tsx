import { Link } from 'react-router-dom'
import { whatsappDisplay } from '../config'
import { useUi } from '../context/ui'
import { GENERAL_MESSAGE, whatsappUrl } from '../lib/format'
import { useNavItems } from '../lib/nav'
import { ArrowIcon, CloseIcon, WhatsAppIcon } from './Icons'

export function MobileMenu() {
  const { menuOpen, closeAll } = useUi()
  const nav = useNavItems()
  if (!menuOpen) return null

  return (
    <div role="dialog" aria-label="Menu" className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-white">
      <div className="flex h-16 flex-none items-center justify-between border-b border-line px-5">
        <span className="font-serif text-[22px] font-medium tracking-[0.36em]">MADEY</span>
        <button onClick={closeAll} aria-label="Fechar menu" className="-mr-2.5 flex size-11 items-center justify-center">
          <CloseIcon size={22} />
        </button>
      </div>
      <nav className="flex flex-col px-5 py-2">
        {nav.map((n) => (
          <Link
            key={n.label}
            to={n.to}
            onClick={(e) => {
              closeAll()
              n.onClick?.(e)
            }}
            className="flex min-h-[60px] items-center justify-between border-b border-line font-serif text-[28px] font-medium"
          >
            {n.label}
            <ArrowIcon size={18} className="text-faint" />
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-5 pt-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <a
          href={whatsappUrl(GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa h-14 w-full tracking-[0.14em]"
        >
          <WhatsAppIcon />
          WhatsApp · {whatsappDisplay}
        </a>
      </div>
    </div>
  )
}
