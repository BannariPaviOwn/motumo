import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { DevOrdersButton } from './components/DevOrdersButton'
import { ScrollToTop } from './components/ScrollToTop'
import { TemplateSwitcher } from './components/TemplateSwitcher'
import { TestOrdersPanel } from './components/TestOrdersPanel'
import { TigerCheerOverlay } from './components/TigerCheerOverlay'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import { Template1 } from './templates/Template1'
import { Template2 } from './templates/Template2'
import { Template3 } from './templates/Template3'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrdersProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Template1 />} />
            <Route path="/template2" element={<Template2 />} />
            <Route path="/template3" element={<Template3 />} />
          </Routes>
          <CartDrawer />
          <CheckoutModal />
          <TestOrdersPanel />
          <DevOrdersButton />
          <TigerCheerOverlay />
          <TemplateSwitcher />
        </OrdersProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
