import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { UiProvider } from './context/ui'

export default function App() {
  return (
    <BrowserRouter>
      <UiProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div className="wrap py-24 font-serif text-4xl">Em construção</div>} />
          </Route>
        </Routes>
      </UiProvider>
    </BrowserRouter>
  )
}
