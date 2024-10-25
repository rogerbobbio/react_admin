import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

import playerZoneActions from 'src/actions/fifa/playerZoneActions';
import playerPositionActions from 'src/actions/fifa/playerPositionActions';


function PlayerZoneScreen(props) {
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { description, player_position_id, getPlayerPositions } = props;

    useEffect(() => {
        getPlayerPositions()
    }, [getPlayerPositions])

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
    
    const playerPositions = () => {
        const playerPositions = [...props.playerPositions]
        playerPositions.unshift({ id: '', description: '' })
        return playerPositions.map((row, index) => <option key={index} value={row.id}>{row.description}</option>)
    }

    const titleScreen = isEdit() ? 'Editar Zona de jugador' : 'Nueva Zona de jugador';

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
                            <FormLabel>Posicion</FormLabel>
                            <FormControl id="player_position_id" as="select" value={player_position_id}
                                required onChange={onChangeControl}>
                                {playerPositions()}
                            </FormControl>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Description</FormLabel>
                            <FormControl id="description" type="text" value={description}
                                placeholder="Ingrese descripcion" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                    </Form>
              </CCardFooter>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { playerZone, playerPosition } = state;

    return {
        description: playerZone.playerZone.description,
        player_position_id: playerZone.playerZone.player_position_id,
        playerPositions: playerPosition.playerPositions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack())
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(playerZoneActions.updatePlayerZoneProperty(propertyName, propertyValue))
        },
        create() {
            dispatch(playerZoneActions.addPlayerZone())
        },
        update() {
            dispatch(playerZoneActions.updatePlayerZone())
        },
        getPlayerPositions() {
            dispatch(playerPositionActions.getPlayerPositions())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerZoneScreen)