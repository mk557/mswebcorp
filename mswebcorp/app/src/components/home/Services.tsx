import React from 'react';
import { Share2Icon, SearchIcon, PenToolIcon, CodeIcon, CheckIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Services: React.FC = () => {
  return (
    <section id="services" className="w-full py-16 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-16 text-black">Our Services</h2>
        <Tabs defaultValue="social" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="social" className="flex flex-col items-center py-4 bg-white text-black data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Share2Icon className="h-6 w-6 mb-2" />
              Social Marketing
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex flex-col items-center py-4 bg-white text-black data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <SearchIcon className="h-6 w-6 mb-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="design" className="flex flex-col items-center py-4 bg-white text-black data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <PenToolIcon className="h-6 w-6 mb-2" />
              Web Design
            </TabsTrigger>
            <TabsTrigger value="dev" className="flex flex-col items-center py-4 bg-white text-black data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <CodeIcon className="h-6 w-6 mb-2" />
              Development
            </TabsTrigger>
          </TabsList>
          <div className="mt-12">
            <TabsContent value="social" className="focus:outline-none">
              <ServiceCard
                icon={<Share2Icon className="h-16 w-16" />}
                title="Social Marketing"
                description="We help you build and engage your audience across all major social platforms. Our strategies are tailored to increase your brand visibility, drive engagement, and convert followers into loyal customers."
                features={[
                  "Content strategy development",
                  "Social media management",
                  "Influencer partnerships"
                ]}
              />
            </TabsContent>
            <TabsContent value="seo">
              <ServiceCard
                icon={<SearchIcon className="h-12 w-12" />}
                title="SEO Optimization"
                description="Our SEO strategies ensure your website ranks high in search engine results. We use data-driven techniques to improve your online visibility and drive organic traffic to your site."
                features={[
                  "Keyword research and optimization",
                  "On-page and off-page SEO",
                  "Link building and content strategy"
                ]}
              />
            </TabsContent>
            <TabsContent value="design">
              <ServiceCard
                icon={<PenToolIcon className="h-12 w-12" />}
                title="Web Design"
                description="We create stunning, responsive designs that captivate your audience. Our team focuses on user experience and visual appeal to ensure your website stands out from the competition."
                features={[
                  "Custom website design",
                  "Responsive and mobile-first approach",
                  "UI/UX optimization"
                ]}
              />
            </TabsContent>
            <TabsContent value="dev">
              <ServiceCard
                icon={<CodeIcon className="h-12 w-12" />}
                title="Web Development"
                description="Our expert developers bring your vision to life with cutting-edge technologies. We build scalable, secure, and high-performance websites and web applications tailored to your needs."
                features={[
                  "Full-stack web development",
                  "E-commerce solutions",
                  "Content Management Systems (CMS)"
                ]}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  )
}

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features }) => {
  return (
    <div className="mx-auto max-w-4xl bg-white border-2 border-gray-300 rounded-lg p-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="flex-shrink-0 w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center mx-auto md:mx-0">
          {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'h-16 w-16 text-white' }) : icon}
        </div>
        <div className="flex-grow space-y-6 text-center md:text-left">
          <h3 className="text-3xl font-bold text-black">{title}</h3>
          <p className="text-xl text-black">{description}</p>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 justify-center md:justify-start text-lg text-black">
                <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Services