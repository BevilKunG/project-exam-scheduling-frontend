import {
  createContext, 
  Dispatch,
  FC,
  Reducer,
  useContext,
  useReducer,
} from 'react'

type ScheduleState = {
  original: Examination[]
  examinations: Examination[]
}

type Examination = {
  projectId: string
  sessionId: string | null
  roomId: string | null
}

const initialState: ScheduleState = {
  original: [],
  examinations: [],
}

const useSchedule = () => useContext(ScheduleContext)

export default useSchedule
export {
  ScheduleProvider,
  ActionType as ScheduleActionType,
}

type ScheduleAction = {
  type: ActionType
  payload: Partial<{
    examinations: Examination[]
    examination: Examination
  }>
}

enum ActionType {
  SetExaminations = 'SET_EXAMINATIONS',
  MoveProject = 'MOVE_PROJECT'
}


interface ScheduleContextValue {
  state: ScheduleState
  dispatch: Dispatch<ScheduleAction>
}

const ScheduleContext = createContext<ScheduleContextValue>({
  state: initialState,
  dispatch: () => undefined,
})

const ScheduleProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ScheduleContext.Provider value={{state, dispatch}}>
      {children}
    </ScheduleContext.Provider>
  )
}

const reducer: Reducer<ScheduleState, ScheduleAction> = (state, action) => {
  switch (action.type) {
    case ActionType.SetExaminations: {
      if (!action.payload.examinations) {
        return state
      }
      const {examinations} = action.payload
      return {...state, examinations, original: examinations}
    }
      

    case ActionType.MoveProject: {
      if (!action.payload.examination) {
        return state
      }
      const examinations = state.examinations.map((examination) => {
        return examination.projectId === action.payload.examination?.projectId ? 
          action.payload.examination
          : examination
      })
      return {...state, examinations}
    }

    default: return state
  }
}