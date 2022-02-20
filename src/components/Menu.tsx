import useGlobal, {GlobalActionType, ViewType} from '../hooks/useGlobal'
import styles from '../styles/menu.module.sass'
import {Droppable} from '../utils/dnd-dynamic'
import Card, { CardStatusType } from './Card'
import styled from 'styled-components'
import { GetScheduleQuery, Project} from '../graphql/generated'
import useSchedule from '../hooks/useSchedule'

interface MenuProps {
  schedule: GetScheduleQuery['schedule']
}

function Menu({schedule}: MenuProps) {
  const {state} = useGlobal()
  const type = !state.isEditMode ? MenuType.View : MenuType.Project
  switch (type) {
    case MenuType.View:
      return (
        <div className={styles.container}>
          <ViewMenu />
          <SecondaryMenu />
        </div>
      )

    case MenuType.Project:
      return (
        <div className={styles.container}>
          <ProjectMenu projects={schedule.projects} />
        </div>
      )
  }
}

export default Menu
export {MenuType}

enum MenuType {
  View = 'VIEW',
  Project = 'Project',
}

interface ContainerProps {
  type: MenuType
}

function ViewMenu() {
  const {state, dispatch} = useGlobal()
  const {view} = state

  function setView(view: ViewType) {
    dispatch({
      type: GlobalActionType.SetView,
      payload: {view}
    })
  }

  return (
    <div className={`${styles.view} ${styles.menu}`}>
      <h2 className={styles.title}>View</h2>
      <div className={styles.list}>
        <MenuItem 
          active={view === ViewType.All}
          onClick={() => setView(ViewType.All)}
          className={styles.item}>
          <h4>All</h4>
        </MenuItem>
        
        <MenuItem 
          active={view === ViewType.Committee}
          onClick={() => setView(ViewType.Committee)}
          className={styles.item}>
          <h4>Committee</h4>
        </MenuItem>

        <MenuItem 
          active={view === ViewType.Student}
          onClick={() => setView(ViewType.Student)}
          className={styles.item}>
          <h4>Student</h4>
        </MenuItem>

        <MenuItem 
          active={view === ViewType.Room}
          onClick={() => setView(ViewType.Room)}
          className={styles.item}>
          <h4>Room</h4>
        </MenuItem>
      </div>
    </div>
  )
}

function SecondaryMenu() {
  const {state} = useGlobal()
  const {view} = state

  const title = (function (view: ViewType) {
    switch (view) {
      case ViewType.All:
        return 'Search'

      case ViewType.Committee:
        return 'Committee'

      case ViewType.Student:
        return 'Student'

      case ViewType.Room:
        return 'Room'
    }
  })(view)
  
  return (
    <div className={`${styles.secondary} ${styles.menu}`}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.list}>
        {/* {committees.map((committee) => (
          <MenuItem 
            active={false} 
            key={committee}
            className={styles.item}>
            {committee}
          </MenuItem>
        ))} */}
      </div>
    </div>
  )
}

interface MenuItemProps {
  active: boolean
}

const MenuItem = styled.button<MenuItemProps>`
  ${({active}) => active && `
    background: #006BA6;
    color: white;
  `}
`
interface ProjectMenuProps {
  projects: GetScheduleQuery['schedule']['projects']
}
function ProjectMenu({projects}: ProjectMenuProps) {
  const {state} = useSchedule()
  const {examinations} = state
  
  const unscheduled = examinations
    .filter(({sessionId, roomId}) => !(sessionId && roomId))
    .map(({projectId}) => (projects.find((project) => project._id === projectId) as Project))

  return (
    <div className={`${styles.project} ${styles.menu}`}>
      <h2 className={styles.title}>Projects</h2>

      <Droppable droppableId="initial">
        {
          (provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className={styles.list}>
              {provided.placeholder}
              {unscheduled.map((project, index) => (
                <Card key={project._id} {...{project, index, status: CardStatusType.Unscheduled}}  />
              ))}
            </div>
          )
        }
      </Droppable>
    </div>
  )
}