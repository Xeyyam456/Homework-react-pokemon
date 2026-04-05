import styles from './PokemonSprite.module.css'

export default function PokemonSprite({ id, name, size = 'md' }) {
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  return <img src={url} alt={name} className={`${styles.sprite} ${styles[size]}`} />
}
