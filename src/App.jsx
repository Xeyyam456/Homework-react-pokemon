import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getRandomPokemon } from './data/pokemon'
import PokemonCard from './components/PokemonCard'
import TeamList from './components/TeamList'
import TeamStats from './components/TeamStats'
import Title from './components/Title'
import styles from './App.module.css'

export default function App() {
  const [displayedPokemon] = useState(() => getRandomPokemon())

  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem('pokemon-team')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  function saveTeam(updater) {
    setTeam((prev) => {
      const next = updater(prev)
      localStorage.setItem('pokemon-team', JSON.stringify(next))
      return next
    })
  }

  function updateCount(prev, id, delta) {
    return prev.map((entry) =>
      entry.pokemon.id === id
        ? { ...entry, count: entry.count + delta }
        : entry
    )
  }

  function handleAdd(pokemon) {
    toast.success(`${pokemon.name} selected! 🎉`, { position: 'top-right' })
    saveTeam((prev) => {
      const exists = prev.some((entry) => entry.pokemon.id === pokemon.id)
      if (exists) return updateCount(prev, pokemon.id, +1)
      return [...prev, { pokemon, count: 1 }]
    })
  }

  function handleIncrease(id) {
    saveTeam((prev) => updateCount(prev, id, +1))
  }

  function handleDecrease(id) {
    saveTeam((prev) =>
      updateCount(prev, id, -1).filter(({ count }) => count > 0)
    )
  }

  function handleRemove(id) {
    
    const pokemon = team.find((entry) => entry.pokemon.id === id)?.pokemon
    saveTeam((prev) => prev.filter(({ pokemon }) => pokemon.id !== id))
    if (pokemon) {
      toast.error(`${pokemon.name} Removed from team! 😢`, { position: 'top-right' })
    }
  }

  return (
    <div className={styles.app}>
      <Title level={1}>Pokemon Team Manager</Title>

      <div className={styles.pokemonGrid}>
        {displayedPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} onAdd={handleAdd} />
        ))}
      </div>

      <Title level={2}>Your Pokemon Team</Title>

      {team.length > 0 && (
        <TeamList
          team={team}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
      )}

      <TeamStats team={team} />
      <ToastContainer />
    </div>
  )
}
