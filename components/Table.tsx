import styles from '../styles/table.module.sass'

function Table() {
  return (
    <div className="grid gap-1 grid-cols-5">
      <Column />
      <Column />
      <Column />
      <Column />
      <Column />
    </div>
  )
}

export default Table

function Column() {
  return (
    <div className={styles.column}>
      <div className={`${styles.header} text-white text-center font-semibold uppercase`}>
        <h2 className="text-3xl mb-2">9</h2>
        <h3 className="text-xs">Monday</h3>
      </div>
      <Row />
      <Row />
      <Row />
    </div>
  )
}

function Row() {
  return (
    <div className="h-12 border-2 border-t-0 border-gray-300">
    </div>
  )
}