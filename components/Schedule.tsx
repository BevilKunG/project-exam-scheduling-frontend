import {DateTime} from 'luxon'
import {Droppable} from 'react-beautiful-dnd'
import styles from '../styles/schedule.module.sass'
import mockData from '../libs/mock-data'
import Card from './Card'

interface ScheduleProps {
  columns: any
}

function Schedule({columns}: ScheduleProps) {
  return (
    <div className={styles.schedule}>
      <Header />
      <Body columns={columns} />
    </div>
  )
}

export default Schedule

function Header() {
  const {dates} = mockData
  const monthAndYear = DateTime.fromISO(dates[0]).toFormat('LLLL y')
  return (
    <div className={styles.header}>
      <div>
        <h3 className="text-white text-base font-medium">{monthAndYear}</h3>
      </div>

      <div className="grid grid-cols-5">
        {dates.map((date: string) => {
          const dt = DateTime.fromISO(date)
          return (
            <div key={`header-${date}`} className="text-white text-center font-medium">
              <h3 className="text-lg">{dt.toFormat('d')}</h3>
              <h3 className="text-sm">{dt.toFormat('cccc')}</h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface BodyProps {
  columns: any
}

function Body({columns}: BodyProps) {
  const {times, dates} = mockData
  return (
    <div className={styles.body}>
      <div className="w-16">
        {times.map((time: string) => (
          <div key={`time-${time}`} className="h-12 pt-1">
            <h4 className="text-base font-medium text-gray-800 text-center">{time}</h4>
          </div>
        ))}
      </div>
  
      <div className="w-full grid grid-cols-5">
        {dates.map((date: string) => (
          <Column key={`column-${date}`} {...{date, columns}} />
        ))}
      </div>
    </div>
  )
}

interface ColumnProps {
  date: string
  columns: any
}

function Column({date, columns}: ColumnProps) {
  const {times} = mockData
  return (
    <div>
      {times.map((time: string) => (
        <Row key={`row-${date}-${time}`} column={columns[`column-${date}-${time}`]} />
      ))}
    </div>
  )
}

interface RowProps {
  column: any
}

function Row({column}: RowProps) {
  const {projects} = mockData
  const {projectIds} = column
  return (
    <Droppable droppableId={column.id}>
      {
        (provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="h-12 border border-gray-200">
            {provided.placeholder}
            {projectIds.map((projectId: string, index: number) => (
              <Card key={projectId} {...{project:projects[projectId], column, index}} />
            ))}
          </div>
        )
      }
    </Droppable>
  )
}