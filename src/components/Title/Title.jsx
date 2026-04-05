import styles from './Title.module.css'

export default function Title({ children, level = 2 }) {
  const Tag = `h${level}`
  return <Tag className={styles[Tag]}>{children}</Tag>
}
