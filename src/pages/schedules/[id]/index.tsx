import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faShare} from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'
import {DragDropContext, Droppable} from '../../../utils/dnd-dynamic'
import mockData from '../../../utils/mock-data'
import {
  Layout,
  Schedule,
  Card,
  Navigation,
} from '../../../components'
import styles from '../../../styles/SchedulePage.module.sass'
import useGlobal, { GlobalActionType } from '../../../hooks/useGlobal'
import {NextPage} from 'next'

const SchedulePage: NextPage = () => {
  // legacy section
  const [columns, setColumns] = useState(mockData['columns'])
  const [selectedColumnId, selectColumn] = useState<string | null>(null)

  const onDragUpdate = (update: any) => {
    const {destination} = update

    if (destination) {
      selectColumn(destination.droppableId)
    }
  }

  const onDragEnd = (result: any) => {
    selectColumn(null)

    const {destination, source, draggableId} = result

    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    const srcCol= columns[source.droppableId]
    const destCol = columns[destination.droppableId]
    const srcProjectIds = Array.from(srcCol.projectIds)
    const destProjectIds = Array.from(destCol.projectIds)

    // if (destProjectIds.length > 0) return
    srcProjectIds.splice(source.index, 1)
    destProjectIds.splice(destination.index, 0, draggableId)

    setColumns({
      ...columns,
      [srcCol.id]: {
        ...srcCol,
        projectIds: srcProjectIds
      },
      [destCol.id]: {
        ...destCol,
        projectIds: destProjectIds
      }
    })
  }
  //

  return (
    <Layout>
      <div className={styles.background}>
        <Navigation />
        <DragDropContext 
          onDragUpdate={onDragUpdate}
          onDragEnd={onDragEnd}>
          <div className={styles.container}>
            <Menu column={columns['column-0']} />

            <div>
              <div className="flex flex-row justify-between align-center ml-16 mb-4">
                <h1 className="text-2xl text-gray-700 font-semibold">CPE/ISNE Project ปลายภาค 1/2564</h1>
                <button className={`${styles.publish} shadow-md`}>
                  <FontAwesomeIcon icon={faShare} size="lg" />
                  <span className="ml-1">Publish</span>
                </button>
              </div>

              <Schedule {...{columns, selectedColumnId}} />
            </div>
          </div>
        </DragDropContext>
        <Bottom />
      </div>
    </Layout>
  )
}

export default SchedulePage

function Menu({column}: any) {
  const {state} = useGlobal()
  const {isEditMode} = state

  return (
    <div>
      {isEditMode ? (
        <ProjectMenu {...{column}} />
      ): (
        <>
          <ViewMenu />
          <SecondaryMenu />
        </>
      )}
    </div>
  )
}

function ProjectMenu({column}: any) {
  const {projects} = mockData
  const {projectIds} = column

  return (
    <div className={styles.menu}>
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
  return (
    <div className={styles.menu}>
      <h2 className={styles.title}>View</h2>
    </div>
  )
}

function SecondaryMenu() {
  return (
    <div className={styles.menu}>
      <h2 className={styles.title}>Committee</h2>
    </div>
  )
}

function Bottom() {
  const {state, dispatch} = useGlobal()
  const {isEditMode} = state
  
  return (
    <div className={styles.bottom}>
      <div className="flex flex-row justify-end align-center pt-6">
        {
          !isEditMode ? (
            <button 
              className={`${styles.edit} shadow-md`}
              onClick={() => dispatch({type: GlobalActionType.EditModeOn})}>
                Edit
            </button>
          ): (
            <button 
              className={`${styles.edit} shadow-md`}
              onClick={() => dispatch({type: GlobalActionType.EditModeOff})}>
                Cancel
            </button>
          )
        }
      </div>
    </div>
  )
}