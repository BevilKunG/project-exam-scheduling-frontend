import dynamic from 'next/dynamic'
import {ComponentType} from 'react'
import {DragDropContextProps, DraggableProps, DroppableProps} from 'react-beautiful-dnd'

export const DragDropContext: ComponentType<DragDropContextProps> = dynamic(
  (): any => import('react-beautiful-dnd').then((mod) => mod.DragDropContext),
  {ssr: false}
)

export const Droppable: ComponentType<DroppableProps> = dynamic(
  (): any => import('react-beautiful-dnd').then((mod) => mod.Droppable),
  {ssr: false}
)

export const Draggable: ComponentType<DraggableProps> = dynamic(
  (): any => import('react-beautiful-dnd').then((mod) => mod.Draggable),
  {ssr: false}
)