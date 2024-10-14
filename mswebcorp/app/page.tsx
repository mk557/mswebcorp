import Layout from '@/components/layout/Layout'
import Hero from '@/components/home/Hero'
import Services from '@/components/home/Services'
import Portfolio from '@/components/home/Portfolio'
import Testimonials from '@/components/home/Testimonials'
import Contact from '@/components/home/Contact'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
    </Layout>
  )
}