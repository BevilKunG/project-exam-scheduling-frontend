import {
  createContext,
  useContext,
  FC,
  useReducer,
  Reducer,
  Dispatch,
} from 'react'

enum FormStep {
  First = 'FIRST',
  Second = 'SECOND'
}

type FormState = {
  step: FormStep
}

const initialState: FormState = {
  step: FormStep.First
}

const useForm = () => useContext(FormContext)

export default useForm
export {
  FormProvider,
  ActionType as FormActionType,
  FormStep,
}

type FormAction = {
  type: ActionType
  payload?: {
  }
}

enum ActionType {
  Next = 'Next',
  Back = 'Back'
}

interface FormContextValue {
  state: FormState
  dispatch: Dispatch<FormAction>
}

const FormContext = createContext<FormContextValue>({
  state: initialState,
  dispatch: () => undefined
})

const FormProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <FormContext.Provider value={{state, dispatch}}>
      {children}
    </FormContext.Provider>
  )
}

const reducer: Reducer<FormState, FormAction> = (state, action) => {
  switch (action.type) {
    case ActionType.Next:
        return {...state, step: FormStep.Second}

    case ActionType.Back:
      return {...state, step: FormStep.First}

    default:
      return state
  }
}