"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { TypeAnimation } from 'react-type-animation'
import Image from 'next/image'
import { GetStartedPopup } from './GetStartedPopup'

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleGetStarted = () => {
    setIsPopupOpen(true)
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-purple-700 via-blue-800 to-teal-500 ${
          isLoaded ? 'animate-gradient-x' : ''
        }`}
        style={{
          backgroundSize: '400% 400%',
          transition: 'opacity 1s ease-in-out',
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative z-10 text-center px-4 md:px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in-up">
          <TypeAnimation
            sequence={[
              'Welcome to WebStudioMS',
              1000,
              'Your digital partner',
              1000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-8 animate-fade-in-up animation-delay-200">
          Your one-stop solution for social marketing, SEO, web design, and development.
        </p>
        <div className="space-x-4 animate-fade-in-up animation-delay-400 mb-12">
          <Button onClick={handleGetStarted} variant="default" size="lg" className="bg-white text-purple-800 hover:bg-gray-200">
            Get Started
          </Button>
          <Button asChild variant="default" size="lg" className="bg-white text-purple-800 hover:bg-gray-200">
            <Link href="#services">Learn More</Link>
          </Button>
        </div>
        <div className="flex justify-center animate-fade-in-up animation-delay-600">
          <Image
            src="/img/mockup.png"
            alt="WebStudioMS Hero Image"
            width={800}
            height={600}
            className="w-full max-w-4xl h-auto"
            priority
          />
        </div>
      </div>
      {isPopupOpen && <GetStartedPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />}
    </section>
  )
}

export default Hero