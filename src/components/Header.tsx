import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrder } from '../context/order'
import { useUi } from '../context/ui'
import { GENERAL_MESSAGE, formatPrice, itemsLabel, whatsappUrl } from '../lib/format'
import { useOrderView } from '../lib/orderView'
import { useNavItems } from '../lib/nav'
import { BagIcon, MenuIcon, SearchIcon, WhatsAppIcon } from './Icons'

export function AnnouncementBar() {
  return (
    <div className="on-dark bg-navy px-4 py-2.5 text-center text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
      Novidades G-Shock e Seiko já disponíveis<span className="hidden sm:inline"> · Encomende pelo WhatsApp</span>
    </div>
  )
}

export function Header() {
  const { openMenu, openSearch } = useUi()
  const { count, total } = useOrder()
  const { docked, toggle } = useOrderView()
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
              aria-current={n.active ? 'page' : undefined}
              className={`border-b py-1.5 text-xs font-semibold tracking-[0.14em] uppercase hover:border-navy ${n.active ? 'border-navy' : 'border-transparent'}`}
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
            aria-label="Falar no WhatsApp"
            className="flex size-11 items-center justify-center gap-2 hover:bg-mist xl:w-auto xl:px-3"
          >
            <WhatsAppIcon size={21} className="text-wa" />
            <span className="hidden text-caption font-semibold xl:inline">WhatsApp</span>
          </a>
          <button
            key={count}
            onClick={toggle}
            aria-label={count ? `Ver pedido, ${itemsLabel(count)}` : 'Ver pedido'}
            aria-expanded={docked || undefined}
            className={`relative -mr-2.5 flex size-11 items-center justify-center gap-2.5 lg:mr-0 lg:ml-2 lg:w-auto lg:px-4 ${count ? 'bump lg:bg-navy lg:text-white lg:hover:bg-navy-soft' : 'hover:bg-mist lg:border lg:border-line'}`}
          >
            <BagIcon size={21} className="flex-none" />
            {/* Com a coluna do pedido aberta o total já está à vista: o botão fica curto. */}
            <span className="hidden text-caption font-semibold whitespace-nowrap tabular-nums lg:inline">
              {count ? `Pedido · ${count}${docked ? '' : ` · ${formatPrice(total)}`}` : 'Pedido'}
            </span>
            {count > 0 && (
              <span className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-navy px-1 text-label leading-none font-bold text-white tabular-nums lg:hidden">
                {count}
              </span>
            )}
          </button>
          {/* Uma só frase completa para leitores de ecrã sempre que o pedido muda. */}
          <span role="status" aria-atomic="true" className="sr-only">
            {count ? `${itemsLabel(count)} no pedido` : ''}
          </span>
        </div>
      </div>
    </header>
  )
}
