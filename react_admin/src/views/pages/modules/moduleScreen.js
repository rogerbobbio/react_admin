import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

import moduleActions from 'src/actions/moduleActions';


function ModuleScreen(props) {    
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { title, icon, order_no } = props;

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
                props.update();
            else
                props.create();            
        }
        setValidated(true);
        event.preventDefault();
        event.stopPropagation();
    }

    const onChangeControl = (e) => {
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
                        <FormGroup>
                            <FormLabel>Titulo</FormLabel>
                            <FormControl id="title" type="text" value={title}
                                placeholder="Ingrese titulo" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Icono</FormLabel>
                            <FormControl id="icon" type="text" value={icon}
                                        placeholder="Ingrese icono" required onChange={onChangeControl} />
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Orden en el menu</FormLabel>
                            <FormControl id="order_no" type="number" value={order_no}
                                        placeholder="Ingrese orden en el menu" required onChange={onChangeControl} />
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                    </Form>
              </CCardFooter>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { module } = state

    return {
        title: module.module.title,
        icon: module.module.icon, 
        order_no: module.module.order_no,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack())
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(moduleActions.updateModuleProperty(propertyName, propertyValue))
        },
        create() {
            dispatch(moduleActions.addModule())
        },
        update() {
            dispatch(moduleActions.updateModule())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModuleScreen)