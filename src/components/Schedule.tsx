import {DateTime} from 'luxon'
import {Card} from '.'
import {
  GetScheduleQuery,
  Project,
  Room,
  Session
} from '../graphql/generated'
import useGlobal from '../hooks/useGlobal'
import useSchedule from '../hooks/useSchedule'
import styles from '../styles/schedule.module.sass'
import {Droppable} from '../utils/dnd-dynamic'
import {CardStatusType} from './Card'

interface ScheduleProps {
  schedule: GetScheduleQuery['schedule']
}
function Schedule({schedule}: ScheduleProps) {
  return (
    <div className={styles.schedule}>
      <Time schedule={schedule} />
      <Columns schedule={schedule} />
    </div>
  )
}

export default Schedule

interface TimeProps {
  schedule: GetScheduleQuery['schedule']
}
function Time({schedule}: TimeProps) {
  const times = schedule
    .sessions
    .reduce((obj, session) => {
      obj[session.date] = obj[session.date] ? [...obj[session.date], session] : [session]
      return obj
    }, {} as {[key: string]: Session[]})[schedule.sessions[0].date]
    .map((session) => session.time.start)

  return (
    <div className="w-10 mt-16 mx-2">
      {times.map((time: string) => (
        <div key={`time-${time}`} className="h-10 pt-1">
          <h4
            className="text-sm font-medium text-gray-800 text-center">
            {time}
          </h4>
        </div>
      ))}
    </div>
  )
}

interface ColumnsProps {
  schedule: GetScheduleQuery['schedule']
}
function Columns({schedule}: ColumnsProps) {
  return (
    <>
      {schedule.dates.map((date) => {
        const props = {
          date,
          rooms: schedule.rooms,
          sessions: schedule.sessions.filter((session) => session.date === date),
          projects: schedule.projects,
        }
        return <DateColumn key={date} {...props} />
      })}
    </>
  )
}

interface DateColumnProps {
  date: string
  rooms: GetScheduleQuery['schedule']['rooms']
  sessions: GetScheduleQuery['schedule']['sessions']
  projects: GetScheduleQuery['schedule']['projects']
}
function DateColumn({
  date,
  rooms,
  sessions,
  projects,
}: DateColumnProps) {
  const day = DateTime.fromISO(date).toFormat('d')
  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc')
  return (
    <div>
      {/* header */}
      <div className={`${styles.header} text-white text-center font-medium`}>
        <h3 className="text-lg">{day}</h3>
        <h3 className="text-sm">{dayOfWeek}</h3>
      </div>
      {/* rooms */}
      <div className="grid grid-flow-col">
        {rooms.map((room) => {
          const props = {
            room,
            sessions,
            projects,
          }
          return <RoomColumn key={room._id} {...props} />
        })}
      </div>  
    </div>
  )
}

interface RoomColumnProps {
  room: Room
  sessions: GetScheduleQuery['schedule']['sessions']
  projects: GetScheduleQuery['schedule']['projects']
}
function RoomColumn({
  room,
  sessions,
  projects,
}: RoomColumnProps) {
  return (
    <div className="w-36">
      {/* header */}
      <div className={`${styles.header} text-white text-center font-medium`}>
        <h3 className="text-sm">{room.name}</h3>
      </div>
      {/* sessions */}
      {sessions.map((session) => <Slot key={session._id} {...{session, room, projects}}  />)}
    </div>
  )
}

interface SlotProps {
  session: Session
  room: Room
  projects: GetScheduleQuery['schedule']['projects']
}
function Slot({
  session,
  room,
  projects,
}: SlotProps) {
  const {state: globalState} = useGlobal()
  const {isEditMode} = globalState

  const {state: scheduleState} = useSchedule()
  const {examinations} = scheduleState

  const examination = examinations.find(({sessionId, roomId}) => (sessionId === session._id && roomId === room._id))
  const project = examination ? 
    projects.find((project) => project._id === examination.projectId) as Project
    : null

  // calculate card status
  const status = CardStatusType.Excellent


  return isEditMode ? (
    <Droppable droppableId={`${session._id},${room._id}`}>
      {(provided) => (
        <div 
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={styles.slot}>
          {provided.placeholder}
          {project && <Card {...{project, status}} />}
        </div>
      )}
    </Droppable>
  ) : (
    <div className={styles.slot}>
      {project && <Card {...{project, status, draggable: false}} />}
    </div>
  )
}