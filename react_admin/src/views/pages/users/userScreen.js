import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel, Alert } from 'react-bootstrap';

import userActions from 'src/actions/userActions';
import roleActions from 'src/actions/roleActions';
import { passwordMustBeEqual } from 'src/helpers/validations';


function UserScreen(props) {
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);
    
    const [customValidated, setCustomValidated] = useState([])
    const { userName, email, firstName, lastName, role_id, password, img, getRoles } = props
    const [reenteredPassword, setReenteredPassword] = useState(password)
    const params = useParams();

    useEffect(() => {
        getRoles()
    }, [getRoles])

    const cancel = () => {
        props.cancel()
    }

    const save = (event) => {
        const form = refForm.current;
        if (form.checkValidity() === true && customValidation() === true) {
            if (isEdit())
                props.update();
            else
                props.create();
        }
        setValidated(true);
        event.preventDefault();
        event.stopPropagation();
    }


    const customValidation = () => {
        const customErros = []

        if (!passwordMustBeEqual(password, reenteredPassword))
            customErros.push('Las claves no son iguales.')

        setCustomValidated(customErros)
        return (customErros.length === 0)
    }

    const onChangeControl = (e) => {
        props.setControlValue(e.currentTarget.id, e.currentTarget.value)
    }

    const showAlerts = () => {
        if (customValidated.length === 0)
            return <></>

        return <Alert variant="danger">
            {customValidated.map((error, index) => <div key={index}>{error}</div>)}
        </Alert>
    }

    const roleOptions = () => {
        const l = [...props.userRoles]
        l.unshift({ id: '', description: '' })
        return l.map((r, i) => <option key={i} value={r.id}>{r.description}</option>)
    }

    const isEdit = () => {       
       if (params.id === 'new')
          return false
       return true
    }


    const title = isEdit() ? 'Editar Usuario' : 'Nuevo Usuario'

    return (
        <> 
          <CCard>
              <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>{title}</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={save}>
                                <FontAwesomeIcon icon={faSave} /> Grabar
                            </CButton>
                            <CButton shape="pill" color="secondary" onClick={cancel}>
                                <FontAwesomeIcon icon={faUndoAlt} /> Cancel
                            </CButton>
                        </div>
                    </div>
                </CRow>
              </CCardHeader>
              <CCardFooter>
                    {showAlerts()}
                    <Form ref={refForm} validated={validated} id='form'>
                        <FormGroup>
                            <FormLabel>Nombre de usuario</FormLabel>
                            <FormControl id="userName" type="text" value={userName}
                                placeholder="Ingrese nombre de usuario" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <FormControl id="email" type="email" value={email}
                                placeholder="Ingrese email" required onChange={onChangeControl} />
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Nombres</FormLabel>
                            <FormControl id="firstName" type="text" value={firstName}
                                placeholder="Ingrese nombres" required onChange={onChangeControl} />
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Apellidos</FormLabel>
                            <FormControl id="lastName" type="text" value={lastName}
                                placeholder="Ingrese apellidos" required onChange={onChangeControl} />
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Rol</FormLabel>
                            <FormControl id="role_id" as="select" value={role_id}
                                         required onChange={onChangeControl}>
                                {roleOptions()}
                            </FormControl>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Clave</FormLabel>
                            <FormControl id="password" type="password" value={password}
                                         placeholder="Ingrese clave" required onChange={onChangeControl} />
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Reingrese clave</FormLabel>
                            <FormControl id="reenteredPassword" type="password" value={reenteredPassword}
                                         placeholder="Reingrese clave" required onChange={e => setReenteredPassword(e.currentTarget.value)} />
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                    </Form>                
              </CCardFooter>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { user, role } = state
    return {
        userName: user.user.userName,
        email: user.user.email,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        password: user.user.password,
        role_id: user.user.role_id,
        error: user.error,
        userRoles: role.userRoles,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        create() {
            dispatch(userActions.addUser())
        },
        update() {
            dispatch(userActions.updateUser())
        },
        cancel() {
            dispatch(goBack())
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(userActions.updateUserProperty(propertyName, propertyValue))
        },
        getRoles() {
            dispatch(roleActions.getRoles())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)