import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload} from '@fortawesome/free-solid-svg-icons'
import {NextPage} from 'next'
import {Layout} from '../../components'
import useForm, {FormActionType, FormProvider, FormStep} from '../../hooks/useForm'
import styles from '../../styles/ScheduleFormPage.module.sass'

const ScheduleFormPage: NextPage = () => {
  return (
    <Layout>
      <div className="pt-2">
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
  const {dispatch} = useForm()
  return (
    <div className={styles.form}>
      <div className="my-8">
        <label className="block text-lg font-semibold text-gray-700">Semester</label>
        <div className="mt-2">
          <input 
            type="text" 
            className="w-16 px-4 py-1 text-lg border border-gray-400 rounded mr-16"
            maxLength={1}
            />
          <input 
            type="text" 
            className="w-24 px-4 py-1 text-lg border border-gray-400 rounded"
            maxLength={4}
            />
        </div>
      </div>

      <div className="my-8">
        <label className="block text-lg font-semibold text-gray-700">Type</label>
        <div className="mt-2">
          <select className="w-64 px-4 py-1 text-lg border border-gray-400 rounded">
            <option value="MIDTERM">Midterm</option>
            <option value="FINAL">Final</option>
          </select>
        </div>
      </div>

      {/* <div className={styles.buttons}>
        <button 
          className={`${styles.next} w-16 h-8 rounded`}
          onClick={() => dispatch({type: FormActionType.Next})}>
            <span className="text-lg font-semibold">Next</span>
        </button>
      </div> */}
    </div>
  )
}

function SecondForm() {
  const {dispatch} = useForm()
  return (
    <div className={styles.form}>
      <div>
        <label className="mr-8">Project information</label>
        <button className={`${styles.template} px-4 rounded-full mr-24`}>
          <FontAwesomeIcon icon={faDownload} size="xs" />
          <span className="text-xs font-medium ml-1">Template</span>
        </button>
        <input type="file" className={styles.upload} accept=".csv" />
      </div>

      <div>
        <button 
          className={`${styles.back} w-16 h-8 rounded`}
          onClick={() => dispatch({type: FormActionType.Back})}>
            <span className="text-lg font-semibold">Back</span>
        </button>
      </div>

    </div>
  )
}