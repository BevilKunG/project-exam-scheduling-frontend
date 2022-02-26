import {Draggable} from '../utils/dnd-dynamic'
import styled from 'styled-components'
import styles from '../styles/card.module.sass'
import useModal, {ModalActionType} from '../hooks/useModal'
import {Project, ProjectSubject} from '../graphql/generated'

interface CardProps {
  project: Project
  status?: StatusType
  time?: string
  draggable?: boolean
  index?: number
}
enum StatusType {
  Unscheduled = 'UNSCHEDULED',
  Excellent = 'EXCELLENT',
  Good = 'GOOD',
  Bad = 'BAD'
}
function Card({
  project,
  status=StatusType.Unscheduled,
  time,
  draggable=true,
  index=0,
}: CardProps) {
  const {dispatch: dispatchModal} = useModal()

  const title =  project.title.length > 10 ? project.title.replace(/^(.{10}[^\s]*).*/, '$1') : project.title

  function openInfo(project: Project) {
    // TODO: fix project on modal
    dispatchModal({
      type: ModalActionType.OpenInfo,
      payload: {info: project}
    })
  }
  
  return draggable ? (
    <Draggable draggableId={project._id} index={index}>
      {
        (provided) => {
          return (
            <Container 
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              {...{subject: project.subject, status}}
              className={styles.card}>
              <h4 className={styles.time}>{time}</h4>
              <h4 className={styles.title}>{title}</h4>
              
              <Status status={status} />
            </Container>
          )
        }
      }
    </Draggable>
  ) : (
    <Container
      {...{subject: project.subject, status}}
      className={styles.card}
      onClick={() => openInfo(project)}
      >
      <h4 className={styles.time}>{project.examination?.session.time.start}</h4>
      <h4 className={styles.title}>{title}</h4>
      
      <Status status={status} />
    </Container>
  )
}

export default Card
export {StatusType as CardStatusType}

interface ContainerProps {
  subject: ProjectSubject
  status: StatusType
}
const Container = styled.div<ContainerProps>`
  background: ${({subject}) => {
    switch (subject) {
      case ProjectSubject.Cpe491: return '#0496FF'
      case ProjectSubject.Cpe492: return '#12BA42'
      case ProjectSubject.Isne491: return '#FF3366'
      case ProjectSubject.Isne492: return '#9E3CB9'
    }
  }};

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
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 9999px;
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
`