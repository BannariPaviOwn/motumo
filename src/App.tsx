import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartDrawer } from './components/CartDrawer'
import { ScrollToTop } from './components/ScrollToTop'
import { TemplateSwitcher } from './components/TemplateSwitcher'
import { TigerCheerOverlay } from './components/TigerCheerOverlay'
import { CartProvider } from './context/CartContext'
import { Template1 } from './templates/Template1'
import { Template2 } from './templates/Template2'
import { Template3 } from './templates/Template3'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Template1 />} />
          <Route path="/template2" element={<Template2 />} />
          <Route path="/template3" element={<Template3 />} />
        </Routes>
        <CartDrawer />
        <TigerCheerOverlay />
        <TemplateSwitcher />
      </CartProvider>
    </BrowserRouter>
  )
}
