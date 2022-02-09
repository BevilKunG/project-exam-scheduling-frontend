import {
  createContext,
  Dispatch,
  FC,
  Reducer,
  useContext,
  useReducer
} from 'react'
import {DateTime} from 'luxon'

type DatePickerState = {
  current: string
  dates: string[]
}

const initialState: DatePickerState = {
  current: DateTime.now().toFormat('yyyy-MM'),
  dates: [],
}

const useDatePicker = () => useContext(DatePickerContext)

export default useDatePicker
export {
  DatePickerProvider,
  ActionType as DatePickerActionType,
}

type DatePickerAction = {
  type: ActionType,
  payload?: ActionPayload
}

type ActionPayload = Partial<{
  date: string
  dates: string[]
}>

enum ActionType {
  Next = 'NEXT',
  Prev = 'PREV',
  Pick = 'PICK',
  Unpick = 'UNPICK',
  Reset = 'RESET',
  Set = 'SET',
}

interface DatePickerContextValue {
  state: DatePickerState
  dispatch: Dispatch<DatePickerAction>
}

const DatePickerContext = createContext<DatePickerContextValue>({
  state: initialState,
  dispatch: () => undefined
})

const DatePickerProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <DatePickerContext.Provider value={{state, dispatch}}>
      {children}
    </DatePickerContext.Provider>
  )
}

const reducer: Reducer<DatePickerState, DatePickerAction> = (state, action) => {
  switch(action.type) {
    case ActionType.Next: {
      const current = DateTime.fromISO(state.current).plus({months: 1}).toFormat('yyyy-MM')
      return {...state, current}
    }
      
    case ActionType.Prev: {
      const current = DateTime.fromISO(state.current).minus({months: 1}).toFormat('yyyy-MM')
      return {...state, current}
    }

    case ActionType.Set: {
      if(action.payload?.dates === undefined)
        return state

      const dates = [...action.payload.dates].sort((a, b) => (+DateTime.fromISO(a)) - (+DateTime.fromISO(b)))
      const current = dates.length > 0 ? DateTime.fromISO(dates[0]).toFormat('yyyy-MM') : initialState.current
      return {...state, dates, current}
    }

    case ActionType.Pick: {
      if (action.payload?.date === undefined) 
        return state

      const dates = [...state.dates, action.payload.date].sort((a, b) => (+DateTime.fromISO(a)) - (+DateTime.fromISO(b)))
      return {...state, dates}
    }

    case ActionType.Unpick: {
      if (action.payload?.date === undefined) 
        return state

      const dates = state.dates.filter((date) => (date !== action.payload?.date))
      return {...state, dates}
    }

    case ActionType.Reset:
      return initialState
      
    default:
      return state
  }
}