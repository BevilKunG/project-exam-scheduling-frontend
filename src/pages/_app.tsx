import '../styles/globals.sass'
import type {AppProps} from 'next/app'
import {ModalPlaceholder} from '../components/Modal'
import {GlobalProvider} from '../hooks/useGlobal'
import {ModalProvider} from '../hooks/useModal'
import {MockProvider} from '../hooks/useMock'
import {ScheduleProvider} from '../hooks/useSchedule'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import {setContext} from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_NODE_URI
})

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY as string)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ApolloProvider client={client}>
      <GlobalProvider>
        <ScheduleProvider>
          <MockProvider>
            <ModalProvider>
              <Component {...pageProps} />
              <ModalPlaceholder />
            </ModalProvider>
          </MockProvider>
        </ScheduleProvider>
      </GlobalProvider>
    </ApolloProvider>
  )
}

export default MyApp
