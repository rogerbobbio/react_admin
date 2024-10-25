import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';

import leagueTeamActions from 'src/actions/fifa/leagueTeamActions';
import leagueActions from 'src/actions/fifa/leagueActions';


function LeagueTeamScreen(props) {
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { name, league_id, getLeagues } = props;

    useEffect(() => {
        getLeagues()
    }, [getLeagues])

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
    
    const leagues = () => {
        const leagues = [...props.leagues]
        leagues.unshift({ id: '', name: '' });
        return leagues.map((row, index) => <option key={index} value={row.id}>{row.name}</option>)
    }

    const titleScreen = isEdit() ? 'Editar Equipo' : 'Nuevo Equipo';

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
                            <FormLabel>Liga</FormLabel>
                            <FormControl id="league_id" as="select" value={league_id}
                                required onChange={onChangeControl}>
                                {leagues()}
                            </FormControl>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Equipo</FormLabel>
                            <FormControl id="name" type="text" value={name}
                                placeholder="Ingrese nombre" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                    </Form>
              </CCardFooter>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { leagueTeam, league } = state;

    return {
        name: leagueTeam.leagueTeam.name,
        league_id: leagueTeam.leagueTeam.league_id,
        leagues: league.leagues,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack())
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(leagueTeamActions.updateLeagueTeamProperty(propertyName, propertyValue))
        },
        create() {
            dispatch(leagueTeamActions.addLeagueTeam())
        },
        update() {
            dispatch(leagueTeamActions.updateLeagueTeam())
        },
        getLeagues() {
            dispatch(leagueActions.getLeagues())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueTeamScreen)