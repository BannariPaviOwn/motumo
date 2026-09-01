import { About } from './components/About'
import { Benefits } from './components/Benefits'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Products } from './components/Products'
import { TigerCheerOverlay } from './components/TigerCheerOverlay'
import { WaysToEnjoy } from './components/WaysToEnjoy'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-svh">
        <main>
          <Hero />
          <Benefits />
          <Products />
          <WaysToEnjoy />
          <About />
        </main>
        <Footer />
        <CartDrawer />
        <TigerCheerOverlay />
      </div>
    </CartProvider>
  )
}
