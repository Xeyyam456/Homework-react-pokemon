import styles from './PokemonCard.module.css'
import Button from '../Button'
import PokemonSprite from '../PokemonSprite'

export default function PokemonCard({ pokemon, onAdd }) {
  return (
    <div className={styles.card}>
      <PokemonSprite id={pokemon.id} name={pokemon.name} size="md" />
      <p className={styles.name}>{pokemon.name}</p>
      <Button variant="primary" onClick={() => onAdd(pokemon)} label="Add to Team" />
    </div>
  )
}
