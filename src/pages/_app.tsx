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
  InMemoryCache,
} from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
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
