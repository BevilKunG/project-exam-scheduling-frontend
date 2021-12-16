import {Draggable} from '../utils/dnd-dynamic'
import styled from 'styled-components'
import styles from '../styles/card.module.sass'
import useGlobal from '../hooks/useGlobal'
import useModal, {ModalActionType} from '../hooks/useModal'

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
  const {state: globalState} = useGlobal()
  const {isEditMode} = globalState

  const {dispatch: dispatchModal} = useModal()

  const title = project.title.replace(/^(.{30}[^\s]*).*/, '$1')
  const status: StatusType = ((project, column) => {
    if(column.id === 'column-0') {
      return StatusType.Unscheduled
    }    
    return StatusType.Excellent
  })(project, column)

  function openInfo(info: any) {
    dispatchModal({
      type: ModalActionType.OpenInfo,
      payload: {info}
    })
  }
  
  return isEditMode ? (
    <Draggable draggableId={project.id} index={index}>
      {
        (provided) => (
          <Container 
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            status={status}
            className={`${styles.card} h-12 rounded-lg py-1 pl-2 pr-4`}>
            <h4 className="text-sm text-white font-medium my-auto">{title}</h4>
            <Status status={status} />
          </Container>
        )
      }
    </Draggable>
  ) : (
    <Container
      status={status}
      className={`${styles.card} h-12 rounded-lg py-1 pl-2 pr-4 cursor-pointer`}
      onClick={() => openInfo(project)}
      >
      <h4 className="text-sm text-white font-medium my-auto">{title}</h4>
      <Status status={status} />
    </Container>
  )
}

export default Card

interface ContainerProps {
  status: StatusType
}

const Container = styled.div<ContainerProps>`
  position: relative;
  user-select: none;

  ${({status}) => {
    if (status === StatusType.Bad) return 'border: 3px solid #FC6464;'
    return ''
  }}
`

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