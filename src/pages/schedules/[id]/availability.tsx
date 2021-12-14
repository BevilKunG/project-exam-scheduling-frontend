import {NextPage} from 'next'
import {useState} from 'react'
import {Layout, Navigation, Schedule} from '../../../components'
import {ScheduleType} from '../../../hooks/useSchedule'
import styles from '../../../styles/AvailabilityPage.module.sass'
import mockData from '../../../utils/mock-data'

const AvailabilityPage: NextPage = () => {
  const [columns] = useState(mockData['columns'])

  return (
    <Layout>
      <div className={styles.background}>
        <Navigation />

        <div className={styles.container}>
          <Menu />

          <div>
            <div className="flex flex-row justify-between align-center ml-16 mb-4">
              <h1 className="text-2xl text-gray-700 font-semibold">CPE/ISNE Project ปลายภาค 1/2564</h1>
              <button className={`${styles.publish} shadow-md`}>
                {/* <FontAwesomeIcon icon={faShare} size="lg" /> */}
                <span className="ml-1">Publish</span>
              </button>
            </div>

            <Schedule 
              type={ScheduleType.Availability}
              {...{columns, selectedColumnId: null}} />
          </div>
        </div>
        <div className={styles.bottom}></div>
      </div>
    </Layout>
  )
}

export default AvailabilityPage

function Menu() {
  return (
    <div>
      <div className={styles.menu}>
        <h2 className={styles.title}>Projects</h2>
      </div>

      <div className={styles.menu}>
        <h2 className={styles.title}>Projects</h2>
      </div>
    </div>
  )
}
