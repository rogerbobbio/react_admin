import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CInput, CInputGroup, CInputGroupPrepend, CInputGroupText,
         CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useDispatch  } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash  } from '@fortawesome/free-solid-svg-icons';

import { useForm } from '../../../hooks/useForm';
import { startLogin } from '../../../actions/auth';

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setshowPassword] = useState(false);

  const [ formLoginValues, handleLoginInputChange ] = useForm({
      loginEmail: localStorage.getItem('email') || '',
      loginPassword: '',
      remember: localStorage.getItem('rememberMe') || false
  });

  const {loginEmail, loginPassword, remember} = formLoginValues;

    const handleLogin = (e) => {
        e.preventDefault();
        //console.log('formLoginValues', formLoginValues);
        dispatch(startLogin(loginEmail, loginPassword));

        // VALIDACIONES ************************************************************************
        
        /*************************************************************************************** */

        // Se realiza la grabacion del formulario
        if (remember) { 
            localStorage.setItem('email', loginEmail);
            localStorage.setItem('rememberMe', true);
        } else {
            localStorage.removeItem('email');
            localStorage.removeItem('rememberMe');
        }
    }


  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={ handleLogin } className="was-validated">
                    <h1>Login</h1>
                    <p className="text-muted">Iniciar sesión con tu correo y clave</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" 
                              placeholder="Correo"
                              name='loginEmail'
                              value={ loginEmail }
                              onChange={ handleLoginInputChange }
                              required />                                          
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type={showPassword ? 'text' : 'password'}
                              placeholder="Clave"
                              name='loginPassword'
                              value={ loginPassword }
                              onChange={ handleLoginInputChange }
                              required />
                        <span className="input-group-text" id="basic-addon" 
                                      onClick={() => setshowPassword(!showPassword)}>
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </span>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="3">
                        <CButton type='submit' color="primary" className="px-4">Login</CButton>
                      </CCol>                      
                      <CCol xs="6" className="text-right">
                        <input type="checkbox" 
                               name="remember"                               
                               defaultChecked={remember}
                               onChange={handleLoginInputChange}
                                        />
                         <span> Recuerdame </span>
                      </CCol>
                    </CRow>                    
                  </CForm>
                </CCardBody>
              </CCard>              
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
