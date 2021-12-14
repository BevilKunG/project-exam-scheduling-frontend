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
}

const initialState: GlobalState = {
  isEditMode: false
}

const useGlobal = () => useContext(GlobalContext)

export default useGlobal
export {
  GlobalProvider,
  ActionType as GlobalActionType
}


type GlobalAction = {
  type: ActionType
}

enum ActionType {
  EditModeOn = 'EDIT_MODE_ON',
  EditModeOff = 'EDIT_MODE_OFF',
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
  }
}