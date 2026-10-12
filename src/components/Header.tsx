import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUi } from '../context/ui'
import { GENERAL_MESSAGE, whatsappUrl } from '../lib/format'
import { useNavItems } from '../lib/nav'
import { MenuIcon, SearchIcon, WhatsAppIcon } from './Icons'

export function AnnouncementBar() {
  return (
    <div className="bg-navy px-4 py-2.5 text-center text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
      Novidades G-Shock e Seiko já disponíveis · Encomende pelo WhatsApp
    </div>
  )
}

export function Header() {
  const { openMenu, openSearch } = useUi()
  const nav = useNavItems()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-white transition-shadow ${scrolled ? 'shadow-[0_6px_24px_rgba(20,31,51,0.06)]' : ''}`}
    >
      <div
        className={`wrap grid grid-cols-[1fr_auto] items-center gap-4 transition-[height] duration-200 lg:grid-cols-[1fr_auto_1fr] ${scrolled ? 'h-[60px]' : 'h-16 lg:h-20'}`}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={openMenu}
            aria-label="Abrir menu"
            className="-ml-3 flex size-11 items-center justify-center lg:hidden"
          >
            <MenuIcon size={22} />
          </button>
          <Link
            to="/"
            className={`font-serif leading-none font-medium tracking-[0.36em] text-[22px] transition-[font-size] duration-200 ${scrolled ? '' : 'lg:text-[26px]'}`}
          >
            MADEY
          </Link>
        </div>

        <nav className="hidden justify-center gap-[clamp(18px,2.2vw,32px)] lg:flex">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              onClick={n.onClick}
              className={`border-b py-1.5 text-xs font-medium tracking-[0.14em] uppercase hover:border-navy ${n.active ? 'border-navy' : 'border-transparent'}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-0.5">
          <button
            onClick={openSearch}
            aria-label="Pesquisar"
            className="flex size-11 items-center justify-center hover:bg-mist"
          >
            <SearchIcon />
          </button>
          <a
            href={whatsappUrl(GENERAL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="-mr-2.5 flex size-11 items-center justify-center text-wa hover:bg-mist"
          >
            <WhatsAppIcon size={21} />
          </a>
        </div>
      </div>
    </header>
  )
}
