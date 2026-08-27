import { About } from './components/About'
import { Benefits } from './components/Benefits'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Products } from './components/Products'
import { WaysToEnjoy } from './components/WaysToEnjoy'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-svh">
        <Header />
        <main>
          <Hero />
          <Benefits />
          <Products />
          <WaysToEnjoy />
          <About />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
