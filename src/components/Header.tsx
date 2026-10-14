import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrder } from '../context/order'
import { useUi } from '../context/ui'
import { formatPrice, itemsLabel } from '../lib/format'
import { useOrderView } from '../lib/orderView'
import { useNavItems } from '../lib/nav'
import { BagIcon, MenuIcon, SearchIcon } from './Icons'
import { Logo } from './Logo'

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
      {/* Menu à esquerda, logótipo ao centro, pesquisa e pedido à direita. */}
      <div
        className={`wrap grid grid-cols-[1fr_auto_1fr] items-center gap-4 transition-[height] duration-200 ${scrolled ? 'h-[60px]' : 'h-16 lg:h-[88px]'}`}
      >
        <div className="flex items-center">
          <button
            onClick={openMenu}
            aria-label="Abrir menu"
            className="-ml-3 flex size-11 items-center justify-center lg:hidden"
          >
            <MenuIcon size={22} />
          </button>
          <nav className="hidden gap-[clamp(18px,2.2vw,32px)] lg:flex">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={n.onClick}
                aria-current={n.active ? 'page' : undefined}
                className={`border-b py-1.5 text-xs font-semibold tracking-[0.14em] uppercase hover:border-gold ${n.active ? 'border-gold' : 'border-transparent'}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link to="/" aria-label="MADEY, página inicial" className="flex items-center gap-3 text-gold">
          <Logo variant="mark" className={`transition-[height] duration-200 ${scrolled ? 'h-8' : 'h-9 lg:h-12'}`} />
          <Logo
            variant="word"
            className={`hidden transition-[height] duration-200 sm:block ${scrolled ? 'h-[18px]' : 'h-[18px] lg:h-[22px]'}`}
          />
        </Link>

        <div className="flex items-center justify-end gap-0.5">
          <button
            onClick={openSearch}
            aria-label="Pesquisar"
            className="flex size-11 items-center justify-center hover:bg-mist"
          >
            <SearchIcon />
          </button>
          <button
            key={count}
            onClick={toggle}
            aria-label={count ? `Ver pedido, ${itemsLabel(count)}` : 'Ver pedido'}
            aria-expanded={docked || undefined}
            className={`relative -mr-2.5 flex size-11 items-center justify-center gap-2.5 lg:mr-0 lg:ml-2 lg:w-auto lg:px-4 ${count ? 'bump lg:bg-gold lg:text-white lg:hover:bg-gold-dark' : 'hover:bg-mist lg:border lg:border-line'}`}
          >
            <BagIcon size={21} className="flex-none" />
            {/* Com a coluna do pedido aberta o total já está à vista: o botão fica curto. */}
            <span className="hidden text-caption font-semibold whitespace-nowrap tabular-nums lg:inline">
              {count ? `Pedido · ${count}${docked ? '' : ` · ${formatPrice(total)}`}` : 'Pedido'}
            </span>
            {count > 0 && (
              <span className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-label leading-none font-bold text-white tabular-nums lg:hidden">
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
