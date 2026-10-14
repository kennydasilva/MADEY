import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileMenu } from './MobileMenu'
import { useOrderView } from '../lib/orderView'
import { OrderBar, OrderDock, OrderPanel } from './OrderPanel'
import { SearchOverlay, Toast, WhatsAppModal } from './Overlays'

/** Ao mudar de página volta ao topo; com #âncora desliza até à secção. */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    // Quem navega por teclado ou leitor de ecrã recomeça no conteúdo da nova página, não no menu.
    if (first.current) first.current = false
    else if (!hash) document.getElementById('conteudo')?.focus({ preventScroll: true })

    if (hash) {
      // Espera um frame para a secção existir depois da navegação.
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
}

export function Layout() {
  useScrollOnNavigate()
  const { docked } = useOrderView()
  return (
    // Com o pedido fixo ao lado, a página inteira cede-lhe a largura em vez de ficar tapada.
    <div className={`min-h-screen ${docked ? 'pr-[360px]' : ''}`}>
      <a href="#conteudo" className="skip-link">
        Saltar para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="focus-visible:outline-none">
        <Outlet />
      </main>
      <Footer />
      <OrderBar />
      {docked && <OrderDock />}
      <MobileMenu />
      <OrderPanel />
      <SearchOverlay />
      <WhatsAppModal />
      <Toast />
    </div>
  )
}
