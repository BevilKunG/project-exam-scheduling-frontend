import {DateTime} from 'luxon'
import { useEffect } from 'react'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import useGlobal from '../hooks/useGlobal'
import useMock from '../hooks/useMock'
import useSchedule, {
  ScheduleActionType, 
  ScheduleProvider, 
  ScheduleType,
} from '../hooks/useSchedule'
import styles from '../styles/schedule.module.sass'
import mockData from '../utils/mock-data'
import Card from './Card'

interface ScheduleProps {
  type?: ScheduleType
}

function Schedule(props: ScheduleProps) {
  return (
    <ScheduleProvider>
      <Content {...props} />
    </ScheduleProvider>
  )
}

export default Schedule

function Content({type=ScheduleType.Schedule}: ScheduleProps) {
  const {state ,dispatch} = useSchedule()
  useEffect(() => {
    dispatch({
      type: ScheduleActionType.SetType,
      payload: {type}
    })
  }, [type, dispatch])

  if (!state.type)
    return null

  return (
    <div className={styles.schedule}>
      <Header />
      <Body />
    </div>
  )
}

function Header() {
  const {state} = useSchedule()

  const {dates} = mockData
  const monthAndYear = DateTime.fromISO(dates[0]).toFormat('LLLL y')

  return (
    <HeaderContainer
      scheduleType={state.type}
      className={styles.header}>
      <div>
        <h3 className={styles.title}>{monthAndYear}</h3>
      </div>

      <div className="grid grid-cols-5">
        {dates.map((date: string) => {
          const dt = DateTime.fromISO(date)
          return (
            <div 
              key={`header-${date}`} 
              className="text-white text-center font-medium">
              <h3 className="text-lg">{dt.toFormat('d')}</h3>
              <h3 className="text-sm">{dt.toFormat('cccc')}</h3>
            </div>
          )
        })}
      </div>
    </HeaderContainer>
  )
}

interface HeaderContainerProps {
  scheduleType: ScheduleType | null
}

const HeaderContainer = styled.div<HeaderContainerProps>`
  ${({scheduleType}) => {
    switch (scheduleType) {
      case ScheduleType.Schedule:
        return 'background: #53DD6C;'
      case ScheduleType.Availability:
        return 'background: #0496FF;'
      
      default:
        return null
    }
  }}
`

function Body() {
  const {dates} = mockData
  return (
    <div className={styles.body}>
      <Time />
  
      <div className="w-full grid grid-cols-5">
        {dates.map((date: string) => (
          <Column key={`column-${date}`} {...{date}} />
        ))}
      </div>
    </div>
  )
}

function Time() {
  const {times} = mockData
  return (
    <div className="w-16">
      {times.map((time: string) => (
        <div key={`time-${time}`} className="h-12 pt-1">
          <h4
            className="text-base font-medium text-gray-800 text-center">
            {time}
          </h4>
        </div>
      ))}
    </div>
  )
}

interface ColumnProps {
  date: string
}

function Column({date}: ColumnProps) {
  const {state} = useMock()
  const {columns} = state

  const {times} = mockData
  return (
    <div>
      {times.map((time: string) => (
        <Row key={`row-${date}-${time}`} {...{column: columns[`column-${date}-${time}`]}} />
      ))}
    </div>
  )
}

function Row(props: any) {
  const {state} = useSchedule()
  switch (state.type) {
    case ScheduleType.Schedule:
      return <CardRow {...props} />
    
    case ScheduleType.Availability:
      return <StatusRow />

    default:
      return null
  }
}

interface CardRowProps {
  column: any
}

function CardRow({column}: CardRowProps) {
  const {state: globalState} = useGlobal()
  const {isEditMode} = globalState

  const {projects} = mockData
  const {projectIds} = column
  
  return !isEditMode ? (
    <CardRowContainer
      cards={projectIds.length} 
      className={`${styles.row} ${styles.card}`}>
      {projectIds.map((projectId: string, index: number) => (
        <Card 
          key={projectId}
          draggable={false}
          {...{project:projects[projectId], column, index}} />
      ))}
    </CardRowContainer>
  ) : (
    <Droppable droppableId={column.id}>
      {
        (provided) => (
          <CardRowContainer
            cards={projectIds.length} 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${styles.row} ${styles.card}`}>
            {provided.placeholder}
            {projectIds.map((projectId: string, index: number) => (
              <Card key={projectId} {...{project:projects[projectId], column, index}} />
            ))}
          </CardRowContainer>
        )
      }
    </Droppable>
  )
}

interface CardRowContainerProps {
  cards: number
}

const CardRowContainer = styled.div<CardRowContainerProps>`
  grid-template-columns: repeat(${({cards}) => cards}, minmax(0, 1fr));
`

function StatusRow() {
  return (
    <div className={styles.row}>
    </div>
  )
}