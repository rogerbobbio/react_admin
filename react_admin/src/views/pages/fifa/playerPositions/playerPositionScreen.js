import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

import playerPositionActions from 'src/actions/fifa/playerPositionActions';

function PlayerPositionScreen(props) {
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { description } = props;

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

    const title = isEdit() ? 'Editar Posicion' : 'Nueva Posicion';

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
                            <FormLabel>Descripcion</FormLabel>
                            <FormControl id="description" type="text" value={description}
                                placeholder="Ingrese descripcion de la posicion" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                    </Form>
              </CCardFooter>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { playerPosition } = state;

    return {
        description: playerPosition.playerPosition.description,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack());
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(playerPositionActions.updatePlayerPositionProperty(propertyName, propertyValue));
        },
        create() {
            dispatch(playerPositionActions.addPlayerPosition());
        },
        update() {
            dispatch(playerPositionActions.updatePlayerPosition());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerPositionScreen)