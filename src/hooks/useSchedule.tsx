import {
  createContext, 
  Dispatch,
  FC,
  Reducer,
  useContext,
  useReducer,
} from 'react'

type ScheduleState = {
  type: ScheduleType | null
}

enum ScheduleType {
  Schedule = 'SCHEDULE',
  Availability = 'AVAILABILITY',
}

const initialState: ScheduleState = {
  type: null,
}

const useSchedule = () => useContext(ScheduleContext)

export default useSchedule
export {
  ScheduleProvider,
  ActionType as ScheduleActionType,
  ScheduleType,
}

type ScheduleAction = {
  type: ActionType,
  payload: {
    type: ScheduleType
  }
}

enum ActionType {
  SetType = 'SET_TYPE'
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
    case ActionType.SetType:
      return {...state, type: action.payload.type}

    default: return state
  }
}