import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { FormCheck } from 'react-bootstrap';
import { Form, FormControl, FormGroup, FormLabel, Col } from 'react-bootstrap';

import permissionActions from 'src/actions/permissionActions';


function PermissionScreen(props) {    
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { access, created, edit, deleted, role_id, module_id, screen_id,
            roleOptions, moduleOptions, screenOptions } = props;

    const isEdit = () => {       
        if (params.id === 'new')
           return false
        return true
     }

     const cancel = () => {
        props.cancel()
    }

    const save = (event) => {
        const form = refForm.current;
        if (form.checkValidity() === true) {
            if (isEdit())
               props.update()
            else
               props.create()
        }
        setValidated(true);
        event.preventDefault();
        event.stopPropagation();
    }
    
    const onChangeControl = (e) => {
        if (e.currentTarget.type === 'checkbox')
          props.setControlValue(e.currentTarget.id, e.currentTarget.checked ? 1 : 0)
        else
          props.setControlValue(e.currentTarget.id, e.currentTarget.value)
      }

    const titleScreen = isEdit() ? 'Editar Modulo' : 'Nuevo Modulo'

    return (
        <> 
          <CCard>
              <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>{titleScreen}</h1>
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
                    <Form ref={refForm} validated={validated} id='form'>
                        <Form.Row>
                            <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Rol</FormLabel>
                                    <FormControl id="role_id" as="select" value={role_id} disabled={isEdit()} required onChange={onChangeControl}>
                                        {roleOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Módulo</FormLabel>
                                    <FormControl id="module_id" as="select" value={module_id} disabled={isEdit()} required onChange={onChangeControl}>
                                        {moduleOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Opción</FormLabel>
                                    <FormControl id="screen_id" as="select" value={screen_id} disabled={isEdit()} required onChange={onChangeControl}>
                                        {screenOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>                                
                            </FormGroup>
                            <FormGroup as={Col} className="text-center">
                                <FormGroup>
                                    <FormLabel>Acceso</FormLabel>
                                    <FormCheck id="access" checked={access === 1} onChange={onChangeControl} />
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Crear</FormLabel>
                                    <FormCheck id="created" checked={created === 1} onChange={onChangeControl} />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Editar</FormLabel>
                                    <FormCheck id="edit" checked={edit === 1} onChange={onChangeControl} />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Borrar</FormLabel>
                                    <FormCheck id="deleted" checked={deleted === 1} onChange={onChangeControl} />
                                </FormGroup>
                            </FormGroup>
                        </Form.Row>
                    </Form>
              </CCardFooter>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { permission } = state;

    const rolesSelector = state => state.role.userRoles
    const moduleSelector = state => state.module.modules
    const screenSelector = state => state.menuOption.menuOptions
    const selectedModuleId = state => state.permission.permission.module_id ? +state.permission.permission.module_id : 0

    const getRoleOptions = createSelector(
        rolesSelector, r => {
          const l = r.map(x => ({ value: x.id, description: x.description }))
          l.unshift({ value: '', description: '' })
          return l
        }
      )
      
      const getModuleOptions = createSelector(
        moduleSelector, r => {
          const l = r.map(x => ({ value: x.id, description: x.title }))
          l.unshift({ value: '', description: '' })
          return l
        }
      )
      
      const getScreenOptions = createSelector(
        [screenSelector, selectedModuleId], (r, id) => {
          const l = r.filter(x => x.module_id === id).map(x => ({ value: x.id, description: x.title }))
          l.unshift({ value: '', description: '' })
          return l
        }
      )

    return {
        role_id: permission.permission.role_id,
        module_id: permission.permission.module_id,
        screen_id: permission.permission.screen_id,
        access: permission.permission.access,
        created: permission.permission.created,
        edit: permission.permission.edit,
        deleted: permission.permission.deleted,
        roleOptions: getRoleOptions(state),
        moduleOptions: getModuleOptions(state),
        screenOptions: getScreenOptions(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack());
        },        
        setControlValue(propertyName, propertyValue) {
            dispatch(permissionActions.updatePermissionProperty(propertyName, propertyValue));
        },
        create() {
          dispatch(permissionActions.addPermmission())
        },
        update() {
          dispatch(permissionActions.updatePermission())
        }
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PermissionScreen)