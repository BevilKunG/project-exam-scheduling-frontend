import {DateTime} from 'luxon'
import { useEffect } from 'react'
import {Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
import useGlobal from '../hooks/useGlobal'
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
  columns: any
  selectedColumnId: string | null
}

function Schedule(props: ScheduleProps) {
  return (
    <ScheduleProvider>
      <Content {...props} />
    </ScheduleProvider>
  )
}

export default Schedule

function Content({
  type=ScheduleType.Schedule,
  columns,
  selectedColumnId
}: ScheduleProps) {
  const {dispatch} = useSchedule()
  useEffect(() => {
    dispatch({
      type: ScheduleActionType.SetType,
      payload: {type}
    })
  }, [type, dispatch])

  return (
    <div className={styles.schedule}>
      <Header selectedColumnId={selectedColumnId} />
      <Body {...{columns, selectedColumnId}} />
    </div>
  )
}

interface HeaderProps {
  selectedColumnId: string | null
}

function Header({selectedColumnId}: HeaderProps) {
  const {state} = useSchedule()

  const {dates, columns} = mockData
  const monthAndYear = DateTime.fromISO(dates[0]).toFormat('LLLL y')

  const column = selectedColumnId ? columns[selectedColumnId] : null
  return (
    <HeaderContainer
      scheduleType={state.type}
      className={styles.header}>
      <div>
        <h3 className="text-white text-base font-medium">{monthAndYear}</h3>
      </div>

      <div className="grid grid-cols-5">
        {dates.map((date: string) => {
          const dt = DateTime.fromISO(date)
          return (
            <HeaderDate 
              key={`header-${date}`} 
              active={column ? column.date === date : false}
              className="text-white text-center font-medium">
              <h3 className="text-lg">{dt.toFormat('d')}</h3>
              <h3 className="text-sm">{dt.toFormat('cccc')}</h3>
            </HeaderDate>
          )
        })}
      </div>
    </HeaderContainer>
  )
}

interface HeaderContainerProps {
  scheduleType: ScheduleType
}

const HeaderContainer = styled.div<HeaderContainerProps>`
  ${({scheduleType}) => {
    switch (scheduleType) {
      case ScheduleType.Schedule:
        return 'background: #53DD6C;'
      case ScheduleType.Availability:
        return 'background: #0496FF;'
    }
  }}
`

// legacy
interface HeaderDateProps {
  active: boolean
}

const HeaderDate = styled.div<HeaderDateProps>`
  color: ${({active}) => {
    return active ? '#0496FF' : 'white'
  }}
`

interface BodyProps {
  columns: any
  selectedColumnId: string | null
}

function Body({columns, selectedColumnId}: BodyProps) {
  const {dates} = mockData
  return (
    <div className={styles.body}>
      <Time selectedColumnId={selectedColumnId} />
  
      <div className="w-full grid grid-cols-5">
        {dates.map((date: string) => (
          <Column key={`column-${date}`} {...{date, columns, selectedColumnId}} />
        ))}
      </div>
    </div>
  )
}

interface TimeProps {
  selectedColumnId: string | null
}

function Time({selectedColumnId}: TimeProps) {
  const {times, columns} = mockData
  return (
    <div className="w-16">
      {times.map((time: string) => (
        <div key={`time-${time}`} className="h-12 pt-1">
          <TimeText 
            active={selectedColumnId ? columns[selectedColumnId]['time'] === time : false}
            className="text-base font-medium text-gray-800 text-center">
            {time}
          </TimeText>
        </div>
      ))}
    </div>
  )
}

interface TimeTextProps {
  active: boolean
}

const TimeText = styled.h4<TimeTextProps>`
  ${({active}) => {
    if (active) return 'color: #0496FF'
  }}
`

interface ColumnProps {
  date: string
  columns: any
  selectedColumnId: string | null
}

function Column({date, columns, selectedColumnId}: ColumnProps) {
  const {times} = mockData
  return (
    <div>
      {times.map((time: string) => (
        <Row key={`row-${date}-${time}`} {...{column: columns[`column-${date}-${time}`], selectedColumnId}} />
      ))}
    </div>
  )
}

interface RowProps {
  column: any
  selectedColumnId: string | null
}

function Row({column, selectedColumnId}: RowProps) {
  const {state} = useGlobal()
  const {isEditMode} = state

  const {projects} = mockData
  const {projectIds} = column

  return isEditMode ? (
    <Droppable droppableId={column.id}>
      {
        (provided) => (
          <RowBackground 
            {...provided.droppableProps}
            ref={provided.innerRef}
            active={selectedColumnId === column.id}
            className="h-12 border border-gray-200">
            {provided.placeholder}
            {projectIds.map((projectId: string, index: number) => (
              <Card key={projectId} {...{project:projects[projectId], column, index}} />
            ))}
          </RowBackground>
        )
      }
    </Droppable>
  ) : (
    <RowBackground 
      active={false}
      className="h-12 border border-gray-200">
      {projectIds.map((projectId: string, index: number) => (
        <Card key={projectId} {...{project:projects[projectId], column, index}} />
      ))}
    </RowBackground>
  )
}

interface RowBackgroundProps {
  active: boolean
}

const RowBackground = styled.div<RowBackgroundProps>`
  ${({active}) => {
    if (active) return 'background: rgba(4, 150, 255, 0.5)'
  }}
`