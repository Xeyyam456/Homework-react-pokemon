import styles from './TeamList.module.css'
import Button from '../Button'
import PokemonSprite from '../PokemonSprite'

export default function TeamList({ team, onIncrease, onDecrease, onRemove }) {
  return (
    <div className={styles.list}>
      {team.map((entry) => (
        <div key={entry.pokemon.id} className={styles.row}>
          <PokemonSprite id={entry.pokemon.id} name={entry.pokemon.name} size="sm" />
          <span className={styles.name}>{entry.pokemon.name}</span>
          <div className={styles.controls}>
            <Button variant="dec" onClick={() => entry.count > 1 && onDecrease(entry.pokemon.id)} label="-" />
            <span className={styles.count}>{entry.count}</span>
            <Button variant="inc" onClick={() => onIncrease(entry.pokemon.id)} label="+" />
            <Button variant="danger" onClick={() => onRemove(entry.pokemon.id)} label="Remove" />
          </div>
        </div>
      ))}
    </div>
  )
}
