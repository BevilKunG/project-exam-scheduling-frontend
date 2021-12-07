import {Droppable, Draggable} from '../../libs/dnd-dynamic'
import styles from '../styles/list.module.sass'

interface ListProps {
  data: any
}

function List({data}: ListProps) {
  console.log(data.columns['column-0']['projectIds'])
  return (
    <div className="w-56 h-96 bg-white rounded-lg m-auto p-4 overflow-y-scroll">
      <h2 className="text-gray-600 text-lg font-semibold mb-4">Projects</h2>

      <Droppable droppableId={data.columns['column-0']['id']}>

        {
          (provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid gap-1">
              {data.columns['column-0']['projectIds'].map((projectId: string, index: number) => (
                <Card key={projectId} {...{project: data.projects[projectId], index}} />
              ))}
              {provided.placeholder}
            </div>
          )
        }
      </Droppable>
    </div>
  )
}

export default List

interface CardProps {
  project: any,
  index: number
}

export function Card({project, index}: CardProps) {
  return (
    <Draggable draggableId={project.id} index={index}>
      {
        (provided) => (
          <div 
            style={{
              width: '11.875rem'
            }}
            className={`${styles.card} relative h-10 rounded`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}>
            <div className="pl-2">
              <h4 className="text-white">{project.title}</h4>
            </div>

            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400" />
          </div>
        )
      }
    </Draggable>
  )
}