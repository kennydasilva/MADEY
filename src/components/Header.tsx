import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUi } from '../context/ui'
import { useNavItems } from '../lib/nav'
import { MenuIcon, SearchIcon } from './Icons'
import { Logo } from './Logo'

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
      {/* Logótipo à esquerda (primeira coisa do cabeçalho), menu ao centro, pesquisa à direita. */}
      <div
        className={`wrap grid grid-cols-[1fr_auto] items-center gap-4 transition-[height] duration-200 lg:grid-cols-[1fr_auto_1fr] ${scrolled ? 'h-[60px]' : 'h-16 lg:h-[88px]'}`}
      >
        <Link to="/" aria-label="MADEY, página inicial" className="flex items-center gap-3 justify-self-start text-brand">
          <Logo variant="mark" className={`transition-[height] duration-200 ${scrolled ? 'h-8' : 'h-9 lg:h-12'}`} />
          <Logo
            variant="word"
            className={`transition-[height] duration-200 ${scrolled ? 'h-4 lg:h-[18px]' : 'h-4 lg:h-[22px]'}`}
          />
        </Link>

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

        <div className="flex items-center justify-end gap-0.5">
          <button
            onClick={openSearch}
            aria-label="Pesquisar"
            className="flex size-11 items-center justify-center hover:bg-mist"
          >
            <SearchIcon />
          </button>
          <button
            onClick={openMenu}
            aria-label="Abrir menu"
            className="-mr-3 flex size-11 items-center justify-center lg:hidden"
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}
