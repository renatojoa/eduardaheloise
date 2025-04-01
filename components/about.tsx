import Image from "next/image"

export function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=600&width=600" alt="Eduarda Heloise" fill className="object-cover" />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Sobre Mim</h2>
            <p className="text-lg text-gray-700 mb-4">
              Olá! Sou Eduarda Heloise, designer de interiores apaixonada por criar espaços que refletem a personalidade
              e as necessidades de cada cliente.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Com formação em Design de Interiores e anos de experiência no mercado, trabalho com projetos residenciais
              e comerciais, sempre buscando o equilíbrio perfeito entre estética e funcionalidade.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Minha abordagem combina criatividade, atenção aos detalhes e um profundo entendimento das tendências
              contemporâneas, resultando em ambientes harmoniosos e acolhedores.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Formação</h3>
                <p className="text-gray-700">Bacharel em Design de Interiores</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Experiência</h3>
                <p className="text-gray-700">+5 anos no mercado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

