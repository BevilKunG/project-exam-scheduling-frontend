import {FormFileName} from '../hooks/useForm'

async function readInfo(file: File, method: FormFileName) {
  const methodKeys = {
    [FormFileName.ProjectInfo]: ['title', 'subject', 'students', 'committees'],
    [FormFileName.Rooms]: ['name', 'link'],
    [FormFileName.Enrollment]: ['student', 'courses'],
    [FormFileName.CourseSchedule]: ['course', 'courseSchedule'],
  }
  const keys = methodKeys[method]
  const text = await file.text()

  return processCSV(text, keys)
}

export default readInfo

function processCSV(text: string, keys: string[], delim = ',') {
  const rows = text.slice(text.indexOf('\n') + 1).split('\n')
  
  const array = rows.map((row) => {
    const values = row.split(delim)
    const object = keys.reduce((obj: any, key, index) => {
      obj[key] = values[index]
      return obj
    }, {})

    return object
  })

  return array as any[]
}

// TODO: processInfo