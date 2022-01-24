import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {NextPage} from 'next'
import {Layout} from '../../components'
import styles from '../../styles/ScheduleListPage.module.sass'

const ScheduleListPage: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Exam Schedules</h1>

        <div className={`${styles.button}`}>
          <button className={styles.new}>
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-1">New</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ScheduleListPage