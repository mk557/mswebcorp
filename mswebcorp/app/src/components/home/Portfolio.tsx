import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'

const Portfolio: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: "Montclair Nail Spa",
      description: "A sleek, modern website for a premium nail salon in Montclair, NJ. Features a dashing finish with service menu, social media, contact page, and gallery showcasing their exquisite nail salon.",
      imageUrl: "/img/montclairnailspa.png", // Replace with actual image path
      projectUrl: "https://www.montclairnailspa.com"
    },
    {
      id: 2,
      title: "Joy's Nail & Spa",
      description: "An elegant website for Joy's Nail Spa, offering a comprehensive view of their services, and a gallery of their stunning nail designs.",
      imageUrl: "/img/joysnailspa.png", // Replace with actual image path
      projectUrl: "https://www.joysnailspa.com"
    },
    {
      id: 3,
      title: "Coco Nail & Spa",
      description: "A chic, custom-designed logo & website for Ramsey, NJ's premier nail salon. Featuring an eye-catching Gel-X showcase, sleek gallery, and intuitive mobile-friendly UI/UX. Experience luxury at your fingertips!",
      imageUrl: "/img/coconailspa.png", // Replace with actual image path
      projectUrl: "https://www.coconailsramsey.com"
    },
    {
      id: 4,
      title: "Coming Soon",
      description: "Our next exciting project is in the works! Stay tuned for another stunning website that will showcase our commitment to beautiful design and user-friendly functionality.",
      projectUrl: "#"
    },
  ]

  return (
    <section id="portfolio" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-gray-900">Our Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Card key={project.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 flex flex-col h-full">
                {project.title === "Coming Soon" ? (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg h-[225px] flex flex-col justify-center items-center mb-4">
                    <h3 className="text-2xl font-bold mb-2">Coming Soon! 😊</h3>

                    {/* Coming Soon text removed */}
                  </div>
                ) : (
                  <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="mb-4">
                    <Image
                      src={project.imageUrl || '/placeholder.svg'}
                      alt={`Preview of ${project.title}`}
                      className="rounded-lg object-cover w-full cursor-pointer"
                      width={400}
                      height={300}
                    />
                  </Link>
                )}
                <h3 className="text-xl font-bold mt-2 text-gray-800">{project.title}</h3>
                <p className="text-sm text-gray-600 mt-2 flex-grow">{project.description}</p>
                {project.title !== "Coming Soon" && (
                  <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    Visit Website
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio