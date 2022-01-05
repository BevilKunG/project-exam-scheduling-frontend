import {NextPage} from 'next'
import {useState} from 'react'
import {Layout, Menu, Navigation, Schedule} from '../../../components'
import { MenuType } from '../../../components/Menu'
import {ScheduleType} from '../../../hooks/useSchedule'
import styles from '../../../styles/AvailabilityPage.module.sass'

const AvailabilityPage: NextPage = () => {
  return (
    <Layout>
      <div className={styles.background}>
        <Navigation />

        <div className={styles.container}>
          <Menu type={MenuType.View} />

          <div>
            <div className="flex flex-row justify-between align-center ml-16 mb-4">
              <h1 className="text-2xl text-gray-700 font-semibold">CPE/ISNE Project ปลายภาค 1/2564</h1>
              <button className={`${styles.publish} shadow-md`}>
                {/* <FontAwesomeIcon icon={faShare} size="lg" /> */}
                <span className="ml-1">Publish</span>
              </button>
            </div>

            <Schedule type={ScheduleType.Availability} />
          </div>
        </div>
        <div className={styles.bottom}></div>
      </div>
    </Layout>
  )
}

export default AvailabilityPage
