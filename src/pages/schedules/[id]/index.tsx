import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faShare} from '@fortawesome/free-solid-svg-icons'
import {DragDropContext} from '../../../utils/dnd-dynamic'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {
  Layout,
  Schedule,
  Navigation,
  Menu,
} from '../../../components'
import styles from '../../../styles/SchedulePage.module.sass'
import useGlobal, {GlobalActionType} from '../../../hooks/useGlobal'
import {NextPage} from 'next'
import {gql, useLazyQuery} from '@apollo/client'
import {
  GetScheduleQuery,
  GetScheduleQueryVariables,
  ScheduleStatus,
} from '../../../graphql/generated'
import {DropResult} from 'react-beautiful-dnd'
import useSchedule, { ScheduleActionType } from '../../../hooks/useSchedule'

const GET_SCHEDULE = gql`
  query GetSchedule($scheduleId: String!) {
    schedule(id: $scheduleId) {
      _id
      semester
      for
      dates
      projects {
        _id
        title
        subject
        examination {
          _id
          session {
            _id
          }
          room {
            _id
          }
        }
      }
      sessions {
        _id
        date
        time {
          start
          end
        }
      }
      rooms {
        _id
        name
      }
      status
    }
  }
`

const SchedulePage: NextPage = () => {
  const router = useRouter()
  const {id: scheduleId} = router.query

  const [getSchedule, {loading, error, data}] = useLazyQuery<GetScheduleQuery, GetScheduleQueryVariables>(GET_SCHEDULE)
  useEffect(() => {
    if (typeof scheduleId === 'string') {
      getSchedule({
        variables: {scheduleId},
      })
    }
  }, [scheduleId, getSchedule])

  const {state, dispatch} = useSchedule()
  console.log(state)
  useEffect(() => {
    if (data) {
      const examinations = data.schedule.projects.map(({_id, examination}) => ({
        projectId: _id,
        sessionId: examination ? examination.session._id : null,
        roomId: examination ? examination.room._id : null,
      }))
      dispatch({
        type: ScheduleActionType.SetExaminations,
        payload: {examinations},
      })
    }
  }, [data, dispatch])

  // handle query result
  if (!scheduleId || !data) {
    return <></>
  }

  if (loading) {
    return <h1>loading...</h1>
  }

  if (error) {
    return <h1>error</h1>
  }

  if (!data.schedule) {
    return <></>
  }

  const {schedule} = data
  if (schedule.status !== ScheduleStatus.Ready) {
    return <WaitingPage />
  }

  const onDragEnd = (result: DropResult) => {
    const {destination, source, draggableId} = result

    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return
    if (destination.droppableId === 'initial') {
      dispatch({
        type: ScheduleActionType.MoveProject,
        payload: {examination: {projectId: draggableId, sessionId: null, roomId: null}}
      })
    }

    const [sessionId, roomId] = destination.droppableId.split(',')
    const exist = schedule.projects.filter(({examination}) => (
      examination && 
      examination.session._id === sessionId &&
      examination.room._id === roomId
    )).length !== 0
    if (exist) return

    const examination = {
      projectId: draggableId,
      sessionId,
      roomId,
    }

    dispatch({
      type: ScheduleActionType.MoveProject,
      payload: {examination}
    })
  }

  const title = `CPE/ISNE Project ปลายภาค ${schedule.semester}`

  return (
    <Layout>
      <div className={styles.background}>
        <Navigation />
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.container}>
            <Menu schedule={schedule} />

            <div>
              <div className="flex flex-row justify-between align-center ml-16 mb-4">
                <h1 className="text-2xl text-gray-700 font-semibold">{title}</h1>
                <button className={`${styles.publish} shadow-md`}>
                  <FontAwesomeIcon icon={faShare} size="lg" />
                  <span className="ml-1">Publish</span>
                </button>
              </div>

              <Schedule schedule={schedule}/>
            </div>
          </div>
        </DragDropContext>
        <Bottom />
      </div>
    </Layout>
  )
}

export default SchedulePage

function Bottom() {
  const {state, dispatch} = useGlobal()
  const {isEditMode} = state
  
  return (
    <div className={styles.bottom}>
      <div className="flex flex-row justify-end align-center pt-6">
        {
          !isEditMode ? (
            <button 
              className={`${styles.edit} shadow-md`}
              onClick={() => dispatch({type: GlobalActionType.EditModeOn})}>
                Edit
            </button>
          ): (
            <>
              <button 
                className={`${styles.cancel} mr-10`}
                onClick={() => dispatch({type: GlobalActionType.EditModeOff})}>
                  Cancel
              </button>

              <button 
                className={`${styles.save} shadow-md`}
                onClick={() => dispatch({type: GlobalActionType.EditModeOff})}>
                  Save
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}

function WaitingPage() {
  return (
    <Layout>
      <h1>waiting...</h1>
      <button>refresh</button>
    </Layout>
  )
}