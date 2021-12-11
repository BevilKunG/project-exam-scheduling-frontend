import {Droppable} from '../../utils/dnd-dynamic'
import styles from '../styles/table.module.sass'
import {Card} from './List'

interface TableProps {
  data: any
}

function Table({data}: TableProps) {
  const {dates, times, columns, projects} = data

  return (
    <div className={styles.table}>
      
      <div>
        <Header dates={dates} />
        <div className="overflow-y-scroll h-96 flex flex-row">
          <Time times={times} />
          {dates.map((date: string) => (
            <Column key={date} {...{date, times, columns, projects}} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Table

interface HeaderProps {
  dates: string[]
}

function Header({dates}: HeaderProps) {
  const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THUSDAY', 'FRIDAY', 'SATURDAY']

  return (
    <div className="h-20 flex flex-row">   
      <div className="w-20" /> 

      {dates.map((date) => new Date(date))
        .map((date) => (
          <div key={date.getTime()} className={`${styles.header} w-48 mx-0.5 rounded-t-lg text-center font-semibold uppercase text-white`}>
              <h2 className="text-3xl mb-2">{date.getDate()}</h2>
              <h3 className="text-xs">{dayOfWeek[date.getDay()]}</h3>
          </div>
      ))}
    </div>
  )
}

interface ColumnProps {
  date: string
  times: string[]
  columns: any
  projects: any
}

function Column({date, times, columns, projects}: ColumnProps) {
  return (
    <div className={`${styles.column} w-48 mx-0.5`}>
      {times.map((time) => (
        <Row key={time} {...{column: columns[`column-${date}-${time}`], projects}} />
      ))}
    </div>
  )
}

interface RowProps {
  column: any
  projects: any
}

function Row({column, projects}: RowProps) {
  return (
    <Droppable droppableId={column.id}>
      {
        (provided) => (
          <div 
            className="h-10 border-2 border-t-0 border-gray-300 bg-white"
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {provided.placeholder}
            {column.projectIds.map((projectId: string, index: number) => (
              <Card key={projectId} {...{project: projects[projectId], index}} />
            ))}
          </div>
        )
      }
    </Droppable>
  )
}

interface TimeProps {
  times: string[]
}

function Time({times}: TimeProps) {
  return (
    <div className="w-20">
      {times.map((time) => (
        <div key={time} className="h-10 text-center font-semibold text-base text-gray-500">
          {time}
        </div>
      ))}
    </div>
  )
}