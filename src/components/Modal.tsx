import {FC} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faTimes,
  faClock,
  faUserTie,
  faUser,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'
import useModal, {ModalActionType, ModalType} from '../hooks/useModal'
import styles from '../styles/modal.module.sass'

function ModalPlaceholder() {
  const {state} = useModal()
  const {isShow, type} = state

  if (!isShow)
    return null
  
  switch(type) {
    case ModalType.Info: 
      return <InfoModal />
    case ModalType.Publish:
      return <PublishModal />
  }
}

export {ModalPlaceholder}

function InfoModal() {
  return (
    <Modal title="Project exam scheduling">
      <div className="flex flex-col justify-around h-full">
        <div className="flex">
          <FontAwesomeIcon 
            icon={faClock}
            size="1x"
            color="#5C5C5C"
            className="my-auto mr-8"
            />
          <h3 className="text-lg font-semibold text-gray-800">Mon 9 Aug 2021, 09:30 - 09:45</h3>
        </div>

        <div className="flex">
          <FontAwesomeIcon 
            icon={faUserTie}
            size="1x"
            color="#5C5C5C"
            className="mr-8"
            />
            <div>
              <h3 className="text-base font-semibold text-gray-800">Committee</h3>
              <h4 className="text-base font-medium text-gray-800">chinawat sanpawat paskorn</h4>
            </div>
        </div>

        <div className="flex">
          <FontAwesomeIcon 
            icon={faUser}
            size="1x"
            color="#5C5C5C"
            className="mr-8"
            />
            <div>
              <h3 className="text-base font-semibold text-gray-800">Student</h3>
              <h4 className="text-base font-medium text-gray-800">610610598</h4>
            </div>
        </div>

        <div className="flex">
          <FontAwesomeIcon 
            icon={faMapMarkerAlt}
            size="1x"
            color="#5C5C5C"
            className="mr-8"
            />
            <div>
              <h3 className="text-base font-semibold text-gray-800">Room</h3>
              <h4 className="text-base font-medium text-gray-800">Room 1</h4>
            </div>
        </div>
      </div>
    </Modal>
  )
}

function PublishModal() {
  return (
    <Modal title="Publish">
    </Modal>
  )
}

interface ModalProps {
  title: string
}

const Modal: FC<ModalProps> = ({
  title,
  children,
}) => {
  const {dispatch} = useModal()

  function onClose() {
    dispatch({
      type: ModalActionType.Close
    })
  }

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>

          <button onClick={onClose}>
            <FontAwesomeIcon 
              icon={faTimes}
              size="lg"
              color="white" />
          </button>
        </div>

        <div className={styles.body}>
          {children}
        </div>
      </div>

      <div className={styles.background} />
    </>
  )
}