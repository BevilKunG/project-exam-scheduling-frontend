import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faShare} from '@fortawesome/free-solid-svg-icons'
import Layout from '../../components/Layout'
import Schedule from '../../components/Schedule'
import styles from '../../styles/SchedulePage.module.sass'

function SchedulePage() {
  return (
    <Layout>
      <div className={styles.background}>
        <div className="w-full h-12 flex flex-row text-base font-medium">
          <h3 className="my-auto mr-8">Schedule</h3>
          <h3 className="my-auto mr-8">Availability</h3>
        </div>

        <div className={styles.container}>
          <div className="bg-red-300 w-full">

          </div>

          <div>
            <div className="flex flex-row justify-between align-center ml-16 mb-4">
              <h1 className="text-2xl text-gray-700 font-semibold">CPE/ISNE Project ปลายภาค 1/2564</h1>

              <button className={`${styles.publish} shadow-md`}>
                <FontAwesomeIcon icon={faShare} size="lg" />
                <span className="ml-1">Publish</span>
              </button>
            </div>

            <Schedule />
          </div>
        </div>

        <div className={styles.bottom}>
          <div className="flex flex-row justify-end align-center pt-6">
            <button className={`${styles.edit} shadow-md`}>Edit</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SchedulePage