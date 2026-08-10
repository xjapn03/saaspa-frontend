import { Sparkles, FlaskConical, Flower2 } from "lucide-react"

const pillars = [
  {
    icon: Sparkles,
    word: "Escucha",
    phrase:
      "Cada tratamiento inicia entendiendo tu piel, tu cuerpo y tu momento. No hay dos rituales iguales porque no hay dos personas iguales.",
  },
  {
    icon: FlaskConical,
    word: "Ciencia",
    phrase:
      "Tecnología dérmica avanzada con ingredientes de grado médico. Combinamos lo mejor de la cosmetología moderna con protocolos seguros y efectivos.",
  },
  {
    icon: Flower2,
    word: "Ritual",
    phrase:
      "Transformamos cada sesión en una pausa consciente. No vienes solo a un tratamiento: vienes a reconectar contigo misma en un espacio diseñado para tu bienestar.",
  },
]

export function PhilosophyPillars() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Nuestra filosofía
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Tres pilares que guían
            <br />
            cada experiencia
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.word} className="group">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <pillar.icon className="size-6" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 font-heading text-xl font-semibold tracking-tight text-foreground">
                {pillar.word}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pillar.phrase}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
