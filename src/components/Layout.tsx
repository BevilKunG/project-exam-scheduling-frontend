import {FC} from 'react'
import Navbar from './Navbar'

const Layout: FC = ({children}) => {
  return (
    <div className="w-screen h-screen">
      <Navbar />
      {children}
    </div>
  )
}

export default Layout