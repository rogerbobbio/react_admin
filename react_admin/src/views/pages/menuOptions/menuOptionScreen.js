import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

import menuOptionActions from 'src/actions/menuOptionActions';
import moduleActions from 'src/actions/moduleActions';


function MenuOptionScreen(props) {    
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { title, order_no, url, module_id, getModules } = props;

    useEffect(() => {
        getModules()
    }, [getModules])

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
    
    const moduleOptions = () => {
        const modules = [...props.modules]
        modules.unshift({ id: '', title: '' })
        return modules.map((row, index) => <option key={index} value={row.id}>{row.title}</option>)
    }

    const titleScreen = isEdit() ? 'Editar Opcion de Menu' : 'Nueva Opcion de Menu'

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
                            <FormLabel>Modulo</FormLabel>
                            <FormControl id="module_id" as="select" value={module_id}
                                required onChange={onChangeControl}>
                                {moduleOptions()}
                            </FormControl>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Titulo</FormLabel>
                            <FormControl id="title" type="text" value={title}
                                placeholder="Ingrese titulo" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Url</FormLabel>
                            <FormControl id="url" type="text" value={url}
                                placeholder="Ingrese url" required onChange={onChangeControl}/>
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
    const { menuOption, module } = state

    return {
        title: menuOption.menuOption.title,
        order_no: menuOption.menuOption.order_no,
        url: menuOption.menuOption.url,
        module_id: menuOption.menuOption.module_id,
        modules: module.modules,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack())
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(menuOptionActions.updateMenuOptionProperty(propertyName, propertyValue))
        },
        create() {
            dispatch(menuOptionActions.addMenuOption())
        },
        update() {
            dispatch(menuOptionActions.updateMenuOption())
        },
        getModules() {
            dispatch(moduleActions.getModules())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuOptionScreen)