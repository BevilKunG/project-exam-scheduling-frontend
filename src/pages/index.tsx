import { useEffect } from 'react'
import useModal, { ModalActionType } from '../hooks/useModal'

function Home() {
  const {dispatch} = useModal()
  useEffect(() => {
    dispatch({
      type: ModalActionType.OpenInfo
    })
  }, [])
  return (
    <div>
    </div>
  )
}

export default Home