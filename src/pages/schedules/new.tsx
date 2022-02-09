import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {NextPage} from 'next'
import Image from 'next/image'
import {DatePicker, Layout} from '../../components'
import useForm, {FormActionType, FormFileName, FormProvider, FormStep} from '../../hooks/useForm'
import styles from '../../styles/ScheduleFormPage.module.sass'
import {ChangeEvent, createRef} from 'react'
import {gql, useMutation} from '@apollo/client'
// import readInfo from '../../utils/read-info'

const CREATE_INFORMATION = gql`
  mutation CreateInformation($arg: CreateInformationInput!) {
    createInformation(arg: $arg) {
      schedule {
        _id
      }
      sessions {
        _id
      }
    }
  }
`

const ScheduleFormPage: NextPage = () => {
  return (
    <Layout>
      <div className={`${styles.container} pt-2`}>
        <h1 className="text-3xl font-semibold text-gray-700 text-center">Create exam schedule</h1>

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
              <option value="MIDTERM">Midterm</option>
              <option value="FINAL">Final</option>
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
  const {state, dispatch} = useForm()
  const items = [
    {name: FormFileName.ProjectInfo, label: 'Project information', template: '/templates/project-info.csv'},
    {name: FormFileName.Rooms, label: 'Rooms', template: '/templates/rooms.csv'},
    {name: FormFileName.Enrollment, label: 'Enrollment', template: '/templates/enrollment.csv'},
    {name: FormFileName.CourseSchedule, label: 'Course schedule', template: '/templates/course-schedule.csv'},
  ]

  const [createInformation, {data, loading, error}] = useMutation(CREATE_INFORMATION)
  if (loading) {
    return <h1>loading...</h1>
  }
  console.log(data)
  const onCreateClick = async () => {
    const {
      term,
      academicYear,
      type,
      dates,
      file,
    } = state

    // const [
    //   projects,
    //   rooms,
    //   enrollments,
    //   courses
    // ] = await Promise.all(items.map(({name}) => readInfo(file[name] as File, name)))
    // console.log(projects, rooms, enrollments, courses)

    // const students = projects.reduce((students, project) => [...students, ...project.students], [])
    if (file.projectInfo !== null) {
      const text = await file.projectInfo.text()
      // console.log(await neatCsv(text))
    }
    // const arg = {
    //   schedule: {
    //     semester: `${term}/${academicYear}`,
    //     for: type,
    //     dates,
    //   },
    // }
    // createInformation({
    //   variables: {arg}
    // })
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
          onClick={onCreateClick}>
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