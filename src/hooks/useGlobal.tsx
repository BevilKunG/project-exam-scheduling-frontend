import {
  createContext, 
  Dispatch,
  FC,
  Reducer,
  useContext,
  useReducer,
} from 'react'

type GlobalState = {
  editmode: boolean
  table: TableType
  view: {
    type: ViewType
    itemId: string | null
  }
}

enum TableType {
  Schedule = 'SCHEDULE',
  Availability = 'AVAILABILITY'
}

enum ViewType {
  All = 'ALL',
  Committee = 'COMMITTEE',
  Student = 'STUDENT',
  Room = 'ROOM'
}

const initialState: GlobalState = {
  editmode: false,
  table: TableType.Schedule,
  view: {
    type: ViewType.All,
    itemId: null,
  }
}

const useGlobal = () => useContext(GlobalContext)

export default useGlobal
export {
  GlobalProvider,
  ActionType as GlobalActionType,
  TableType,
  ViewType,
}
export type {GlobalState}


type GlobalAction = {
  type: ActionType
  payload?: Partial<{
    table: TableType
    view: {
      type: ViewType
      itemId: string | null
    }
  }>
}

enum ActionType {
  TurnEditModeOn = 'TURN_EDIT_MODE_ON',
  TurnEditModeOff = 'TURN_EDIT_MODE_OFF',
  SetTable = 'SET_TABLE',
  SetView = 'SET_VIEW'
}

interface GlobalContextValue {
  state: GlobalState
  dispatch: Dispatch<GlobalAction>
}

const GlobalContext = createContext<GlobalContextValue>({
  state: initialState,
  dispatch: () => undefined
})

const GlobalProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <GlobalContext.Provider value={{state, dispatch}}>
      {children}
    </GlobalContext.Provider>
  )
}

const reducer: Reducer<GlobalState, GlobalAction> = (state, action) => {
  switch (action.type) {
    case ActionType.TurnEditModeOn: 
      return {...state, editmode: true}
    
    case ActionType.TurnEditModeOff:
      return {...state, editmode: false}

    case ActionType.SetTable: {
      if (action.payload?.table === undefined) {
        return state
      }
      const view = action.payload.table === state.table ? state.view : initialState.view 
      const editmode = action.payload.table === TableType.Availability ? false : state.editmode
      return {
        ...state,
        table: action.payload.table,
        view,
        editmode,
      }
    }

      
    case ActionType.SetView: {
      if (action.payload?.view === undefined) {
        return state
      }
      return {...state, view: action.payload.view}
    }
  }
}