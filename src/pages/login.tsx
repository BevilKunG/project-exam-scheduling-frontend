import {gql, useMutation, useQuery} from '@apollo/client'
import { useRouter } from 'next/router'
import {useState} from 'react'
import {Layout} from '../components'
import { GetMeQuery, GetMeQueryVariables } from '../graphql/generated'
import styles from '../styles/LoginPage.module.sass'

const LOGIN = gql`
  mutation Login($args: UserInput!) {
    login (args: $args) {
      token
    }
  } 
`

const GET_ME = gql`
  query GetMe {
    me {
      _id
    }
  }
`

function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {loading: loadingMe, error: errorMe, data} = useQuery<GetMeQuery, GetMeQueryVariables>(GET_ME)
  const [login, {loading: loadingLogin, error: errorLogin}] = useMutation(LOGIN)

  if (loadingMe || loadingLogin) return <></>
  if (errorMe || errorLogin) return <></>

  if (data?.me) {
    router.replace('/schedules')
  }

  const onSubmit = () => {
    login({
      variables: {
        args: {email, password}
      },
      onCompleted: (data) => {
        const {login: {token}} = data
        localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY as string, token)
        router.replace('/schedules')
      }
    })
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={`${styles.card} shadow-xl rounded-lg`}>
          <h1 className="text-2xl text-gray-700 font-semibold text-center">Admin</h1>

          <div className="my-6">
            <label className="block text-base text-gray-700 font-medium mb-1">Email</label>
            <input 
              type="text"
              className="w-64 h-8 border rounded pl-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
          </div>

          <div className="my-6">
            <label className="block text-base text-gray-700 font-medium mb-1">Password</label>
            <input 
              type="password"
              className="w-64 h-8 border rounded pl-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
          </div>

          <button
            onClick={onSubmit}
            className={`${styles.login} rounded mt-4`}>
            <span className="text-white text-base font-semibold">Login</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default LoginPage