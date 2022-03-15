import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {NextPage} from 'next'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {gql, useMutation} from '@apollo/client'
import Papa from 'papaparse'
import {DatePicker, Layout} from '../../components'
import useForm, {FormActionType, FormFileName, FormProvider, FormState, FormStep} from '../../hooks/useForm'
import styles from '../../styles/ScheduleFormPage.module.sass'
import {ChangeEvent, createRef} from 'react'
import { DayOfWeek, ScheduleFor } from '../../graphql/generated'


const CREATE_INFORMATION = gql`
  mutation CreateInformation($arg: CreateInformationInput!) {
    createInformation(arg: $arg) {
      schedule {
        _id
      }
    }
  }
`

const ScheduleFormPage: NextPage = () => {
  return (
    <Layout>
      <div className={`${styles.container} pt-2`}>
        <h1 className="text-3xl font-semibold text-gray-700 text-center">Create Schedule</h1>

        <FormProvider>
          <Form />
        </FormProvider>
      </div>
    </Layout>
  )
}

export default ScheduleFormPage

function Form() {
  const {state} = useForm()
  switch (state.step) {
    case FormStep.First:
      return <FirstForm />
    
    case FormStep.Second:
      return <SecondForm />
  }
}

function FirstForm() {
  const {state, dispatch} = useForm()
  return (
    <>
      <div className={`${styles.form} ${styles.first} mx-auto`}>
        <div className="my-8">
          <label className="block text-lg font-semibold text-gray-700">Semester</label>
          <div className="flex mt-2">
            <input 
              type="text" 
              className="w-16 h-9 px-4 py-1 text-lg border border-gray-400 rounded"
              maxLength={1}
              value={state.term}
              onChange={(e) => dispatch({type: FormActionType.SetTerm, payload: {term: e.target.value}})}
              />

              <div className="mx-8">
                <Image 
                  src="/diagonal-line.svg"
                  alt=""
                  width={40}
                  height={40} />
              </div>

            <input 
              type="text" 
              className="w-24 h-9 px-4 py-1 text-lg border border-gray-400 rounded"
              maxLength={4}
              value={state.academicYear}
              onChange={(e) => dispatch({type: FormActionType.SetAcademicYear, payload: {academicYear: e.target.value}})}
              />
          </div>
        </div>

        <div className="my-8">
          <label className="block text-lg font-semibold text-gray-700">Type</label>
          <div className="mt-2">
            <select 
              className="w-64 h-9 px-4 py-1 text-lg border border-gray-400 rounded"
              onChange={(e) => dispatch({type: FormActionType.SetType, payload: {type: e.target.value}})}
              value={state.type}>
              <option value={ScheduleFor.Midterm}>Midterm</option>
              <option value={ScheduleFor.Final}>Final</option>
            </select>
          </div>

          
        </div>

        <div className="my-8">
          <label className="block text-lg font-semibold text-gray-700"> Duration</label>
          <div className="mt-2">
            <DatePicker />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end align-center">
        <button 
          className={`${styles.next} w-24 h-9 rounded`}
          onClick={() => dispatch({type: FormActionType.Next})}>
            <span className="text-lg font-semibold">Next</span>
        </button>
      </div>
    </>
  )
}

function SecondForm() {
  const router = useRouter()
  const {state, dispatch} = useForm()
  const items = [
    {name: FormFileName.ProjectInfo, label: 'Project information', template: '/templates/project-info.csv'},
    {name: FormFileName.Rooms, label: 'Rooms', template: '/templates/rooms.csv'},
    {name: FormFileName.Enrollment, label: 'Enrollment', template: '/templates/enrollment.csv'},
    {name: FormFileName.CourseSchedule, label: 'Course schedule', template: '/templates/course-schedule.csv'},
  ]

  const [createInformation, {data, loading, error}] = useMutation(CREATE_INFORMATION, {
    onCompleted: ({createInformation: {schedule}}) => {
      router.replace(`/schedules/${schedule._id}`)
    }
  })

  if (loading) {
    return <h1>loading...</h1>
  }

  if (error) {
    return <h1>error</h1>
  }

  const onSubmit = async () => {
    const pass = validate(state)
    if (!pass) {
      alert('invalid form')
      return
    }

    const {
      term,
      academicYear,
      type,
      dates,
      file,
    } = state

    const schedule = {
      semester: `${term}/${academicYear}`,
      for: type,
      dates,
    }
    
    const {
      projects,
      rooms,
      enrollments,
      courseSchedules,
    } = await parse(file)
    
    const students = projects
      .reduce<string[]>((students, project) => [...students, ...project.students], [])
      .filter((v, i, self) => self.indexOf(v) === i)

    // !!! function parse courseSchedule
    const courses = enrollments
      .reduce<string[]>((courses, enrollment) => [...courses, ...enrollment.courses], [])
      .filter((v, i, self) => self.indexOf(v) === i)
      .map((c) => {
        const [course, section] = c.split('-')
        const courseSchedule = courseSchedules
          .filter((cs) => cs.course === c)
          .map(({courseSchedule}) => courseSchedule)
          .reduce((courseSchedule, cs) => [...courseSchedule, ...cs], [])
          .filter((v, i, self) => self.indexOf(v) === i)
          .map((cs) => {
            const matched = cs.match(/([MTWRFSU]+)([0-9]{4})-([0-9]{4})/)

            // TODO: handle mismatch
            if (!matched) return [] // alert error ?

            const [_, days, start, end] = matched
            const dayOfWeek: {[key: string]: string} = {
              M: DayOfWeek.Monday,
              T: DayOfWeek.Tuesday,
              W: DayOfWeek.Wednesday,
              R: DayOfWeek.Thursday,
              F: DayOfWeek.Friday,
              S: DayOfWeek.Saturday,
              U: DayOfWeek.Sunday,
            }
            return days
              .split('')
              .map((d) => ({day: dayOfWeek[d], start: `${start.slice(0, 2)}:${start.slice(2, 4)}`, end: `${end.slice(0, 2)}:${end.slice(2, 4)}`}))
          })
          .reduce((courseSchedule, days) => [...courseSchedule, ...days], [])

        return {course, section, courseSchedule}
      })

    
    const arg = {
      schedule,
      rooms,
      students,
      projects,
      courses,
      enrollments,
    }
    createInformation({
      variables: {arg}
    })

  }

  return (
    <>
      <div className={`${styles.form} ${styles.second} mx-auto`}>
        
        {items.map((prop) => (
          <FileUpload key={`file-upload-${prop.name}`} {...prop} />
        ))}
      </div>

      <div className={`${styles.buttons} flex justify-between align-center`}>
        <button 
          className={`${styles.back} w-24 h-9 rounded`}
          onClick={() => dispatch({type: FormActionType.Back})}>
            <span className="text-lg font-semibold">Back</span>
        </button>

        <button 
          className={`${styles.next} w-24 h-9 rounded`}
          onClick={onSubmit}>
            <span className="text-lg font-semibold">Create</span>
        </button>
      </div>
    </>
  )
}

interface FileUploadProps {
  name: FormFileName
  label: string
  template: string
}

function FileUpload({
  name,
  label,
  template,
}: FileUploadProps) {
  const {state, dispatch} = useForm()
  const ref = createRef<HTMLInputElement>()
  const onFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      dispatch({
        type: FormActionType.SetFile,
        payload: {[name]: file}
      })
    }
  }

  return (
    <div className="flex justify-between align-center my-24">
      <label className="text-lg font-semibold text-gray-700 mr-6">{label}</label>

      <div className="flex">
        {state.file[name] ? (
          <span className={`${styles.filename} text-base font-medium`}>
            {state.file[name]?.name}
          </span>
        ) : null}

        <button 
          className={`${styles.upload} w-36 h-7 rounded ml-16 mr-8`}
          onClick={() => ref.current?.click()}>
          <span className="text-base font-medium">Choose File</span>
        </button>

        <a href={template} download>
          <div className={`${styles.template}`}>
            <FontAwesomeIcon icon={faDownload} size="xs" />
            <span className="text-xs font-medium ml-1">Template</span>
          </div>
        </a>
      </div>

      <input 
          type="file" 
          accept=".csv"
          ref={ref}
          onChange={onFileUpload}
          hidden />
    </div>
  )
}

async function parse(file: FormState['file']) {
  const fileHeaders = {
    projectInfo: ['students', 'subject', 'committees', 'title'],
    rooms: ['name', 'link'],
    enrollment: ['student', 'courses'],
    courseSchedule: ['course', 'courseSchedule'],
  }

  const config = {
    header: true,
    skipEmptyLines: true,
  }
  let text: string

  type ProjectData = {
    students: string
    subject: string
    committees: string
    advisor: string
    title: string
  }
  text = file.projectInfo ? await file.projectInfo.text() : ''
  const projects = Papa
    .parse<ProjectData>(text, {
      ...config,
      transformHeader: (_, index) => fileHeaders.projectInfo[index],
    })
    .data
    .map(({students, subject, committees, title}) => ({
      students: students.split(/\s+/),
      subject,
      committees: committees.split(/\s+/).map((c) => c.toLowerCase()), // toLowerCase ?
      advisor: committees.split(/\s+/)[0].toLowerCase(),
      title,
    }))

  type RoomData = {
    name: string
    link: string
  }
  text = file.rooms ? await file.rooms.text() : ''
  const rooms = Papa
    .parse<RoomData>(text, {
      ...config,
      transformHeader: (_, index) => fileHeaders.rooms[index]
    })
    .data
    .map(({name, link}) => ({
      name,
      link: link.length === 0 ? undefined : link
    }))

  type EnrollmentData = {
    student: string
    courses: string
  }
  text = file.enrollment ? await file.enrollment.text() : ''
  const enrollments = Papa
    .parse<EnrollmentData>(text, {
      ...config,
      transformHeader: (_, index) => fileHeaders.enrollment[index]
    })
    .data
    .map(({student, courses}) => ({
      student,
      courses: courses.split(/\s+/)
    }))

  type CourseScheduleData = {
    course: string
    courseSchedule: string
  }
  text = file.courseSchedule ? await file.courseSchedule.text() : ''
  const courseSchedules = Papa
    .parse<CourseScheduleData>(text, {
      ...config,
      transformHeader: (_, index) => fileHeaders.courseSchedule[index]
    })
    .data
    .map(({course, courseSchedule}) => ({
      course,
      courseSchedule: courseSchedule !== '' ? courseSchedule.split(/\s+/) : []
    }))

  return {
    projects,
    rooms,
    enrollments,
    courseSchedules,
  }
}

function validate({
  term,
  academicYear,
  dates,
  file
}: FormState) {
  // TODO: return errors
  return (
    (/^[0-9]{1}\/[0-9]{4}$/.test(`${term}/${academicYear}`)) &&
    (true) && // check type
    (dates.length !== 0) &&
    (file.projectInfo !== null) &&
    (file.rooms !== null) &&
    (file.enrollment !== null) &&
    (file.courseSchedule !== null)
  )
}