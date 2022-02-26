import {gql, useApolloClient, useQuery} from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetMeQuery, GetMeQueryVariables } from '../graphql/generated'
import styles from '../styles/navbar.module.sass'

const GET_ME = gql`
  query GetMe {
    me {
      _id
    }
  }
`

function Navbar() {
  const router = useRouter()
  const client = useApolloClient()
  const {loading, error, data} = useQuery<GetMeQuery, GetMeQueryVariables>(GET_ME)
  if (loading) return <></>
  if (error) return <></>

  const onLogout = async () => {
    localStorage.removeItem('project-exam-scheduling-token')
    await client.resetStore()
    router.replace('/schedules')
  }

  return (
    <div className={`${styles.navbar} w-full h-12 px-16 py-2`}>
      <div className="flex justify-between my-auto ">
        <div className="flex my-auto">
          <Link href="/schedules" passHref>
            <h1 className={`${styles.brand} text-xl font-medium cursor-pointer`}>
              <span className="text-white">ProjX</span>
              <span className={styles.scheduling}>S</span>
            </h1>
          </Link>

          <div className="ml-10 flex justify-around">
            <Link href="/schedules" passHref>
              <h2 className="text-lg font-medium text-white cursor-pointer">Home</h2>
            </Link>
          </div>
        </div>

        <div>
          {
            data?.me ? (
              <button 
                onClick={onLogout}
                className="text-lg font-medium text-white">Logout</button>
            ) : (
              <Link href="/login" passHref>
                <button className={`${styles.admin} rounded`}>
                  <span className="text-lg font-medium text-white">Admin</span>
                </button>
              </Link>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar