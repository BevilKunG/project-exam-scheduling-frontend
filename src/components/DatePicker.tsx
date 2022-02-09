import {DateTime, Info} from 'luxon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import useDatePicker, {DatePickerActionType, DatePickerProvider} from '../hooks/useDatePicker'
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import styles from '../styles/datepicker.module.sass'
import useForm, { FormActionType } from '../hooks/useForm'
import { useEffect } from 'react'

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
  const {state: datePickerState, dispatch: dispatchDatePicker} = useDatePicker()
  const title = DateTime.fromISO(datePickerState.current).toFormat('MMM yyyy')

  const {state: formState} = useForm()
  useEffect(() => {
    if (datePickerState.dates.length === 0 && formState.dates.length !== 0) {
      dispatchDatePicker({type: DatePickerActionType.Set, payload: {dates: formState.dates}})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  return (
    <div className="flex flex-row justify-between align-center mb-2">
      <h1 className="text-xl font-medium text-gray-700">{title}</h1>
      <div>
        <button 
          onClick={() => dispatchDatePicker({type: DatePickerActionType.Prev})}
          className="mr-8 outline-none">
          <FontAwesomeIcon 
            icon={faChevronLeft}
            size="lg"
            color="#0496FF" />
        </button>

        <button 
          onClick={() => dispatchDatePicker({type: DatePickerActionType.Next})}
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
  const {state: datePickerState, dispatch: dispatchDatePicker} = useDatePicker()
  const days = [
    ...calculatePrevMonthDays(datePickerState.current),
    ...calculateDays(datePickerState.current),
    ...calculateNextMonthDays(datePickerState.current),
  ]

  function calculatePrevMonthDays(iso: string) {
    const firstWeekDay = DateTime.fromISO(iso).startOf('month').weekday % 7
    const prevMonth = DateTime.fromISO(iso).minus({months: 1})
    const finalDateOfPrevMonth = DateTime.fromISO(`${prevMonth.toFormat('yyyy-MM')}-${prevMonth.daysInMonth}`)
    const days = Array.from(Array(firstWeekDay).keys()).map((i) => {
      const date = finalDateOfPrevMonth.minus({day: i}).toISODate()
      return {
        key: `prev-${date}`,
        active: datePickerState.dates.includes(date),
        isCurrent: false,
        day: DateTime.fromISO(date).toFormat('d'),
        onClick: () => onDayButtonClick(date),
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
        return {
          key: `day-button-${date}`,
          active: datePickerState.dates.includes(date),
          isCurrent: true,
          day: d,
          onClick: () => onDayButtonClick(date),
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
        active: datePickerState.dates.includes(date),
        isCurrent: false,
        day: DateTime.fromISO(date).toFormat('d'),
        onClick: () => onDayButtonClick(date),
      }
    })

    return days
  }

  const {dispatch: dispatchForm} = useForm()
  function onDayButtonClick(date: string) {
    const isPicked = datePickerState.dates.includes(date)
    const type = isPicked ? DatePickerActionType.Unpick : DatePickerActionType.Pick
    dispatchDatePicker({
      type,
      payload: {
        date
      }
    })

    const dates = isPicked ? datePickerState.dates.filter((d) => d !== date) : 
      [...datePickerState.dates, date].sort((a, b) => (+DateTime.fromISO(a)) - (+DateTime.fromISO(b)))
    dispatchForm({type: FormActionType.SetDates, payload: {dates}})
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
  isCurrent?: boolean
}

const DayButton = styled.button<DayButtonProps>`
  ${({active, isCurrent}) => {
    return active ? `
    background: #53DD6C;
    color: white;
    border-radius: 9999px;
  ` : (isCurrent ? `color: rgb(55 65 81);` : `color: rgb(229 231 235);`)
  }}
`

function ResetButton() {
  const {dispatch: dispatchForm} = useForm()
  const {dispatch: dispatchDatePicker} = useDatePicker()

  const onResetClick = () => {
    dispatchDatePicker({type: DatePickerActionType.Reset})
    dispatchForm({type: FormActionType.SetDates, payload: {dates: []}})
  }

  return (
    <div className="absolute bottom-2 right-4">
      <button 
        onClick={onResetClick}
        className={styles.reset}>
        <span className="text-base font-medium">Reset</span>
      </button>
    </div>
  )
}