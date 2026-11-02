export interface Habilidad {
  nombre: string
  descripcion: string
}

export interface Pokemon {
  id: number
  nombre: string
  imagen: string
  tipos: string[]
  hp: number
  ataque: number
  defensa: number
  velocidad: number
  altura: number // en metros
  peso: number // en kg
  habilidades: Habilidad[]
}
