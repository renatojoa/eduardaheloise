import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          filter: "brightness(0.7)",
        }}
      />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Eduarda Heloise</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Transformando espaços em experiências únicas através do design de interiores
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg">
            <Link href="#projects">Ver Projetos</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <Link href="#contact">Contato</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

