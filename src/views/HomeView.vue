<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PokemonCard from '../components/PokemonCard.vue'
import type { Habilidad, Pokemon } from '../types/pokemon'

const TOTAL_CARTAS = 40
const MAX_ID = 151 // Solo primera generación (Bulbasaur #1 a Mew #151)
const API = 'https://pokeapi.co/api/v2'

const deck = ref<Pokemon[]>([])
const cargando = ref(false)
const error = ref('')

// Genera 40 ids aleatorios sin repetir
function idsAleatorios(cantidad: number): number[] {
  const ids = new Set<number>()
  while (ids.size < cantidad) ids.add(Math.floor(Math.random() * MAX_ID) + 1)
  return [...ids]
}

interface EntradaTexto {
  flavor_text?: string
  short_effect?: string
  language: { name: string }
}

// Obtiene nombre y descripción de una habilidad (en español si existe)
async function obtenerHabilidad(url: string, nombreEn: string): Promise<Habilidad> {
  try {
    const data = await fetch(url).then((r) => r.json())
    const nombre =
      data.names.find((n: { language: { name: string } }) => n.language.name === 'es')?.name ??
      nombreEn
    const textoEs = (data.flavor_text_entries as EntradaTexto[])
      .filter((e) => e.language.name === 'es')
      .pop()?.flavor_text
    const textoEn = (data.effect_entries as EntradaTexto[]).find(
      (e) => e.language.name === 'en',
    )?.short_effect
    return { nombre, descripcion: (textoEs ?? textoEn ?? '').replace(/\s+/g, ' ') }
  } catch {
    return { nombre: nombreEn, descripcion: '' }
  }
}

async function obtenerPokemon(id: number): Promise<Pokemon> {
  const data = await fetch(`${API}/pokemon/${id}`).then((r) => r.json())
  const stat = (nombre: string) =>
    data.stats.find((s: { stat: { name: string } }) => s.stat.name === nombre)?.base_stat ?? 0

  // 2 habilidades: si el Pokémon solo tiene una, se completa con un movimiento
  const refs: { name: string; url: string }[] = data.abilities
    .slice(0, 2)
    .map((a: { ability: { name: string; url: string } }) => a.ability)
  if (refs.length < 2 && data.moves.length) refs.push(data.moves[0].move)
  const habilidades = await Promise.all(
    refs.map((r) => obtenerHabilidad(r.url, r.name.replace(/-/g, ' '))),
  )

  return {
    id: data.id,
    nombre: data.name.replace(/-/g, ' '),
    imagen:
      data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default ?? '',
    tipos: data.types.map((t: { type: { name: string } }) => t.type.name),
    hp: stat('hp'),
    ataque: stat('attack'),
    defensa: stat('defense'),
    velocidad: stat('speed'),
    altura: data.height / 10,
    peso: data.weight / 10,
    habilidades,
  }
}

async function generarDeck() {
  cargando.value = true
  error.value = ''
  try {
    deck.value = await Promise.all(idsAleatorios(TOTAL_CARTAS).map(obtenerPokemon))
  } catch {
    error.value = 'No se pudo cargar el deck. Revisa tu conexión e inténtalo de nuevo.'
  } finally {
    cargando.value = false
  }
}

onMounted(generarDeck)
</script>

<template>
  <main>
    <div class="barra">
      <h1>POKEDEX CLASE · Deck de {{ TOTAL_CARTAS }} cartas</h1>
      <button :disabled="cargando" @click="generarDeck">
        {{ cargando ? 'Barajando...' : 'Nuevo deck aleatorio' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="cargando" class="cargando">Cargando cartas...</p>

    <section v-else class="deck">
      <PokemonCard v-for="p in deck" :key="p.id" :pokemon="p" />
    </section>
  </main>
</template>

<style scoped>
.barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

h1 {
  font-weight: 800;
  font-size: 1.8rem;
}

button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: #e3350d;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.deck {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
}

.cargando,
.error {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 3rem;
}

.error {
  color: #e3350d;
}
</style>
