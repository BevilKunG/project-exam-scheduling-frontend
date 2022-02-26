import useGlobal, {GlobalActionType, GlobalState, TableType, ViewType} from '../hooks/useGlobal'
import styles from '../styles/menu.module.sass'
import {Droppable} from '../utils/dnd-dynamic'
import Card from './Card'
import styled from 'styled-components'
import {GetScheduleQuery, Project} from '../graphql/generated'
import useSchedule from '../hooks/useSchedule'

interface MenuProps {
  schedule: GetScheduleQuery['schedule']
  committees: GetScheduleQuery['committees']
}
function Menu({
  schedule,
  committees,
}: MenuProps) {
  const {state} = useGlobal()
  const type = !state.editmode ? MenuType.View : MenuType.Project
  switch (type) {
    case MenuType.View:
      return (
        <div className={styles.container}>
          <ViewMenu />
          <SecondaryMenu {...{schedule, committees}} />
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

function ViewMenu() {
  const {state: {view, table}, dispatch} = useGlobal()

  function setView(view: GlobalState['view']) {
    dispatch({
      type: GlobalActionType.SetView,
      payload: {view}
    })
  }

  return (
    <div className={`${styles.view} ${styles.menu}`}>
      <h2 className={styles.title}>View</h2>
      <div className={styles.list}>
        {
          table === TableType.Schedule && (
            <MenuItem 
              active={view.type === ViewType.All}
              onClick={() => setView({type: ViewType.All, itemId: null})}
              className={styles.item}>
              <h4>All</h4>
            </MenuItem>
          )
        }
        
        <MenuItem 
          active={view.type === ViewType.Committee}
          onClick={() => setView({type: ViewType.Committee, itemId: null})}
          className={styles.item}>
          <h4>Committee</h4>
        </MenuItem>

        <MenuItem 
          active={view.type === ViewType.Student}
          onClick={() => setView({type: ViewType.Student, itemId: null})}
          className={styles.item}>
          <h4>Student</h4>
        </MenuItem>

        <MenuItem 
          active={view.type === ViewType.Room}
          onClick={() => setView({type: ViewType.Room, itemId: null})}
          className={styles.item}>
          <h4>Room</h4>
        </MenuItem>
      </div>
    </div>
  )
}

interface SecondaryMenuProps {
  schedule: GetScheduleQuery['schedule']
  committees: GetScheduleQuery['committees']
}
function SecondaryMenu({
  schedule,
  committees,
}: SecondaryMenuProps) {
  const {state, dispatch} = useGlobal()
  const {view} = state

  const title = (function (view: GlobalState['view']) {
    switch (view.type) {
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

  const items = (function (view: GlobalState['view']) {
    switch (view.type) {
      case ViewType.All:
        return []

      case ViewType.Committee:
        return committees.map(({_id, name: text}) => ({_id, text}))

      case ViewType.Student:
        return schedule.students.map(({_id, studentId: text}) => ({_id, text}))

      case ViewType.Room:
        return schedule.rooms.map(({_id, name: text}) => ({_id, text}))
    }
  })(view)

  const onSelect = (itemId: string) => {
    dispatch({
      type: GlobalActionType.SetView,
      payload: {
        view: {type: view.type, itemId}
      }
    })
  }
  
  return (
    <div className={`${styles.secondary} ${styles.menu}`}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.list}>
        {items.map(({_id, text}) => (
          <MenuItem 
            active={view.itemId === _id} 
            key={_id}
            onClick={() => onSelect(_id)}
            className={styles.item}>
            <h4>{text}</h4>
          </MenuItem>
        ))}
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
    .filter(({sessionId, roomId}) => (!sessionId || !roomId))
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
                <div key={project._id} className="my-1">
                  <Card {...{project, index}}  />
                </div>
              ))}
            </div>
          )
        }
      </Droppable>
    </div>
  )
}