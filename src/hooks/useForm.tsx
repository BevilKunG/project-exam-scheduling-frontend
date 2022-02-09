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

enum FormFileName {
  ProjectInfo = 'projectInfo',
  Rooms = 'rooms',
  Enrollment = 'enrollment',
  CourseSchedule = 'courseSchedule',
}

type FormState = {
  step: FormStep
  term: string
  academicYear: string
  type: string // scheduleFor
  dates: string[]
  file: {
    projectInfo: File | null
    rooms: File | null
    enrollment: File | null
    courseSchedule: File | null
  }
}

const initialState: FormState = {
  step: FormStep.First,
  term: '',
  academicYear: '',
  type: 'MIDTERM',
  dates: [],
  file: {
    projectInfo: null,
    rooms: null,
    enrollment: null,
    courseSchedule: null,
  },
}

const useForm = () => useContext(FormContext)

export default useForm
export {
  FormProvider,
  ActionType as FormActionType,
  FormStep,
  FormFileName,
}

type FormAction = {
  type: ActionType
  payload?: ActionPayload
}

type ActionPayload = Partial<{
  term: string
  academicYear: string
  type: any
  dates: string[]
  file: Partial<{
    projectInfo: File
    rooms: File
    enrollment: File
    courseSchedule: File
  }>
}>

enum ActionType {
  Next = 'Next',
  Back = 'Back',
  SetTerm = 'SET_TERM',
  SetAcademicYear = 'SET_ACADEMIC_YEAR',
  SetType = 'SET_TYPE',
  SetDates = 'SET_DATES',
  SetFile = 'SET_FILE',
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

    case ActionType.SetTerm: {
      if (action.payload?.term === undefined) {
        return state
      }

      return {...state, term: action.payload.term}
    }

    case ActionType.SetAcademicYear: {
      if (action.payload?.academicYear === undefined) {
        return state
      }

      return {...state, academicYear: action.payload.academicYear}
    }
        

    case ActionType.SetType: {
      if (action.payload?.type === undefined) {
        return state
      }

      return {...state, type: action.payload.type}
    }

    case ActionType.SetDates: {
      if (action.payload?.dates === undefined) {
        return state
      }

      return {...state, dates: action.payload.dates}
    }

    case ActionType.SetFile: {
      return {
        ...state,
        file: {
          ...state.file,
          ...action.payload,
        }
      }
    }
      

    default:
      return state
  }
}