"use client"

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to a server
    setFormSubmitted(true)
  }

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-black">Contact Us</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="space-y-4">
            <Input 
              type="text" 
              placeholder="Your Name" 
              required 
              className="border border-gray-300 bg-white text-black placeholder-gray-400"
            />
            <Input 
              type="email" 
              placeholder="Your Email" 
              required 
              className="border border-gray-300 bg-white text-black placeholder-gray-400"
            />
            <Textarea 
              placeholder="Your Message" 
              required 
              className="border border-gray-300 bg-white text-black placeholder-gray-400"
            />
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
        {formSubmitted && (
          <p className="text-center mt-4 text-green-600">Thank you for your message. We'll be in touch soon!</p>
        )}
      </div>
    </section>
  )
}

export default Contact