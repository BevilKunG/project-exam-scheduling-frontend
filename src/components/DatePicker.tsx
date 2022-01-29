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
    ...calculatePrevMonthDays(state.current),
    ...calculateDays(state.current),
    ...calculateNextMonthDays(state.current),
  ]

  function calculatePrevMonthDays(iso: string) {
    const firstWeekDay = DateTime.fromISO(iso).startOf('month').weekday % 7
    const prevMonth = DateTime.fromISO(iso).minus({months: 1})
    const finalDateOfPrevMonth = DateTime.fromISO(`${prevMonth.toFormat('yyyy-MM')}-${prevMonth.daysInMonth}`)
    const days = Array.from(Array(firstWeekDay).keys()).map((i) => {
      const date = finalDateOfPrevMonth.minus({day: i}).toISODate()
      return {
        key: `prev-${date}`,
        active: state.dates.includes(date),
        disabled: true,
        onClick: undefined,
        day: DateTime.fromISO(date).toFormat('d'),
      }
    }).reverse()

    return days
  }

  function calculateDays(iso: string) {
    const daysInMonth = DateTime.fromISO(iso).daysInMonth
    const days = Array.from(Array(daysInMonth).keys())
      .map((i) => i+1)
      .map((d) => {
        const date = DateTime.fromISO(iso).set({day: d}).toISODate()
        const isPicked = state.dates.includes(date)
        return {
          key: `day-button-${date}`,
          active: isPicked,
          disabled: false,
          onClick: () => {
            const type = isPicked ? DatePickerActionType.Unpick : DatePickerActionType.Pick
            dispatch({
              type,
              payload: {
                date
              }
            })
          },
          day: d,
        }
      })

    return days
  }

  function calculateNextMonthDays(iso: string) {
    const firstWeekDay = DateTime.fromISO(iso).startOf('month').weekday % 7
    const daysInMonth = DateTime.fromISO(iso).daysInMonth
    const firstDateOfNextMonth = DateTime.fromISO(iso).plus({months: 1}).set({day: 1})
    const days = Array.from(Array(42 - firstWeekDay - daysInMonth).keys()).map((i) => {
      const date = firstDateOfNextMonth.plus({day: i}).toISODate()
      return {
        key: `next-${date}`,
        active: state.dates.includes(date),
        disabled: true,
        onClick: undefined,
        day: DateTime.fromISO(date).toFormat('d'),
      }
    })

    return days
  }

  return (
    <div className="grid grid-cols-7 gap-y-1">
      {days.map(({key, day, ...dayButtonProp}) => (
        <DayButton
          key={key}
          {...dayButtonProp}
          className="w-8 h-8 text-base font-medium text-gray-200 mx-auto">
          {day}
        </DayButton>
      ))}
    </div>
  )
}

interface DayButtonProps {
  active?: boolean
  disabled?: boolean
}

const DayButton = styled.button<DayButtonProps>`
  ${({active, disabled}) => {
    if (active) {
      return disabled ? `
        background: rgb(229 231 235);
        color: white;
        border-radius: 9999px;
      ` : `
        background: #53DD6C;
        color: white;
        border-radius: 9999px;
      `
    } else {
      return disabled ? 'color: rgb(229 231 235);' : 'color: rgb(55 65 81);'
    }
  }}
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