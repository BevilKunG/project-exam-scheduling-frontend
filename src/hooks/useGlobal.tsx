import {
  createContext, 
  Dispatch,
  FC,
  Reducer,
  useContext,
  useReducer,
} from 'react'

type GlobalState = {
  isEditMode: boolean
  view: ViewType
}

enum ViewType {
  All = 'ALL',
  Committee = 'COMMITTEE',
  Student = 'STUDENT',
  Room = 'ROOM'
}

const initialState: GlobalState = {
  isEditMode: false,
  view: ViewType.All
}

const useGlobal = () => useContext(GlobalContext)

export default useGlobal
export {
  GlobalProvider,
  ActionType as GlobalActionType,
  ViewType,
}


type GlobalAction = {
  type: ActionType
  payload?: Partial<{
    view: ViewType
  }>
}

enum ActionType {
  EditModeOn = 'EDIT_MODE_ON',
  EditModeOff = 'EDIT_MODE_OFF',
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
    case ActionType.EditModeOn: 
      return {...state, isEditMode: true}
    
    case ActionType.EditModeOff:
      return {...state, isEditMode: false}
      
    case ActionType.SetView: {
      if (!action.payload?.view) {
        return state
      }
      return {...state, view: action.payload.view}
    }
  }
}