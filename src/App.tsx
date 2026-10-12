import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { UiProvider } from './context/ui'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <UiProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </UiProvider>
    </BrowserRouter>
  )
}
