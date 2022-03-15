import {gql, useLazyQuery, useMutation} from '@apollo/client'
import {useRouter} from 'next/router'
import Error from 'next/error'
import {useEffect} from 'react'
import {
  GetScheduleEventsQuery,
  GetScheduleEventsQueryVariables,
} from '../graphql/generated'

const GET_SCHEDULE_EVENTS = gql`
  query GetScheduleEvents($scheduleId: String!) {
    schedule(id: $scheduleId) {
      _id
      projects {
        title
        committees {
          email
        }
        examination {
          session {
            date
            time {
              start
              end
            }
          }
          room {
            name
            link
          }
        }
      }
    }
  }
`

const CREATE_GOOGLE_EVENTS = gql`
  mutation CreateGoogleEvents($args: CreateGoogleEventsInput!) {
    createGoogleEvents(args: $args)
  }
`

function OAuth2CallbackPage() {
  const router = useRouter()
  const {code, state: scheduleId} = router.query
  const [getSchedule, {loading, error, data}] = useLazyQuery<GetScheduleEventsQuery, GetScheduleEventsQueryVariables>(GET_SCHEDULE_EVENTS)
  const [createGoogleEvents, {
    loading: createEventsLoading,
    error: createEventsError
  }] = useMutation(CREATE_GOOGLE_EVENTS)

  useEffect(() => {
    if (typeof scheduleId === 'string') {
      getSchedule({variables: {scheduleId}})
    }
  }, [scheduleId, getSchedule])

  useEffect(() => {
    if (data && typeof code === 'string' && typeof scheduleId === 'string') {
      const {schedule: {projects}} = data
      const events = projects
      .filter(({examination}) => (examination?.session && examination?.room))
      .map((project) => {
        if (!project.examination?.session || !project.examination?.room) {
          return null
        }

        const session = project.examination.session
        const start = `${session.date}T${session.time.start}:00+07:00`
        const end = `${session.date}T${session.time.end}:00+07:00`

        const room = project.examination.room
        return {
          summary: project.title,
          attendees: project
            .committees
            .filter((committee) => committee.email)
            .map((committee) => committee.email),
          start,
          end,
          description: `${room.name}${room.link ? `: ${room.link}` : ''}`
        }
      })
      .filter((event) => event !== null)

      createGoogleEvents({
        variables: {
          args: {
            code,
            events,
          }
        },
        onCompleted: () => {
          router.replace(`/schedules/${scheduleId}`)
        }
      })
    }
  }, [data, code, createGoogleEvents, router, scheduleId])

  if (loading || createEventsLoading) return <></>
  if (error) return <Error statusCode={500} title={error.message} />
  if (createEventsError) return <Error statusCode={500} title={createEventsError.message} />

  return <div>callback</div>
}

export default OAuth2CallbackPage