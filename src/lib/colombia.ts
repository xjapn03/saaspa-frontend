export const COLOMBIA_DEPARTMENTS = [
  {
    name: "Cundinamarca",
    cities: ["Bogotá", "Soacha", "Chía", "Zipaquirá", "Facatativá", "Fusagasugá", "Madrid", "Mosquera", "Cajicá", "Funza", "Tocancipá"]
  },
  {
    name: "Antioquia",
    cities: ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Rionegro", "Turbo", "Caucasia", "Sabaneta"]
  },
  {
    name: "Valle del Cauca",
    cities: ["Cali", "Buenaventura", "Palmira", "Tuluá", "Yumbo", "Cartago", "Jamundí", "Buga"]
  },
  {
    name: "Atlántico",
    cities: ["Barranquilla", "Soledad", "Malambo", "Sabanalarga"]
  },
  {
    name: "Bolívar",
    cities: ["Cartagena", "Magangué", "Turbaco", "Arjona", "El Carmen de Bolívar"]
  },
  {
    name: "Santander",
    cities: ["Bucaramanga", "Floridablanca", "Barrancabermeja", "Girón", "Piedecuesta", "San Gil"]
  },
  {
    name: "Norte de Santander",
    cities: ["Cúcuta", "Ocaña", "Villa del Rosario", "Los Patios", "Pamplona"]
  },
  {
    name: "Boyacá",
    cities: ["Tunja", "Sogamoso", "Duitama", "Chiquinquirá", "Puerto Boyacá"]
  },
  {
    name: "Magdalena",
    cities: ["Santa Marta", "Ciénaga", "Fundación", "El Banco"]
  },
  {
    name: "Risaralda",
    cities: ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"]
  },
  {
    name: "Caldas",
    cities: ["Manizales", "La Dorada", "Chinchiná", "Villamaría"]
  },
  {
    name: "Quindío",
    cities: ["Armenia", "Calarcá", "Quimbaya", "Montenegro"]
  },
  {
    name: "Meta",
    cities: ["Villavicencio", "Acacías", "Granada"]
  },
  {
    name: "Huila",
    cities: ["Neiva", "Pitalito", "Garzón", "La Plata"]
  },
  {
    name: "Tolima",
    cities: ["Ibagué", "Espinal", "Melgar", "Honda", "Mariquita"]
  },
  {
    name: "Cesar",
    cities: ["Valledupar", "Aguachica", "Agustín Codazzi"]
  },
  {
    name: "Nariño",
    cities: ["Pasto", "Tumaco", "Ipiales"]
  },
  {
    name: "Cauca",
    cities: ["Popayán", "Santander de Quilichao", "Puerto Tejada"]
  },
  {
    name: "Córdoba",
    cities: ["Montería", "Lorica", "Cereté", "Sahagún", "Tierralta"]
  },
  {
    name: "Sucre",
    cities: ["Sincelejo", "Corozal", "San Marcos"]
  },
  {
    name: "Casanare",
    cities: ["Yopal", "Aguazul", "Villanueva", "Paz de Ariporo"]
  },
  {
    name: "La Guajira",
    cities: ["Riohacha", "Maicao", "Uribia", "San Juan del Cesar"]
  },
  {
    name: "Chocó",
    cities: ["Quibdó", "Istmina", "Tadó"]
  },
  {
    name: "Arauca",
    cities: ["Arauca", "Tame", "Saravena"]
  },
  {
    name: "Putumayo",
    cities: ["Mocoa", "Puerto Asís", "Orito", "Valle del Guamuez"]
  },
  {
    name: "San Andrés y Providencia",
    cities: ["San Andrés", "Providencia"]
  },
  {
    name: "Amazonas",
    cities: ["Leticia", "Puerto Nariño"]
  },
  {
    name: "Guaviare",
    cities: ["San José del Guaviare", "Calamar", "El Retorno", "Miraflores"]
  },
  {
    name: "Vaupés",
    cities: ["Mitú", "Carurú", "Taraira"]
  },
  {
    name: "Vichada",
    cities: ["Puerto Carreño", "La Primavera", "Cumaribo"]
  },
  {
    name: "Guainía",
    cities: ["Inírida", "Barrancominas"]
  }
];

export const getAllDepartments = () => COLOMBIA_DEPARTMENTS.map(d => d.name).sort();
export const getCitiesByDepartment = (departmentName: string) => {
  const dept = COLOMBIA_DEPARTMENTS.find(d => d.name === departmentName);
  return dept ? [...dept.cities].sort() : [];
};
