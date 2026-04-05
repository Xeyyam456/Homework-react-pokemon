import styles from './PokemonSprite.module.css'

export default function PokemonSprite({ id, name, size = 'md' }) {
  const paddedId = String(id).padStart(3, '0')
  const url = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`
  return <img src={url} alt={name} className={`${styles.sprite} ${styles[size]}`} />
}
