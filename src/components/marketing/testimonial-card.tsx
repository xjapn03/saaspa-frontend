import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    quote:
      "Nunca había sentido que un facial pudiera ser tan personalizado. Carolina se tomó el tiempo de entender qué necesitaba mi piel, y los resultados se notaron desde la primera sesión. Salí con la piel radiante y el alma tranquila.",
    name: "María Paula Torres",
    service: "Facial Hidratante Premium",
  },
  {
    quote:
      "Llegué con el cuello y la espalda completamente bloqueados después de semanas de estrés. El masaje descontracturante de Alejandra fue otra cosa: presión exacta, ritmo perfecto. Dormí como no dormía hace meses.",
    name: "Camila Restrepo",
    service: "Masaje Descontracturante",
  },
  {
    quote:
      "El ritual detox corporal es más que un tratamiento, es una experiencia completa. Desde el aroma al entrar hasta la sensación de liviandad al salir. Kamerinos logró que me sintiera cuidada en cada detalle.",
    name: "Valentina Suárez",
    service: "Ritual Detox Corporal",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Testimonios
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Algunas cosas solo
            <br />
            se entienden al vivirlas
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col">
              <CardHeader>
                <p className="font-heading text-5xl leading-none text-primary/30 select-none">
                  &ldquo;
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <blockquote className="text-sm leading-relaxed text-muted-foreground">
                  {t.quote}
                </blockquote>
              </CardContent>
              <CardFooter className="flex-col items-start gap-1 pt-4 border-t border-border">
                <p className="font-heading text-lg font-medium text-foreground">
                  {t.name}
                </p>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {t.service}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
