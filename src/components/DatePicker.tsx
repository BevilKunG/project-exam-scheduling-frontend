import {DateTime, Info} from 'luxon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import useDatePicker, {DatePickerActionType, DatePickerProvider} from '../hooks/useDatePicker'
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import styles from '../styles/datepicker.module.sass'

function DatePicker() {
  return (
    <DatePickerProvider>
      <div className={`${styles.container} relative px-4 py-2 border border-gray-400 rounded-lg`}>
        <Header />
        <WeekDay />
        <Day />
        <ResetButton />
      </div>
    </DatePickerProvider>
  )
}

export default DatePicker

function Header() {
  const {state, dispatch} = useDatePicker()
  const title = DateTime.fromISO(state.current).toFormat('MMM yyyy')
  return (
    <div className="flex flex-row justify-between align-center mb-2">
      <h1 className="text-xl font-medium text-gray-700">{title}</h1>
      <div>
        <button 
          onClick={() => dispatch({type: DatePickerActionType.Prev})}
          className="mr-8 outline-none">
          <FontAwesomeIcon 
            icon={faChevronLeft}
            size="lg"
            color="#0496FF" />
        </button>

        <button 
          onClick={() => dispatch({type: DatePickerActionType.Next})}
          className="outline-none">
          <FontAwesomeIcon 
          icon={faChevronRight} 
          size="lg"
          color="#0496FF" />
        </button>
      </div>
    </div>
  )
}

function WeekDay() {
  const weekdays = [
    ...Info.weekdays('short').slice(-1),
    ...Info.weekdays('short').slice(0, -1)
  ]

  return (
    <div className="grid grid-cols-7 mb-2">
      {weekdays.map((weekday) => (
        <div key={weekday} className="mx-auto">
          <span className="text-base font-medium text-gray-700">
            {weekday}
          </span>
        </div>
      ))}
    </div>
  )
}

function Day() {
  const {state, dispatch} = useDatePicker()
  const days = [
    ...calculateBlankDays(state.current),
    ...calculateDays(state.current),
  ]

  function calculateBlankDays(iso: string) {
    const firstWeekDay = DateTime.fromISO(iso).startOf('month').weekday % 7

    const blanks = []
    for (let i = 0; i < firstWeekDay; i++) 
      blanks.push(<div key={`blank-${i}`} />)

    return blanks
  }

  function calculateDays(iso: string) {
    const daysInMonth = DateTime.fromISO(iso).daysInMonth

    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${state.current}-${i < 10 ? '0' : ''}${i}`
      const isPicked = state.dates.includes(date)
      const onDayButtonClick = () => {
        const type = isPicked ? DatePickerActionType.Unpick : DatePickerActionType.Pick
        dispatch({
          type,
          payload: {
            date
          }
        })
      }

      days.push(
        <div
          key={`day-button-${date}`}
          className="mx-auto">
          <DayButton
            isPicked={isPicked}
            onClick={onDayButtonClick}
            className="w-8 h-8 text-base font-medium text-gray-700 cursor-pointer">
            {i}
          </DayButton>
        </div>
      )
    }

    return days
  }

  return (
    <div className="grid grid-cols-7 gap-y-2">
      {days}
    </div>
  )
}

interface DayButtonProps {
  isPicked: boolean
}

const DayButton = styled.button<DayButtonProps>`
  ${({isPicked}) => isPicked && `
    background: #53DD6C;
    color: white;
    border-radius: 9999px;
  `}
`

function ResetButton() {
  const {dispatch} = useDatePicker()
  return (
    <div className="absolute bottom-2 right-4">
      <button 
        onClick={() => dispatch({type: DatePickerActionType.Reset})}
        className={styles.reset}>
        <span className="text-base font-medium">Reset</span>
      </button>
    </div>
  )
}