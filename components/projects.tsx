import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Projects() {
  const projects = [
    {
      id: 1,
      title: "Apartamento Contemporâneo",
      category: "Residencial",
      image: "/placeholder.svg?height=600&width=800",
      hasModel: true,
    },
    {
      id: 2,
      title: "Escritório Corporativo",
      category: "Comercial",
      image: "/placeholder.svg?height=600&width=800",
      hasModel: true,
    },
    {
      id: 3,
      title: "Casa de Praia",
      category: "Residencial",
      image: "/placeholder.svg?height=600&width=800",
      hasModel: false,
    },
    {
      id: 4,
      title: "Café Boutique",
      category: "Comercial",
      image: "/placeholder.svg?height=600&width=800",
      hasModel: true,
    },
    {
      id: 5,
      title: "Loft Industrial",
      category: "Residencial",
      image: "/placeholder.svg?height=600&width=800",
      hasModel: false,
    },
    {
      id: 6,
      title: "Clínica Estética",
      category: "Comercial",
      image: "/placeholder.svg?height=600&width=800",
      hasModel: true,
    },
  ]

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Projetos</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Conheça alguns dos meus trabalhos recentes em design de interiores para residências e espaços comerciais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-primary">{project.category}</span>
          {project.hasModel && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Modelo 3D disponível</span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-4">{project.title}</h3>
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm">
            Ver Detalhes
          </Button>
          {project.hasModel && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="#model-viewer">Ver Modelo 3D</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

