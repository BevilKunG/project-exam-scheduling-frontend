import {DateTime} from 'luxon'
import styled from 'styled-components'
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
import committees from '../utils/mock-data/committees'
import {CardStatusType} from './Card'

interface ScheduleProps {
  schedule: GetScheduleQuery['schedule']
}
function Schedule({schedule}: ScheduleProps) {
  return (
    <div className={styles.schedule}>
      <Header schedule={schedule} />
      <Body schedule={schedule} />
    </div>
  )
}

export default Schedule

interface HeaderProps {
  schedule: GetScheduleQuery['schedule']
}
function Header({schedule}: HeaderProps) {
  return (
    <div className={styles.header}>
      {schedule.dates.map((date) => {
        const props = {
          date,
          rooms: schedule.rooms
        }
        return <DateHeader key={date} {...props} />
      })}
    </div>
  )
}

interface DateHeaderProps {
  date: string
  rooms: GetScheduleQuery['schedule']['rooms']
}
function DateHeader({
  date,
  rooms,
}: DateHeaderProps) {
  const day = DateTime.fromISO(date).toFormat('d')
  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc')
  return (
    <div>
      <div className="text-white text-center font-medium">
        <h3 className="text-lg">{day}</h3>
        <h3 className="text-sm">{dayOfWeek}</h3>
      </div>

      <div className="grid grid-flow-col">
          {rooms.map((room) => {
            return <RoomHeader key={room._id} room={room} />
          })}
        </div>
    </div>
  )
}

interface RoomHeaderProps {
  room: Room
}
function RoomHeader({room}: RoomHeaderProps) {
  return (
    <div className="w-48 text-white text-center font-medium">
      <h3 className="text-sm">{room.name}</h3>
    </div> 
  )
}

interface BodyProps {
  schedule: GetScheduleQuery['schedule']
}
function Body({schedule}: BodyProps) {
  return (
    <div className={styles.body}>
      <Time schedule={schedule} />
      <Columns schedule={schedule} />
    </div>
  )
}

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
    <div className={styles.time}>
      {times.map((time: string) => (
        <div key={`time-${time}`} className="h-12 pt-1">
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
    <div className={styles.columns}>
      {schedule.dates.map((date) => {
        const props = {
          date,
          rooms: schedule.rooms,
          sessions: schedule.sessions.filter((session) => session.date === date),
          projects: schedule.projects,
        }
        return <DateColumn key={date} {...props} />
      })}
    </div>
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
  // const day = DateTime.fromISO(date).toFormat('d')
  // const dayOfWeek = DateTime.fromISO(date).toFormat('cccc')
  return (
    <>
      {/* header */}
      {/* <div className={`${styles.header} text-white text-center font-medium`}>
        <h3 className="text-lg">{day}</h3>
        <h3 className="text-sm">{dayOfWeek}</h3>
      </div> */}
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
    </>
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
    <div className="w-48">
      {/* header */}
      {/* <div className={`${styles.header} text-white text-center font-medium`}>
        <h3 className="text-sm">{room.name}</h3>
      </div> */}
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
  const calculateStatus = (project: Project | null, session: Session) => {
    if (!project) return
    const studentsJoined = project.students.reduce((b, {availability}) => {
      const sessionIds = availability.sessions.map(({_id}) => _id)
      return b && (sessionIds.includes(session._id))
    }, true)

    const availableCommitteeCount = project
      .committees
      .reduce((count, {availability}) => {
        const available = availability.sessions.map(({_id}) => _id).includes(session._id)
          return count + (available ? 1 : 0)
      }, 0)
    const committeesEnough = availableCommitteeCount >= 2

    const advisorJoined = project
      .advisor
      .availability
      .sessions
      .map(({_id}) => _id)
      .includes(session._id)

    if (!studentsJoined || !advisorJoined || !committeesEnough) return CardStatusType.Bad
    if (availableCommitteeCount < project.committees.length) return CardStatusType.Good
    return CardStatusType.Excellent
  }
  const status = calculateStatus(project, session)

  const dragging =  projects.find((project) => project._id === scheduleState.dragging) as Project | null
    
  const dragingStatus = calculateStatus(dragging, session)

  return isEditMode ? (
    <Droppable droppableId={`${session._id},${room._id}`}>
      {(provided) => {
        return (
          <SlotContainer 
            {...provided.droppableProps}
            ref={provided.innerRef}
            status={dragingStatus}
            className={styles.slot}>
            {provided.placeholder}
            {project && <Card {...{project, status}} />}
          </SlotContainer>
        )
      }}
    </Droppable>
  ) : (
    <div className={styles.slot}>
      {project && <Card {...{project, status, draggable: false}} />}
    </div>
  )
}

interface SlotContainerProps {
  status: CardStatusType | undefined
}
const SlotContainer = styled.div<SlotContainerProps>`
  background: ${({status}) => {
    switch (status) {
      case CardStatusType.Excellent: return '#C2FFCE'
      case CardStatusType.Good: return '#FFE7AD'
      case CardStatusType.Bad: return '#FEC3C3'
    }
  }};
`