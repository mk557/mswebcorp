import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { GetStartedPopup } from "@/components/GetStartedPopup"

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <main>
      {/* ... other components ... */}
      
      <section className="hero">
        <h1>Welcome to mswebcorp</h1>
        <p>Your one-stop solution for web development</p>
        <Button onClick={() => setIsPopupOpen(true)}>Get Started</Button>
      </section>

      <GetStartedPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* ... other components ... */}
    </main>
  )
}
