export interface ServiceData {
  name: string
  slug: string
  category: string
  duration: string
  description: string
  longDescription: string
  price: string
  benefits: string[]
}

export const services: ServiceData[] = [
  {
    name: "Facial Hidratante Premium",
    slug: "facial-hidratante-premium",
    category: "Facial",
    duration: "75 min",
    description:
      "Limpieza profunda con ácido hialurónico y vitamina C. Hidratación intensiva que devuelve luminosidad y firmeza a tu piel.",
    longDescription:
      "Nuestro facial insignia combina tecnología de penetración con ingredientes de grado médico. Iniciamos con un diagnóstico personalizado de tu piel, seguido de una limpieza profunda con vapor ozonizado, exfoliación enzimática suave, y aplicación de ácido hialurónico de alto peso molecular. Finalizamos con un masaje facial relajante y protección solar mineral.",
    price: "$ 180.000",
    benefits: [
      "Hidratación profunda inmediata",
      "Reducción visible de líneas finas",
      "Luminosidad y firmeza",
      "Textura suave al tacto",
    ],
  },
  {
    name: "Masaje Descontracturante",
    slug: "masaje-descontracturante",
    category: "Corporal",
    duration: "90 min",
    description:
      "Técnica profunda para liberar tensiones acumuladas en espalda, cuello y hombros. Alivio que se siente desde la primera sesión.",
    longDescription:
      "Un masaje terapéutico enfocado en las zonas de mayor tensión: cervicales, trapecios, dorsales y lumbares. Utilizamos aceites esenciales de árnica y romero para potenciar el efecto antiinflamatorio, combinando técnicas de amasamiento profundo, fricción transversal y liberación miofascial.",
    price: "$ 150.000",
    benefits: [
      "Alivio del dolor muscular",
      "Mejora de la movilidad articular",
      "Reducción del estrés físico",
      "Mejor calidad del sueño",
    ],
  },
  {
    name: "Ritual Detox Corporal",
    slug: "ritual-detox-corporal",
    category: "Bienestar",
    duration: "120 min",
    description:
      "Experiencia completa de desintoxicación con exfoliación corporal, envoltura termogénica y masaje drenante.",
    longDescription:
      "Un viaje sensorial de dos horas que transforma tu cuerpo. Comenzamos con un cepillado en seco para activar la circulación, seguido de una exfoliación con sales marinas y aceites esenciales. Aplicamos una mascarilla termogénica de arcilla verde y jengibre que estimula la eliminación de toxinas, y finalizamos con un masaje de drenaje linfático manual.",
    price: "$ 220.000",
    benefits: [
      "Eliminación de toxinas",
      "Reducción de retención de líquidos",
      "Piel más suave y renovada",
      "Sensación de ligereza",
    ],
  },
  {
    name: "Limpieza Facial Profunda",
    slug: "limpieza-facial-profunda",
    category: "Facial",
    duration: "60 min",
    description:
      "Extracción manual y tecnología de ultrasonido para una piel libre de impurezas. Ideal para pieles mixtas y grasas.",
    longDescription:
      "Protocolo avanzado de limpieza que utiliza ultrasonido de alta frecuencia para desincrustar impurezas sin irritación. Incluye vapor ozonizado, peeling enzimático, extracción manual cuidadosa, mascarilla seborreguladora y alta frecuencia para calmar y desinflamar. Tu piel respira de nuevo.",
    price: "$ 130.000",
    benefits: [
      "Poros limpios y cerrados",
      "Control de brillos",
      "Textura uniforme",
      "Prevención de brotes",
    ],
  },
  {
    name: "Drenaje Linfático Manual",
    slug: "drenaje-linfatico",
    category: "Corporal",
    duration: "75 min",
    description:
      "Técnica de masaje suave que activa el sistema linfático. Reduce la retención de líquidos y mejora la circulación.",
    longDescription:
      "Siguiendo el método Vodder, realizamos movimientos rítmicos y precisos que estimulan la circulación linfática. Este masaje es ideal para personas con pesadez en piernas, post-operatorios, o simplemente para quienes buscan eliminar toxinas de forma natural y suave.",
    price: "$ 160.000",
    benefits: [
      "Reducción de inflamación",
      "Piernas más ligeras",
      "Fortalecimiento inmunológico",
      "Relajación profunda",
    ],
  },
  {
    name: "Nutrición Capilar Profunda",
    slug: "nutricion-capilar-profunda",
    category: "Capilar",
    duration: "90 min",
    description:
      "Tratamiento intensivo para cuero cabelludo y fibra capilar con queratina, colágeno y aceites botánicos.",
    longDescription:
      "Combinamos diagnóstico capilar con tecnología LED y un protocolo de nutrición en tres pasos: exfoliación del cuero cabelludo con activos botánicos, aplicación de ampolla concentrada de queratina y colágeno, y sellado con luz infrarroja para máxima absorción. Tu cabello recupera brillo, fuerza y movimiento.",
    price: "$ 190.000",
    benefits: [
      "Fortalecimiento de la fibra capilar",
      "Brillo y suavidad inmediatos",
      "Reducción de la caída",
      "Cuero cabelludo equilibrado",
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug)
}
