import {DateTime} from 'luxon'
import committees from './committees'
import projects from './projects'

const dates = [
  '2021-08-09',
  '2021-08-10',
  '2021-08-11',
  '2021-08-12',
  '2021-08-13',
]

const times = (() => {
  const ts = []
  let t = DateTime.fromObject({hour: 9, minute: 0})
  const e = DateTime.fromObject({hour: 17, minute: 0})
  while (t <= e) {
    ts.push(t.toLocaleString(DateTime.TIME_24_SIMPLE))
    t = t.plus({minutes: 15})
  }
  return ts
})()

const columns = generateColumns(dates, times, projects)

const availability = generateAvailability(committees, columns)

const mockData: any = {
  dates,
  times,
  projects,
  columns,
  availability
}

export default mockData

function generateColumns(dates: string[], times: string[], projects: any) {
  const columns: any = {
    'column-0': {
      id: 'column-0',
      projectIds: Object.keys(projects),
      date: null,
      time: null
    },
  }

  for (const date of dates) {
    for (const time of times) {
      const id = `column-${date}-${time}`
      columns[id] = {
        id,
        projectIds: [],
        date,
        time
      }
    }
  }

  return columns
}

function generateAvailability(committees: any, columns: any) {
  const availability: any = {}
  for(const committee of committees) {
    availability[committee] = {
      ...Object.keys(columns)
    }
    for(const columnId of Object.keys(columns)) {
      availability[committee][columnId] = false
    }
  }
  return availability
}