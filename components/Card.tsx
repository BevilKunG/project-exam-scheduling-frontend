import {Draggable} from '../libs/dnd-dynamic'
import styled from 'styled-components'
import styles from '../styles/card.module.sass'

interface CardProps {
  project: any
  column: any
  index: number
}

enum StatusType {
  Unscheduled = 'UNSCHEDULED',
  Excellent = 'EXCELLENT',
  Good = 'GOOD',
  Bad = 'BAD'
} 

function Card({project, column, index}: CardProps) {
  const title = project.title.replace(/^(.{30}[^\s]*).*/, '$1')
  const status: StatusType = ((project, column) => {
    if(column.id === 'column-0') {
      return StatusType.Unscheduled
    }
    return StatusType.Excellent
  })(project, column)
  
  return (
    <Draggable draggableId={project.id} index={index}>
      {
        (provided) => (
          <div 
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`${styles.card} relative h-12 rounded-lg py-1 pl-2 pr-4`}>
            <h4 className="text-sm text-white font-medium my-auto">{title}</h4>
            <Status status={status} />
          </div>
        )
      }
    </Draggable>
  )
}

export default Card

interface StatusProps {
  status: StatusType
}

const Status = styled.div<StatusProps>`
  background: ${({status}) => {
    switch(status) {
      case StatusType.Unscheduled: return 'white'
      case StatusType.Excellent: return '#81FF98'
      case StatusType.Good: return '#FFCC57'
      case StatusType.Bad: return '#FC6464'
    }
  }};
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
`