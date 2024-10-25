import React from 'react';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CImg } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useDispatch } from 'react-redux';

import { startLogout } from 'src/actions/auth';

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
     dispatch(startLogout());
  }
   
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'../avatars/user-unknow.jpg'}
            className="c-avatar-img"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center" >
          <strong>Settings</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />Profile
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-settings" className="mfe-2" />
          Settings
        </CDropdownItem>        
        <CDropdownItem divider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
