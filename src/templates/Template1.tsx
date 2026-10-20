import { About } from '../components/About'
import { Benefits } from '../components/Benefits'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Products } from '../components/Products'
import { Reviews } from '../components/Reviews'
import { WaysToEnjoy } from '../components/WaysToEnjoy'

/** Template 1 — playful Open Secret–inspired shop */
export function Template1() {
  return (
    <div className="min-h-svh">
      <main>
        <Hero />
        <Products />
        <Benefits />
        <WaysToEnjoy />
        <Reviews />
        <About />
      </main>
      <Footer />
    </div>
  )
}
