import {DateTime} from 'luxon'
import styled from 'styled-components'
import {Card} from '.'
import {
  GetScheduleQuery,
  Project,
  Room,
  Session
} from '../graphql/generated'
import useGlobal, { GlobalState, TableType, ViewType } from '../hooks/useGlobal'
import useSchedule from '../hooks/useSchedule'
import styles from '../styles/schedule.module.sass'
import {Droppable} from '../utils/dnd-dynamic'
import {CardStatusType} from './Card'

interface ScheduleProps {
  schedule: GetScheduleQuery['schedule']
  committees: GetScheduleQuery['committees']
}
function Schedule({
  schedule,
  committees,
}: ScheduleProps) {
  const props = {
    schedule,
    committees
  }
  return (
    <div className={styles.schedule}>
      <Header {...props} />
      <Body {...props} />
    </div>
  )
}

export default Schedule

interface HeaderProps {
  schedule: GetScheduleQuery['schedule']
}
function Header({
  schedule,
}: HeaderProps) {
  const {state: {table}} = useGlobal()
  return (
    <HeaderContainer 
      table={table}
      className={styles.header}>
      {schedule.dates.map((date) => {
        const props = {
          date,
          rooms: schedule.rooms
        }
        return <DateHeader key={date} {...props} />
      })}
    </HeaderContainer>
  )
}

interface HeaderContainerProps {
  table: TableType
}
const HeaderContainer = styled.div<HeaderContainerProps>`
  background: ${({table}) => {
    switch (table) {
      case TableType.Schedule: return '#53DD6C'
      case TableType.Availability: return '#0496FF'
    }
  }};
`

interface DateHeaderProps {
  date: string
  rooms: GetScheduleQuery['schedule']['rooms']
}
function DateHeader({
  date,
  rooms,
}: DateHeaderProps) {
  const {state: {table}} = useGlobal()
  const day = DateTime.fromISO(date).toFormat('d')
  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc')
  switch (table) {
    case TableType.Schedule: 
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
  

    case TableType.Availability: 
      return (
        <div>
          <div className="w-48 text-white text-center font-medium">
            <h3 className="text-lg">{day}</h3>
            <h3 className="text-sm">{dayOfWeek}</h3>
          </div>
        </div>
      )

  }
}

interface RoomHeaderProps {
  room: Room
}
function RoomHeader({room}: RoomHeaderProps) {
  return (
    <div className={`${styles.room} text-white text-center font-medium`}>
      <h3 className="text-sm">{room.name}</h3>
    </div> 
  )
}

interface BodyProps {
  schedule: GetScheduleQuery['schedule']
  committees: GetScheduleQuery['committees']
}
function Body({
  schedule,
  committees,
}: BodyProps) {
  return (
    <div className={styles.body}>
      {/* {
        (scheduleType === ScheduleType.Availability) && (
          <Time sessions={schedule.sessions} />
        )
      } */}
      <Columns {...{schedule, committees}} />
    </div>
  )
}

interface TimeProps {
  sessions: GetScheduleQuery['schedule']['sessions']
}
function Time({sessions}: TimeProps) {
  const times = sessions
    .reduce((obj, session) => {
      obj[session.date] = obj[session.date] ? [...obj[session.date], session] : [session]
      return obj
    }, {} as {[key: string]: Session[]})[sessions[0].date]
    .map((session) => session.time.start)

  return (
    <div className={styles.time}>
      {times.map((time: string) => (
        <div key={`time-${time}`} className={styles.item}>
          <h4
            className="text-xs font-medium text-gray-800">
            {time}
          </h4>
        </div>
      ))}
    </div>
  )
}

interface ColumnsProps {
  schedule: GetScheduleQuery['schedule']
  committees: GetScheduleQuery['committees']
}
function Columns({
  schedule,
  committees,
}: ColumnsProps) {
  const {state: {view}} = useGlobal()
  const projects = ((schedule, view) => {
    if (!view.itemId) return schedule.projects
    switch (view.type) {
      case ViewType.All: return schedule.projects
      case ViewType.Committee: {
        return schedule
          .projects
          .filter(({committees}) => committees.map(({_id}) => _id).includes(view.itemId as string))
      }
      case ViewType.Student: {
        return schedule
          .projects
          .filter(({students}) => students.map(({_id}) => _id).includes(view.itemId as string))
      }
      case ViewType.Room: {
        return schedule
          .projects
          .filter(({examination}) => examination?.room._id === view.itemId)
      }
    }
  })(schedule, view)
  return (
    <div className={styles.columns}>
      {schedule.dates.map((date) => {
        const props = {
          rooms: schedule.rooms,
          sessions: schedule.sessions.filter((session) => session.date === date),
          students: schedule.students,
          projects,
          committees,
        }
        return <DateColumn key={date} {...props} />
      })}
    </div>
  )
}

interface DateColumnProps {
  rooms: GetScheduleQuery['schedule']['rooms']
  sessions: GetScheduleQuery['schedule']['sessions']
  projects: GetScheduleQuery['schedule']['projects']
  students: GetScheduleQuery['schedule']['students']
  committees: GetScheduleQuery['committees']
}
function DateColumn({
  rooms,
  sessions,
  projects,
  students,
  committees,
}: DateColumnProps) {
  const {state: {table, view}} = useGlobal()

  switch (table) {
    case TableType.Schedule:
      return (
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
      )

    case TableType.Availability: 
      return (
        <div className="grid grid-flow-col">
          <div className="w-48">
            {sessions.map((session) => (
              <AvailabilitySlot 
                key={session._id} 
                {...{session, students, committees}} />
              ))}
          </div>
        </div>
      )
    
  }
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
    <div className={styles.room}>
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
  const {state: {editmode}} = useGlobal()

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

    // if (project._id === '6215737298365fd6fa0dfdda') console.log(project)
    if (
      !studentsJoined 
      || !advisorJoined 
      || !committeesEnough
    ) {
      return CardStatusType.Bad
    }
    if (availableCommitteeCount < project.committees.length) {
      return CardStatusType.Good
    } 
    return CardStatusType.Excellent
  }
  const status = calculateStatus(project, session)
  const time = session.time.start

  const dragging =  projects.find((project) => project._id === scheduleState.dragging) as Project | null
    
  const dragingStatus = calculateStatus(dragging, session)

  return editmode ? (
    <Droppable droppableId={`${session._id},${room._id}`}>
      {(provided) => {
        return (
          <SlotContainer 
            {...provided.droppableProps}
            ref={provided.innerRef}
            status={dragingStatus}
            className={styles.slot}>
            {provided.placeholder}
            {project && <Card {...{project, status, time}} />}
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

interface AvailabilitySlotProps {
  session: Session
  students: GetScheduleQuery['schedule']['students']
  committees: GetScheduleQuery['committees']
}
function AvailabilitySlot({
  session,
  students,
  committees,
}: AvailabilitySlotProps) {
  const {state} = useGlobal()
  const {view} = state

  const available = ((view: GlobalState['view']) => {
    if (!view.itemId)
      return false

    switch (view.type) {
      case ViewType.All: return false
      case ViewType.Committee: {
        const committee = committees.find(({_id}) => _id === view.itemId)
        return committee ? 
          committee.availability.sessions.map(({_id}) => _id).includes(session._id) 
          : false
      }
      case ViewType.Student: {
        const student = students.find(({_id}) => _id === view.itemId)
        return student ? 
          student.availability.sessions.map(({_id}) => _id).includes(session._id) 
          : false
      }
      case ViewType.Room: return true
    }
  })(view)

  return (
    <AvailabilitySlotContainer 
      available={available}
      className={`${styles.availability} ${styles.slot}`}>
        {available && (
          <h4 className="text-xs text-white font-semibold">{`${session.time.start}-${session.time.end}`}</h4>
        )}
        
    </AvailabilitySlotContainer>
  )
}

interface AvailabilitySlotContainerProps {
  available: boolean
}
const AvailabilitySlotContainer = styled.div<AvailabilitySlotContainerProps>`
  ${({available}) => available && 'background: #53DD6C;'}
`