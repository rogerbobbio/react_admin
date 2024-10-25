import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <span className="ml-1">&copy; 2021 Roger Bobbio.</span>
      </div>
      <div className="mfs-auto">
        
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
