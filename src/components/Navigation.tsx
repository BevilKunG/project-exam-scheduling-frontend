import {NextPage} from 'next'
import {useRouter} from 'next/dist/client/router'
import Link from 'next/link'
import styled from 'styled-components'
import useGlobal, {GlobalActionType, TableType} from '../hooks/useGlobal'
import styles from '../styles/navigation.module.sass'

function Navigation() {
  const {state: {table}, dispatch} = useGlobal()
  const onNavigate = (table: TableType) => {
    dispatch({
      type: GlobalActionType.SetTable,
      payload: {table}
    })
  }

  return (
    <div className={styles.navigation}>
      <button onClick={() => onNavigate(TableType.Schedule)}>
        <LinkText 
          active={table === TableType.Schedule}
          className={styles.link}>
          Schedule
        </LinkText>
      </button>

      <button onClick={() => onNavigate(TableType.Availability)}>
        <LinkText 
          active={table === TableType.Availability}
          className={styles.link}>
          Availability
        </LinkText>
      </button>
    </div>
  )
}

export default Navigation

interface LinkTextProps {
  active: boolean
}

const LinkText = styled.span<LinkTextProps>`
  ${({active}) => active ? `
  border-bottom: 3px solid #0496FF;
  color: #0496FF;
  ` : null}
`