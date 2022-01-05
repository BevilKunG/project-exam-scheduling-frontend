import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faShare} from '@fortawesome/free-solid-svg-icons'
import {DragDropContext, Droppable} from '../../../utils/dnd-dynamic'
import {
  Layout,
  Schedule,
  Navigation,
  Menu,
} from '../../../components'
import styles from '../../../styles/SchedulePage.module.sass'
import useGlobal, { GlobalActionType } from '../../../hooks/useGlobal'
import {NextPage} from 'next'
import { MenuType } from '../../../components/Menu'
import useMock, { MockActionType } from '../../../hooks/useMock'

const SchedulePage: NextPage = () => {
  const {state: globalState} = useGlobal()
  const {isEditMode} = globalState

  // legacy section
  const {state: mockState, dispatch: dispatchMock} = useMock()
  const {columns} = mockState

  function setColumns(columns: any) {
    dispatchMock({
      type: MockActionType.SetColumns,
      payload: {
        columns
      }
    })
  }

  const onDragEnd = (result: any) => {
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
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.container}>
            <Menu type={isEditMode ? MenuType.Project : MenuType.View} />

            <div>
              <div className="flex flex-row justify-between align-center ml-16 mb-4">
                <h1 className="text-2xl text-gray-700 font-semibold">CPE/ISNE Project ปลายภาค 1/2564</h1>
                <button className={`${styles.publish} shadow-md`}>
                  <FontAwesomeIcon icon={faShare} size="lg" />
                  <span className="ml-1">Publish</span>
                </button>
              </div>

              <Schedule />
            </div>
          </div>
        </DragDropContext>
        <Bottom />
      </div>
    </Layout>
  )
}

export default SchedulePage

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