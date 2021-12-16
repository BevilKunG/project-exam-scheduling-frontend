import useGlobal, { GlobalActionType, ViewType } from '../hooks/useGlobal'
import mockData from '../utils/mock-data'
import styles from '../styles/menu.module.sass'
import {Droppable} from '../utils/dnd-dynamic'
import Card from './Card'
import styled from 'styled-components'
import useMock from '../hooks/useMock'

interface MenuProps {
  type: MenuType
}

function Menu({type}: MenuProps) {
  switch (type) {
    case MenuType.View:
      return (
        <div>
          <ViewMenu />
          <SecondaryMenu />
        </div>
      )

    case MenuType.Edit:
      return (
        <div>
          <ProjectMenu />
        </div> 
      )
  }
}

export default Menu
export {MenuType}

enum MenuType {
  Edit = 'EDIT',
  View = 'VIEW',
}

function ProjectMenu() {
  const {state} = useMock()
  const {columns} = state

  const column = columns['column-0']
  const {projectIds} = column
  
  const {projects} = mockData

  return (
    <div className={`${styles.project} ${styles.menu}`}>
      <h2 className={styles.title}>Projects</h2>

      <Droppable droppableId="column-0">
        {
          (provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className={`${styles.list} overflow-y-scroll grid grid-cols-1 gap-2`}>
              {provided.placeholder}
              {projectIds.map((projectId: string, index: number) => (
                <Card key={projectId} {...{project: projects[projectId], column, index}}  />
              ))}
            </div>
          )
        }
      </Droppable>
    </div>
  )
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
    <div className={styles.menu}>
      <h2 className={styles.title}>{title}</h2>
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