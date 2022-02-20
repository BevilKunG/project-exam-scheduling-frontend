import styles from '../styles/navbar.module.sass'

function Navbar() {
  return (
    <div className={`${styles.navbar} w-full h-12 px-16 py-2`}>
      <div className="my-auto flex justify-between align-center">
        <div className="flex align-center">
          {/* margin y ??? */}
          <h1 className={`${styles.brand} text-2xl font-medium`}>
            <span className="text-white">ProjX</span>
            <span className={styles.scheduling}>S</span>
          </h1>

          <div className="ml-10 flex justify-around">
            <h2 className="text-lg font-normal text-white">Schedules</h2>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-normal text-white">Logout</h2>
        </div>
      </div>
    </div>
  )
}

export default Navbar