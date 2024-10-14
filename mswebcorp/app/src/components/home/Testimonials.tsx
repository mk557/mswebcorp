import { StarIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const testimonials = [
  {
    name: "John Doe",
    role: "CEO",
    company: "Tech Innovators",
    image: "/placeholder.svg?height=40&width=40",
    text: "mswebcorp transformed our online presence. Their expertise in social marketing and SEO has significantly boosted our visibility and engagement.",
  },
  {
    name: "Jane Smith",
    role: "Creative Director",
    company: "Design Fusion",
    image: "/placeholder.svg?height=40&width=40",
    text: "The web design team at mswebcorp is simply outstanding. They created a stunning website that perfectly captures our brand essence.",
  },
  {
    name: "Mike Johnson",
    role: "Marketing Manager",
    company: "Global Solutions",
    image: "/placeholder.svg?height=40&width=40",
    text: "The SEO results speak for themselves. Our organic traffic has doubled, and our conversion rates have never been better. Highly recommended!",
  },
]

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-black">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardContent className="flex flex-col h-full p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-black text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-black">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700">{testimonial.text}</p>
                </div>
                <div className="mt-4">
                  <Badge className="text-xs font-normal text-black bg-gray-200 px-2 py-1 rounded-full">
                    {testimonial.company}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials