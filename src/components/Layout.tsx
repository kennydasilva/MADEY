import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { AnnouncementBar, Header } from './Header'
import { MobileMenu } from './MobileMenu'
import { QuickView, SearchOverlay, Toast, WhatsAppModal } from './Overlays'

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
  return (
    <div className="min-h-screen">
      <a href="#conteudo" className="skip-link">
        Saltar para o conteúdo
      </a>
      <AnnouncementBar />
      <Header />
      <main id="conteudo" tabIndex={-1} className="focus-visible:outline-none">
        <Outlet />
      </main>
      <Footer />
      <MobileMenu />
      <QuickView />
      <SearchOverlay />
      <WhatsAppModal />
      <Toast />
    </div>
  )
}
