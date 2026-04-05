import styles from './TeamStats.module.css'
import Title from '../Title'

export default function TeamStats({ team }) {
  const total = team.reduce((sum, e) => sum + e.count, 0)

  return (
    <div className={styles.wrapper}>
      <Title level={2}>Total Pokemon in Team: {total}</Title>
      <Title level={3}>Individual Pokemon Count</Title>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Count</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {team.map((entry) => (
            <tr key={entry.pokemon.id}>
              <td className={styles.statName}>{entry.pokemon.name}</td>
              <td className={styles.statCount}>{entry.count}</td>
              <td className={styles.statLabel}>{entry.count === 1 ? 'Pokemon' : 'Pokemons'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
