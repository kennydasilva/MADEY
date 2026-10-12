import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { AnnouncementBar, Header } from './Header'
import { MobileMenu } from './MobileMenu'
import { QuickView, SearchOverlay, Toast, WhatsAppModal } from './Overlays'

/** Ao mudar de página volta ao topo; com #âncora desliza até à secção. */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
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
      <AnnouncementBar />
      <Header />
      <main>
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
