import { Paintbrush, Ruler, Home, Building, Lightbulb, Palette } from "lucide-react"

export function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meus Serviços</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Ofereço soluções completas em design de interiores para transformar qualquer espaço em um ambiente funcional
            e esteticamente agradável.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={<Home className="w-10 h-10" />}
            title="Design Residencial"
            description="Transforme sua casa em um lar com projetos personalizados que refletem seu estilo de vida e personalidade."
          />
          <ServiceCard
            icon={<Building className="w-10 h-10" />}
            title="Design Comercial"
            description="Crie ambientes comerciais que impressionam clientes e proporcionam conforto e produtividade aos colaboradores."
          />
          <ServiceCard
            icon={<Ruler className="w-10 h-10" />}
            title="Projetos Técnicos"
            description="Desenvolvimento de plantas, cortes, elevações e detalhamentos técnicos para execução precisa do projeto."
          />
          <ServiceCard
            icon={<Paintbrush className="w-10 h-10" />}
            title="Consultoria de Cores"
            description="Orientação especializada na escolha de paletas de cores que harmonizam com o ambiente e transmitem as sensações desejadas."
          />
          <ServiceCard
            icon={<Lightbulb className="w-10 h-10" />}
            title="Projeto Luminotécnico"
            description="Planejamento de iluminação que valoriza os espaços e cria diferentes atmosferas de acordo com a necessidade."
          />
          <ServiceCard
            icon={<Palette className="w-10 h-10" />}
            title="Seleção de Mobiliário"
            description="Escolha cuidadosa de móveis e acessórios que combinam funcionalidade, conforto e estética."
          />
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}

