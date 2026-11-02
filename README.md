# Pokédex Clase · Deck de 40 cartas Pokémon

Aplicación hecha con **Vue.js 3** que arma un deck de **40 cartas Pokémon aleatorias** de la primera generación (del #1 Bulbasaur al #151 Mew) y las muestra todas en una sola vista, con un diseño inspirado en las cartas del juego de cartas coleccionables (TCG).

Los datos se obtienen en tiempo real de la [PokeAPI](https://pokeapi.co/).

## Características

- Deck de 40 Pokémon **aleatorios y sin repetir**.
- Botón **"Nuevo deck aleatorio"** para barajar otra vez.
- Cada carta muestra:
  - **Nombre** y **HP**
  - **ID** de la Pokédex, altura y peso
  - **Tipo(s)**, con el color de la carta según el tipo principal
  - **2 habilidades** con su descripción en español
  - **Características**: ataque, defensa y velocidad
  - Debilidad y costo de retirada, como en las cartas reales
- Diseño responsivo: la cuadrícula se adapta al tamaño de la pantalla.

## Tecnologías

- [Vue.js 3](https://vuejs.org/) con `<script setup>` y TypeScript
- [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [PokeAPI](https://pokeapi.co/)

## Estructura principal

```
src/
├── components/
│   └── PokemonCard.vue   # Componente de la carta Pokémon
├── views/
│   └── HomeView.vue      # Vista que genera y muestra el deck de 40 cartas
├── types/
│   └── pokemon.ts        # Tipos de datos (Pokemon, Habilidad)
├── App.vue
└── main.ts
```

## Instalación y uso

Requisitos: [Node.js](https://nodejs.org/) 22.18 o superior y conexión a internet (para consultar la PokeAPI).

1. Clonar el repositorio e instalar las dependencias:

   ```sh
   npm install
   ```

2. Iniciar el servidor de desarrollo:

   ```sh
   npm run dev
   ```

3. Abrir en el navegador: <http://localhost:5173>

### Otros comandos

| Comando              | Descripción                            |
| -------------------- | -------------------------------------- |
| `npm run build`      | Revisa los tipos y genera la versión de producción |
| `npm run preview`    | Muestra la versión de producción       |
| `npm run lint`       | Revisa el código con ESLint y Oxlint   |

## Notas

- Si un Pokémon solo tiene una habilidad, la segunda se completa con uno de sus movimientos.
- El daño de cada habilidad se calcula a partir del ataque base del Pokémon.
- La debilidad es una simplificación basada en el tipo principal.

## Autor

- **Nombre:** Antonio Mendez Angel Gabriel
- **Número de control:** 22161002
- **Institución:** Instituto Tecnológico de Oaxaca
- **Materia:** Desarrollo de Servicios Web
