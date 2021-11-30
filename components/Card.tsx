import {Draggable} from '../libs/dnd-dynamic'
import styled from 'styled-components'
import styles from '../styles/card.module.sass'

interface CardProps {
  project: any
  index: number
}

function Card({project, index}: CardProps) {
  const title = project.title.replace(/^(.{30}[^\s]*).*/, '$1')
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
            <Status />
          </div>
        )
      }
    </Draggable>
  )
}

export default Card

const Status = styled.div`
  background: white;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
`