import {gql, useQuery} from '@apollo/client'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {DateTime} from 'luxon'
import {NextPage} from 'next'
import Error from 'next/error'
import {useRouter} from 'next/router'
import {Layout} from '../../components'
import {GetSchedulesQuery, GetSchedulesQueryVariables, Schedule} from '../../graphql/generated'
import styles from '../../styles/ScheduleListPage.module.sass'

const GET_SCHEDULES = gql`
  query GetSchedules {
    schedules {
      _id
      semester
      for
      dates
    }
    me {
      _id
    }
  }
`
const ScheduleListPage: NextPage = () => {
  const router = useRouter()

  const {loading, error, data} = useQuery<GetSchedulesQuery & {me: any}, GetSchedulesQueryVariables>(GET_SCHEDULES)

  if (loading) return <></>
  if (error) return <Error statusCode={500} title={error.message} />
  if (!data) return <></>

  const {schedules} = data

  const onNewClick = () => {
    router.push('/schedules/new')
  }
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Exam Schedules</h1>

        {
          data.me && (
            <div className={`${styles.button}`}>
              <button 
                onClick={onNewClick}
                className={`${styles.new} shadow-lg`}>
                <FontAwesomeIcon icon={faPlus} />
                <span className="ml-1">New</span>
              </button>
            </div>
          )
        }

        <div className={styles.list}>
          {schedules.map((schedule) => (
            <ScheduleCard 
              key={schedule._id}
              schedule={schedule} />
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ScheduleListPage

interface ScheduleCardProps {
  schedule: Partial<Schedule>
}
function ScheduleCard({schedule}: ScheduleCardProps) {
  const router = useRouter()

  const scheduleFor = `${schedule.for?.slice(0, 1).toUpperCase()}${schedule.for?.slice(1).toLowerCase()}`
  const title = `CPE/ISNE Project ${scheduleFor} ${schedule.semester}`
  const dateStart = schedule.dates ? DateTime.fromISO(schedule.dates[0]).toFormat('LLL d yyyy') : ''
  const dateEnd = schedule.dates ? DateTime.fromISO(schedule.dates.slice(-1)[0]).toFormat('LLL d yyyy') : ''

  const onClick = () => {
    router.push(`/schedules/${schedule._id}`)
  }
  
  return (
    <div
      onClick={onClick}
      className={`${styles.schedule} ${styles.card} rounded-lg shadow-lg cursor-pointer mx-auto my-8`}>
      <h1 className="text-lg text-gray-700 font-medium">{title}</h1>
      <h4 className={`${styles.period} text-sm font-medium`}>{`${dateStart} - ${dateEnd}`}</h4>
    </div>
  )
}
