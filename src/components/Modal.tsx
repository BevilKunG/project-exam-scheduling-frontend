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
import { DateTime } from 'luxon'

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
  const {state} = useModal()
  // TODO: refactor
  const {info} = state

  if (!info)
    return null
    console.log(info)

  return (
    <Modal title={info.title}>
      <div className="flex flex-col justify-around h-full">
        <div className="flex">
          <FontAwesomeIcon 
            icon={faClock}
            size="1x"
            color="#5C5C5C"
            className="my-auto mr-8"
            />
          <h3 className="text-lg font-semibold text-gray-800">
            {`${DateTime.fromISO(info.examination.session.date).toFormat('ccc d LLL yyyy')}, ${info.examination.session.time.start} - ${info.examination.session.time.end}`}
          </h3>
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
              <h4 className="text-base font-medium text-gray-800">
                <span style={{marginRight: '0.25rem'}}>
                  {info.advisor.name}
                </span>
                {info
                  .committees
                  .filter(({_id}: any) => _id !== info.advisor._id)
                  .map((committee: any) => (
                    <span 
                      style={{marginRight: '0.25rem'}} 
                      key={committee.name}>
                      {committee.name}
                    </span>
                ))}
              </h4>
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
              <h4 className="text-base font-medium text-gray-800">
                {info.students.map((student: any) => (
                <span 
                  style={{marginRight: '0.25rem'}} 
                  key={student.studentId}>
                  {student.studentId}
                </span>
                ))}
              </h4>
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
              <h4 className="text-base font-medium text-gray-800">
                <span>
                  {info.examination.room.name}
                </span>
                {
                  info.examination.room.link && (
                    <>
                      <span>{': '}</span>
                      <a
                        href={info.examination.room.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline">
                        {info.examination.room.link}
                      </a>
                    </>
                  )
                }
              </h4>
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