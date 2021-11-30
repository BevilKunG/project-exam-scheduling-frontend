import {useState} from 'react'
import {DragDropContext} from '../libs/dnd-dynamic'
import mockData from '../libs/mock-data'
import List from '../components/legacy/List'
import Table from '../components/legacy/Table'

function Home() {
  // const [data, setData] = useState(mockData)
  // const onDragEnd = (result: any) => {
  //   const {destination, source, draggableId} = result

  //   if (!destination) return
  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) return

  //   const srcCol= data.columns[source.droppableId]
  //   const destCol = data.columns[destination.droppableId]
  //   const srcProjectIds = Array.from(srcCol.projectIds)
  //   const destProjectIds = Array.from(destCol.projectIds)

  //   if (destProjectIds.length > 0) return
  //   srcProjectIds.splice(source.index, 1)
  //   destProjectIds.splice(destination.index, 0, draggableId)

  //   setData({
  //     ...data,
  //     columns: {
  //       ...data.columns,
  //       [srcCol.id]: {
  //         ...srcCol,
  //         projectIds: srcProjectIds
  //       },
  //       [destCol.id]: {
  //         ...destCol,
  //         projectIds: destProjectIds
  //       }
  //     }
  //   })
  // }
  
  // return (
  //   <DragDropContext onDragEnd={onDragEnd}>
  //     <div className="flex flex-row bg-gray-100 w-screen h-screen py-8">
  //       <div className="w-3/12">
  //         <List data={data} />
  //       </div>

  //       <div className="w-9/12">
  //         <h1 className="font-bold text-2xl text-gray-600 mb-8">CPE/ISNE Project ปลายภาค 1/2564 </h1>
  //         <Table data={data} />
  //       </div>
  //     </div>
  //   </DragDropContext>
  // )
  return <h1>Hello</h1>
}

export default Home