import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';

function ConfirmModal({ show, title, description, handleShow, handleAction}) {

  return <CModal show={show} onClose={() => handleShow(false)}>
    <CModalHeader closeButton>
      <CModalTitle>{title}</CModalTitle>
    </CModalHeader>

    <CModalBody>
      <p>{description}</p>
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" onClick={handleAction}>Yes</CButton>
      <CButton color="primary" onClick={() => handleShow(false)}>No</CButton>
    </CModalFooter>
  </CModal>
}

export default ConfirmModal