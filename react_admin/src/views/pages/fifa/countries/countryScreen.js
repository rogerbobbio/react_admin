import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

import countryActions from 'src/actions/fifa/countryActions';

function CountryScreen(props) {
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { name } = props;

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

    const title = isEdit() ? 'Editar Pais' : 'Nuevo Pais';

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
                    <Form ref={refForm} validated={validated} id='form'>
                        <FormGroup>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl id="name" type="text" value={name}
                                placeholder="Ingrese nombre del pais" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                    </Form>
              </CCardFooter>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { country } = state;

    return {
        name: country.country.name,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack());
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(countryActions.updateCountryProperty(propertyName, propertyValue));
        },
        create() {
            dispatch(countryActions.addCountry());
        },
        update() {
            dispatch(countryActions.updateCountry());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryScreen)