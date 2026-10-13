import { Analytics } from '@vercel/analytics/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { OrderProvider } from './context/order'
import { UiProvider } from './context/ui'
import Delivery from './pages/Delivery'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProductPage from './pages/Product'
import Shop from './pages/Shop'

export default function App() {
  return (
    <BrowserRouter>
      <UiProvider>
        <OrderProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="loja" element={<Shop />} />
              <Route path="produto/:slug" element={<ProductPage />} />
              <Route path="entregas-e-pagamentos" element={<Delivery />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </OrderProvider>
      </UiProvider>
      <Analytics />
    </BrowserRouter>
  )
}
