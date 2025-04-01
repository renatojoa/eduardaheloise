import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Vamos conversar sobre o seu projeto e como posso ajudar a transformar seus espaços.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Telefone</h4>
                  <p className="text-gray-700">(00) 00000-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Email</h4>
                  <p className="text-gray-700">contato@eduardaheloise.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Endereço</h4>
                  <p className="text-gray-700">Av. Principal, 1000 - Centro</p>
                  <p className="text-gray-700">São Paulo, SP</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Envie uma Mensagem</h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input id="name" placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Assunto
                </label>
                <Input id="subject" placeholder="Assunto da mensagem" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem
                </label>
                <Textarea id="message" placeholder="Descreva seu projeto ou dúvida..." rows={6} />
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

