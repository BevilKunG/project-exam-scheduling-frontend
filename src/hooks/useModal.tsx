import {createContext, Dispatch, FC, Reducer, useContext, useReducer} from 'react'

type ModalState = {
  isShow: boolean
  type: ModalType
}

enum ModalType {
  Info = 'INFO',
  Publish = 'PUBLISH'
}

const initialState: ModalState = {
  isShow: false,
  type: ModalType.Info
}

const useModal = () => useContext(ModalContext)

export default useModal
export {
  ModalProvider,
  ModalType,
  ActionType as ModalActionType,
}

type ModalAction = {
  type: ActionType
}

enum ActionType {
  OpenInfo = 'OPEN_INFO',
  OpenPublish = 'OPEN_PUBLISH',
  Close = 'CLOSE',
}

interface ModalContextValue {
  state: ModalState
  dispatch: Dispatch<ModalAction>
}

const ModalContext = createContext<ModalContextValue>({
  state: initialState,
  dispatch: () => undefined
})

const ModalProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <ModalContext.Provider value={{state, dispatch}}>
      {children}
    </ModalContext.Provider>
  )
}

const reducer: Reducer<ModalState, ModalAction> = (state, action) => {
  switch (action.type) {
    case ActionType.OpenInfo:
      return {
        ...state, 
        isShow: true,
        type: ModalType.Info
      }
    
    case ActionType.OpenPublish:
      return {
        ...state, 
        isShow: true,
        type: ModalType.Publish
      }

    case ActionType.Close:
      return {
        ...state, 
        isShow: false,
      }
  }
}