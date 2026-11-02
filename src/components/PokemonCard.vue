<script setup lang="ts">
import { computed } from 'vue'
import type { Pokemon } from '../types/pokemon'

const props = defineProps<{ pokemon: Pokemon }>()

// Color de cada tipo (fondo de la carta e icono de energía)
const coloresTipo: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
}

// Debilidad simplificada según el tipo principal
const debilidades: Record<string, string> = {
  normal: 'fighting',
  fire: 'water',
  water: 'electric',
  electric: 'ground',
  grass: 'fire',
  ice: 'fire',
  fighting: 'psychic',
  poison: 'psychic',
  ground: 'water',
  flying: 'electric',
  psychic: 'dark',
  bug: 'fire',
  rock: 'water',
  ghost: 'dark',
  dragon: 'fairy',
  dark: 'fighting',
  steel: 'fire',
  fairy: 'steel',
}

const tipoPrincipal = computed(() => props.pokemon.tipos[0] ?? 'normal')
const color = computed(() => coloresTipo[tipoPrincipal.value] ?? '#A8A77A')
const debilidad = computed(() => debilidades[tipoPrincipal.value] ?? 'fighting')
const idFormateado = computed(() => '#' + String(props.pokemon.id).padStart(4, '0'))

// Daño de cada habilidad basado en el ataque del Pokémon
const danio = (i: number) => Math.round((props.pokemon.ataque * (i === 0 ? 0.5 : 1)) / 10) * 10

const colorDe = (tipo: string) => coloresTipo[tipo] ?? '#A8A77A'
</script>

<template>
  <article class="carta" :style="{ '--color': color }">
    <div class="interior">
      <!-- Encabezado: nombre, HP y tipo -->
      <header class="encabezado">
        <span class="etapa">BASIC</span>
        <h2 class="nombre">{{ pokemon.nombre }}</h2>
        <span class="hp"><small>HP</small>{{ pokemon.hp }}</span>
        <span class="energia" :style="{ background: color }" :title="tipoPrincipal"></span>
      </header>

      <!-- Imagen -->
      <div class="marco-imagen">
        <img :src="pokemon.imagen" :alt="pokemon.nombre" loading="lazy" />
      </div>

      <!-- Franja de datos -->
      <div class="datos">
        NO. {{ idFormateado }} · HT: {{ pokemon.altura }} m · WT: {{ pokemon.peso }} kg
      </div>

      <!-- Tipos -->
      <div class="tipos">
        <span v-for="t in pokemon.tipos" :key="t" class="tipo" :style="{ background: colorDe(t) }">
          {{ t }}
        </span>
      </div>

      <!-- 2 habilidades -->
      <section class="habilidades">
        <div v-for="(hab, i) in pokemon.habilidades" :key="hab.nombre" class="habilidad">
          <div class="fila">
            <span class="costo">
              <span
                v-for="n in i + 1"
                :key="n"
                class="energia mini"
                :style="{ background: color }"
              ></span>
            </span>
            <span class="hab-nombre">{{ hab.nombre }}</span>
            <span class="hab-danio">{{ danio(i) }}</span>
          </div>
          <p class="hab-desc">{{ hab.descripcion }}</p>
        </div>
      </section>

      <!-- Características -->
      <section class="caracteristicas">
        <div><small>ATK</small>{{ pokemon.ataque }}</div>
        <div><small>DEF</small>{{ pokemon.defensa }}</div>
        <div><small>VEL</small>{{ pokemon.velocidad }}</div>
      </section>

      <!-- Pie: debilidad y retirada -->
      <footer class="pie">
        <span class="pie-caja">
          debilidad
          <span class="energia mini" :style="{ background: colorDe(debilidad) }"></span>
          +20
        </span>
        <span class="pie-caja">
          retirada
          <span class="energia mini gris"></span>
          <span class="energia mini gris"></span>
        </span>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.carta {
  aspect-ratio: 63 / 88;
  padding: 8px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f7e27a, #d4a52a 50%, #f7e27a);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease;
  font-family: Arial, Helvetica, sans-serif;
  color: #1a1a1a;
}

.carta:hover {
  transform: translateY(-6px) scale(1.03);
}

.interior {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 8px;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--color) 55%, white),
    color-mix(in srgb, var(--color) 85%, black)
  );
  overflow: hidden;
}

.encabezado {
  display: flex;
  align-items: center;
  gap: 4px;
}

.etapa {
  font-size: 0.5rem;
  font-weight: bold;
  font-style: italic;
  background: linear-gradient(#eee, #999);
  padding: 1px 4px;
  border-radius: 6px;
}

.nombre {
  flex: 1;
  font-size: 1rem;
  font-weight: 800;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #111;
}

.hp {
  font-weight: 800;
  font-size: 1rem;
  color: #b00;
}

.hp small {
  font-size: 0.55rem;
  margin-right: 1px;
}

.energia {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
}

.energia.mini {
  width: 11px;
  height: 11px;
  border-width: 1px;
}

.energia.gris {
  background: #ddd;
}

.marco-imagen {
  border: 4px solid #d8c06a;
  box-shadow: inset 0 0 0 1px #8a6d1a;
  background: radial-gradient(circle, #fff 0%, color-mix(in srgb, var(--color) 40%, white) 100%);
  height: 34%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marco-imagen img {
  height: 100%;
  object-fit: contain;
}

.datos {
  font-size: 0.5rem;
  font-style: italic;
  text-align: center;
  background: linear-gradient(90deg, #c9a93a, #f3e3a0, #c9a93a);
  padding: 1px 0;
}

.tipos {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.tipo {
  font-size: 0.55rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  padding: 1px 6px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.habilidades {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.fila {
  display: flex;
  align-items: center;
  gap: 4px;
}

.costo {
  display: flex;
  gap: 1px;
  min-width: 26px;
}

.hab-nombre {
  flex: 1;
  font-weight: bold;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.hab-danio {
  font-weight: 800;
  font-size: 0.9rem;
}

.hab-desc {
  font-size: 0.5rem;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.caracteristicas {
  display: flex;
  justify-content: space-around;
  font-weight: bold;
  font-size: 0.7rem;
}

.caracteristicas small {
  font-size: 0.5rem;
  margin-right: 2px;
  opacity: 0.8;
}

.pie {
  display: flex;
  gap: 4px;
}

.pie-caja {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 0.5rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  padding: 1px 4px;
}
</style>
