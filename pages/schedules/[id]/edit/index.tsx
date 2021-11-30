import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faShare} from '@fortawesome/free-solid-svg-icons'
import {DragDropContext, Droppable} from '../../../../libs/dnd-dynamic'
import mockData from '../../../../libs/mock-data'
import {
  Layout,
  Schedule,
  Card
} from '../../../../components'
import styles from '../../../../styles/SchedulePage.module.sass'

function SchedulePage() {
  const onDragEnd = (result: any) => {

  }

  return (
    <Layout>
      <div className={styles.background}>
        <Tabs />
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.container}>
            <Menu />

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

function Tabs() {
  return (
    <div className="w-full h-12 flex flex-row text-base font-medium">
      <h3 className="my-auto mr-8">Schedule</h3>
      <h3 className="my-auto mr-8">Availability</h3>
    </div>
  )
}

function Menu() {
  const {projects, columns} = mockData
  const {projectIds} = columns['column-0']
  return (
    <div>
      <div className={`${styles.menu} w-60 rounded-lg shadow-md pl-4 pr-2 py-2`}>
        <h2 className="text-lg text-gray-700 font-medium mb-4">Projects</h2>

        <Droppable droppableId="column-0">
          {
            (provided) => (
              <div 
                ref={provided.innerRef} 
                {...provided.droppableProps}
                className={`${styles.list} overflow-y-scroll grid grid-cols-1 gap-2`}>
                {provided.placeholder}
                {projectIds.map((projectId: string, index: number) => (
                  <Card key={projectIds} {...{project: projects[projectId], index}}  />
                ))}
              </div>
            )
          }
        </Droppable>
      </div>
    </div>
  )
}

function Bottom() {
  return (
    <div className={styles.bottom}>
      <div className="flex flex-row justify-end align-center pt-6">
        <button className={`${styles.edit} shadow-md`}>Edit</button>
      </div>
    </div>
  )
}