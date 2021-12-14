import '../styles/globals.sass'
import type { AppProps } from 'next/app'
import {ModalPlaceholder} from '../components/Modal'
import {GlobalProvider} from '../hooks/useGlobal'
import {ModalProvider} from '../hooks/useModal'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalProvider>
        <ModalProvider>
          <Component {...pageProps} />
          <ModalPlaceholder />
        </ModalProvider>
      </GlobalProvider>
    </>
  )
}

export default MyApp
