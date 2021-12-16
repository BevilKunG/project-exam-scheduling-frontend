import '../styles/globals.sass'
import type {AppProps} from 'next/app'
import {ModalPlaceholder} from '../components/Modal'
import {GlobalProvider} from '../hooks/useGlobal'
import {ModalProvider} from '../hooks/useModal'
import {MockProvider} from '../hooks/useMock'

function MyApp({Component, pageProps}: AppProps) {
  return (
    <GlobalProvider>
      <MockProvider>
        <ModalProvider>
          <Component {...pageProps} />
          <ModalPlaceholder />
        </ModalProvider>
      </MockProvider>
    </GlobalProvider>
  )
}

export default MyApp
