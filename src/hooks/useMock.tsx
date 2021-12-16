import {
  createContext,
  Dispatch,
  FC,
  Reducer,
  useContext,
  useReducer,
} from 'react'
import mockData from '../utils/mock-data'

type MockState = {
  columns: any
}

const initialState: MockState = {
  columns: mockData.columns
}

const useMock = () => useContext(MockContext)

export default useMock
export {
  MockProvider,
  ActionType as MockActionType
}

type MockAction  = {
  type: ActionType
  payload: {
    columns: any
  }
}

enum ActionType {
  SetColumns = 'SET_COLUMNS'
}

interface MockContextValue {
  state: MockState,
  dispatch: Dispatch<MockAction>
}

const MockContext = createContext<MockContextValue>({
  state: initialState,
  dispatch: () => undefined
})

const MockProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <MockContext.Provider value={{state, dispatch}}>
      {children}
    </MockContext.Provider>
  )
}

const reducer: Reducer<MockState, MockAction> = (state, action) => {
  switch (action.type) {
    case ActionType.SetColumns:
      return {...state, columns: action.payload.columns}
  }
}