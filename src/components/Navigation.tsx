import {NextPage} from 'next'
import {useRouter} from 'next/dist/client/router'
import Link from 'next/link'
import styled from 'styled-components'
import styles from '../styles/navigation.module.sass'

const Navigation: NextPage = () => {
  const router = useRouter()
  const currentNavigation = getCurrentNavigation(router.pathname)

  return (
    <div className={styles.navigation}>
      <Link href="/schedules/1" passHref>
        <LinkText 
          active={currentNavigation === CurrentNavigationType.SchedulePage}
          className={styles.link}>
          Schedule
        </LinkText>
      </Link>

      <Link href="/schedules/1/availability" passHref>
        <LinkText 
          active={currentNavigation === CurrentNavigationType.AvailabilityPage}
          className={styles.link}>
          Availability
        </LinkText>
      </Link>
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

enum CurrentNavigationType {
  SchedulePage = 'SCHEDULE_PAGE',
  AvailabilityPage = 'AVAILABILITY_PAGE',
}

function getCurrentNavigation(pathname: string) {
  const str = pathname.split(/\//).slice(-1)[0]
  switch (str) {
    case '[id]':
      return CurrentNavigationType.SchedulePage
    
    case 'availability':
      return CurrentNavigationType.AvailabilityPage

    default: return CurrentNavigationType.SchedulePage
  }
}