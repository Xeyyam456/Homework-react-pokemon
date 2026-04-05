import styles from './Button.module.css'

export default function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}>
      {label}
    </button>
  )
}
