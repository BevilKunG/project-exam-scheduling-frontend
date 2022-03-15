import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faShare, faRedoAlt, faDownload, faUpload, faSyncAlt, faTimes, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import {DragDropContext} from '../../../utils/dnd-dynamic'
import Error from 'next/error'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {
  Layout,
  Schedule,
  Navigation,
  Menu,
} from '../../../components'
import styles from '../../../styles/SchedulePage.module.sass'
import useGlobal, {GlobalActionType, TableType, ViewType} from '../../../hooks/useGlobal'
import {NextPage} from 'next'
import {gql, useLazyQuery, useMutation, useQuery} from '@apollo/client'
import {
  GetScheduleQuery,
  GetScheduleQueryVariables,
  MutationRefreshTeamupArgs,
  ScheduleStatus,
  UpdateExaminationsMutation,
  UpdateExaminationsMutationVariables,
} from '../../../graphql/generated'
import {DragStart, DropResult} from 'react-beautiful-dnd'
import useSchedule, {ScheduleActionType} from '../../../hooks/useSchedule'

const GET_SCHEDULE = gql`
  query GetSchedule($scheduleId: String!) {
    schedule(id: $scheduleId) {
      _id
      semester
      for
      dates
      status
      published
      projects {
        _id
        title
        subject
        students {
          _id
          studentId
          availability {
            sessions {
              _id
            }
          }
        }
        committees {
          _id
          name
          availability(scheduleId: $scheduleId) {
            sessions {
              _id
            }
          }
        }
        advisor {
          _id
          name
          availability(scheduleId: $scheduleId) {
            sessions {
              _id
            }
          }
        }
        examination {
          _id
          session {
            _id
            date
            time {
              start
              end
            }
          }
          room {
            _id
            name
            link
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
        link
      }
      students {
        _id
        studentId
        availability {
          sessions {
            _id
          }
        }
      }
    }
    committees {
        _id
        name
        availability(scheduleId: $scheduleId) {
          sessions {
            _id
          }
        }
    }
    me {
      _id
    }
  }
`
const UPDATE_EXAMINATIONS = gql`
  mutation UpdateExaminations($args: UpdateExaminationsInput!) {
    updateExaminations(args: $args) {
      _id
      project {
        _id
      }
      session {
        _id
      }
      room {
        _id
      }
    }
  }
`
const RESFRESH_TEAMUP = gql`
  mutation RefreshTeamup($scheduleId: String!) {
    refreshTeamup(scheduleId: $scheduleId) {
      _id
    }
  }
`
const RE_SCHEDULING = gql`
  mutation ReScheduling($scheduleId: String!) {
    scheduling(scheduleId: $scheduleId)
  }
`
const UPDATE_SCHEDULE_PUBLISHED = gql`
  mutation UpdateSchedulePublished($args: UpdateSchedulePublishedInput!) {
    updateSchedulePublished(args: $args) {
      _id
      published
    }
  }
`

const GET_GOOGLE_AUTH_URL = gql`
  query GetGoogleAuthUrl($scheduleId: String!) {
    googleAuthUrl(scheduleId: $scheduleId)
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
  // console.log(state)
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
    return <Layout></Layout>
  }

  if (loading) return <Layout></Layout>

  if (error) {
    return <Error statusCode={500} title={error.message} />
  }

  if (!data.schedule || !data.committees) {
    return <Layout></Layout>
  }

  const {schedule, committees} = data
  if (schedule.status !== ScheduleStatus.Ready) {
    return <WaitingPage />
  }
  // console.log(schedule)

  const onDragStart = (result: DragStart) => {
    const {draggableId} = result
    dispatch({
      type: ScheduleActionType.Drag,
      payload: {dragging: draggableId}
    })
  }
  const onDragEnd = (result: DropResult) => {
    const {destination, source, draggableId} = result
    dispatch({
      type: ScheduleActionType.Drag,
      payload: {dragging: null}
    })

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
    const exist = state.examinations.filter((examination) => (
      examination.sessionId=== sessionId 
      && examination.roomId === roomId
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
        <DragDropContext 
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}>
          <div className={styles.container}>
            <Menu {...{schedule, committees}} />

            <div>
              <div className="flex flex-row justify-between align-center mb-4">
                <h1 className="text-2xl text-gray-700 font-semibold">{title}</h1>
                {data.me && <TopButtons schedule={schedule} />}
              </div>

              <Schedule {...{schedule, committees}}/>
            </div>
          </div>
        </DragDropContext>
        {data.me && <BottomButtons {...{schedule}}/>}
      </div>
    </Layout>
  )
}

export default SchedulePage

interface TopButtonsProps {
  schedule: GetScheduleQuery['schedule']
}
function TopButtons({schedule}: TopButtonsProps) {
  const router = useRouter()

  const {state: {editmode, table, view}} = useGlobal()
  // split components
  const {
    loading: googleAuthLoading,
    error: googleAuthError,
    data: googleAuthData,
  } = useQuery(GET_GOOGLE_AUTH_URL, {
    variables: {
      scheduleId: schedule._id
    }
  })

  const [refreshTeamup, {
    loading: loadingTeamup, 
    error: errorTeamup,
  }] = useMutation<MutationRefreshTeamupArgs>(RESFRESH_TEAMUP)

  const [rescheduling, {
    loading: loadingScheduling,
    error: errorScheduling,
  }] = useMutation(RE_SCHEDULING)

  const [updatePublished, {
    loading: loadingPublished,
    error: errorPublished,
  }] = useMutation(UPDATE_SCHEDULE_PUBLISHED)

  if (loadingTeamup || loadingScheduling || loadingPublished || googleAuthLoading) return <></>
  if (errorTeamup || errorScheduling || errorPublished || googleAuthError) return <></>

  const onRefreshTeamup = () => {
    refreshTeamup({
      variables: {scheduleId: schedule._id},
      update(cache) {
        // update cache
        cache.reset()
      }
    })
  }
  
  const onEdit = () => {
    router.push(`/schedules/${schedule._id}/edit`)
  }

  const onReScheduling = () => {
    rescheduling({
      variables: {scheduleId: schedule._id},
      update(cache) {
        // update cache
        cache.reset()
      },
      onCompleted() {
        router.reload()
      }
    })
  }

  const onPublish = (published: boolean) => {
    updatePublished({
      variables: {
        args: {
          scheduleId: schedule._id,
          published,
        }
      },
      update(cache) {
        cache.reset()
      }
    })
  }

  const onPushCalendar = () => {
    const {googleAuthUrl} = googleAuthData
    router.push(googleAuthUrl)
  }


  switch (table) {
    case TableType.Schedule: {
      return !editmode ? (
        schedule.published ? (
          <div>
            <button
              onClick={onPushCalendar}
              className={`${styles.publish} shadow-md mr-4`}>
              Push Calendar
            </button>
            <button
              onClick={() => onPublish(false)}
              className={`${styles.unpublish} shadow-md`}>
              <FontAwesomeIcon icon={faEyeSlash} size="lg" />
              <span className="ml-1">Unpublish</span>
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={onPushCalendar}
              className={`${styles.publish} shadow-md mr-4`}>
              Push Calendar
            </button>

            <button
              onClick={() => onPublish(true)}
              className={`${styles.publish} shadow-md`}>
              <FontAwesomeIcon icon={faShare} size="lg" />
              <span className="ml-1">Publish</span>
            </button>
          </div>
        )
      ) : (
        <button
          onClick={onReScheduling}
          className={`${styles.scheduling} shadow-md`}>
          <FontAwesomeIcon icon={faRedoAlt} size="lg" />
          <span className="ml-1">Re-Scheduling</span>
        </button>
      )
    }

    case TableType.Availability: {
      return view.type === ViewType.Committee ? (
        <button
          onClick={onRefreshTeamup}
          className={`${styles.refresh} shadow-md`}>
          <FontAwesomeIcon icon={faSyncAlt} size="lg" />
          <span className="ml-1">Refresh</span>
        </button>
      ) : (
        <></>
        // <button
        //   onClick={onEdit}
        //   className={`${styles.setting} shadow-md`}>
        //   <span className="ml-1">Edit</span>
        // </button>
      )
    }
  }
}

interface BottomButtonsProps {
  schedule: GetScheduleQuery['schedule']
}
function BottomButtons({
  schedule,
}: BottomButtonsProps) {
  const router = useRouter()
  const {state: {editmode, table}, dispatch: dispatchGlobal} = useGlobal()

  const {state: scheduleState, dispatch: dispatchSchedule} = useSchedule()
  const {original, examinations} = scheduleState

  const [updateExamination, {loading, error, data}] = useMutation<UpdateExaminationsMutation, UpdateExaminationsMutationVariables>(
    UPDATE_EXAMINATIONS, {
      update(cache) {
        // TODO: manage local state instead
        cache.reset()
        router.reload()
        // dispatchSchedule({
        //   type: ScheduleActionType.SetExaminations,
        //   payload: {examinations}
        // })
        // dispatchGlobal({type: GlobalActionType.EditModeOff})
      }
    }
  )

  if (loading) {
    return <></>
  }

  if (error) {
    return <></>
  }

  // original and examination should be same order
  const changed = examinations
    .reduce((b, examination, index) => {
      return b 
        || (examination.sessionId !== original[index].sessionId)
        || (examination.roomId !== original[index].roomId)
        // || (examination.projectId !== original[index].projectId)
    }, false)

  const onCancel = () => {
    dispatchSchedule({
      type: ScheduleActionType.SetExaminations,
      payload: {examinations: original}
    })
    dispatchGlobal({type: GlobalActionType.TurnEditModeOff})
  }

  const onSave = () => {
    const diffs = examinations
      .filter((e, index) => (
        e.projectId === original[index].projectId && (
          e.sessionId !== original[index].sessionId
          || e.roomId !== original[index].roomId
        )
      ))
    // update examination
    updateExamination({
      variables: {
        args: {examinations: diffs, scheduleId: schedule._id}
      }
    })
  }

  switch (table) {
    case TableType.Schedule: {
      return (
        <div className={styles.bottom}>
          <div className="flex flex-row justify-end align-center pt-6">
            {
              !editmode ? (
                <button 
                  className={`${styles.edit} shadow-md`}
                  onClick={() => dispatchGlobal({type: GlobalActionType.TurnEditModeOn})}>
                    Edit
                </button>
              ) : (
              !changed ? (
                <button 
                  className={`${styles.cancel} shadow-md`}
                  onClick={() => dispatchGlobal({type: GlobalActionType.TurnEditModeOff})}>
                    Back
                </button>
              ): (
                <>
                  <button 
                    className={`${styles.cancel} mr-10`}
                    onClick={onCancel}>
                      Cancel
                  </button>
    
                  <button 
                    className={`${styles.save} shadow-md`}
                    onClick={onSave}>
                      Save
                  </button>
                </>
                )
              )
            }
          </div>
        </div>
      )
    }

    case TableType.Availability: return <div className={styles.bottom} />
  }
}

function WaitingPage() {
  const router = useRouter()
  const onRefresh = () => {
    router.reload()
  }

  return (
    <Layout>
      <div className={styles.waiting}>
        <div>
          <Image 
            src="/waiting.svg"
            alt="waiting" 
            width={500}
            height={250}/>

          <div className="text-center mt-6">
            <h1 className="text-xl text-gray-700 font-semibold">Please wait for scheduling</h1>
            <button
              onClick={onRefresh}
              className={styles.refresh}>
              <FontAwesomeIcon icon={faRedoAlt} />
              <span className="text-base font-medium ml-1">refresh</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}