import '../styles/globals.sass'
import type { AppProps } from 'next/app'
import {ModalPlaceholder} from '../components/Modal'
import {ModalProvider} from '../hooks/useModal'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ModalProvider>
        <Component {...pageProps} />
        <ModalPlaceholder />
      </ModalProvider>
    </>
  )
}

export default MyApp
