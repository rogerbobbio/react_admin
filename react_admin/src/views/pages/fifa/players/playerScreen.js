import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt, faPlus  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel, Col, FormCheck } from 'react-bootstrap';
import { createSelector } from 'reselect';

import playerActions from 'src/actions/fifa/playerActions';

import countryActions from 'src/actions/fifa/countryActions';
import leagueActions from 'src/actions/fifa/leagueActions';
import leagueTeamActions from 'src/actions/fifa/leagueTeamActions';
import playerPositionActions from 'src/actions/fifa/playerPositionActions';
import playerVersionActions from 'src/actions/fifa/playerVersionActions';
import playerZoneActions from 'src/actions/fifa/playerZoneActions';

function PlayerScreen(props) {
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { name,
            league_id, 
            league_team_id, 
            player_version_id, 
            player_position_id, 
            player_zone_id,
            country_id,
            rating,
            player_type,
            duplicate,
            duplicate_times,
            player_seleted,
            player_deleted,
            datetime_deleted,
            order_number,
            getCountries, getLeagues, getLeagueTeams, getPlayerPositions, getPlayerVersions, getPlayerZones, getPlayersDuplicate,
            countryOptions, leagueOptions, leagueTeamOptions, playerPositionOptions, playerVersionOptions, playerZoneOptions, playerTypeOptions, playersDuplicateOptions } = props;

    useEffect(() => {
        getPlayersDuplicate()
        getCountries()
        getLeagues()
        getLeagueTeams()
        getPlayerPositions()
        getPlayerVersions()
        getPlayerZones()
    }, [getCountries, getLeagues, getLeagueTeams, getPlayerPositions, getPlayerVersions, getPlayerZones, getPlayersDuplicate]);

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
        if (e.currentTarget.type === 'checkbox')
            props.setControlValue(e.currentTarget.id, e.currentTarget.checked ? 1 : 0)
        else
            props.setControlValue(e.currentTarget.id, e.currentTarget.value)
    }

    const title = isEdit() ? 'Editar Jugador' : 'Nuevo Jugador';

    const setFormatDate = (date) => {
        let newDate = '';
        if (date) {
            const arrDate = (new Date(date).toISOString().split('T')[0]).split('-');
            newDate = `${arrDate[2]}-${arrDate[1]}-${arrDate[0]}`
        }

        return newDate;
    }

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
                        <Form.Row>
                            <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl id="name" type="text" value={name}
                                        placeholder="Ingrese nombre de jugador" required onChange={onChangeControl}/>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Version</FormLabel>
                                    <FormControl id="player_version_id" as="select" value={player_version_id} required onChange={onChangeControl}>
                                        {playerVersionOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>                                
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Tipo Jugador</FormLabel>
                                    <FormControl id="player_type" as="select" value={player_type} required onChange={onChangeControl}>
                                        {playerTypeOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                           </FormGroup>
                        </Form.Row>                        
                        <Form.Row>
                           <FormGroup as={Col} className="text-center">
                                <FormGroup>
                                    <FormLabel>Duplicado</FormLabel>
                                    <FormCheck id="duplicate" checked={duplicate === 1} onChange={onChangeControl} />
                                </FormGroup>
                           </FormGroup>
                           <FormGroup as={Col} className="text-center">
                                <FormGroup>
                                    <FormLabel>Selecionado</FormLabel>
                                    <FormCheck id="player_seleted" checked={player_seleted === 1} onChange={onChangeControl} />
                                </FormGroup>
                           </FormGroup>
                           <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Jugadores</FormLabel>
                                    <FormControl as="select">
                                        {playersDuplicateOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                </FormGroup>
                           </FormGroup>
                           <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Orden</FormLabel>
                                    <FormControl id="order_number" type="number" value={order_number}
                                        placeholder="Ingrese numero de orden" required onChange={onChangeControl}/>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                           </FormGroup>
                           <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl id="rating" type="number" value={rating}
                                        placeholder="Ingrese rating" required onChange={onChangeControl}/>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                           </FormGroup>
                           <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Pais</FormLabel>
                                    <FormControl id="country_id" as="select" value={country_id} required onChange={onChangeControl}>
                                        {countryOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                           </FormGroup>
                        </Form.Row>
                        <Form.Row>                            
                           <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Zona</FormLabel>
                                    <FormControl id="player_position_id" as="select" value={player_position_id} required onChange={onChangeControl}>
                                        {playerPositionOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                           </FormGroup>
                           <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Posicion</FormLabel>
                                    <FormControl id="player_zone_id" as="select" value={player_zone_id} required onChange={onChangeControl}>
                                        {playerZoneOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                           </FormGroup>
                        </Form.Row>
                        <Form.Row>                            
                           <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Liga</FormLabel>
                                    <FormControl id="league_id" as="select" value={league_id} required onChange={onChangeControl}>
                                        {leagueOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                           </FormGroup>
                           <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Equipo</FormLabel>
                                    <FormControl id="league_team_id" as="select" value={league_team_id} required onChange={onChangeControl}>                                        {leagueTeamOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                           </FormGroup>
                        </Form.Row>
                        <Form.Row>                            
                            
                            <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Veces duplicado</FormLabel>
                                    <FormControl id="duplicate_times" type="number" value={duplicate_times}
                                        placeholder="Ingrese numero de veces duplicado" required onChange={onChangeControl}/>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                            </FormGroup>
                            <FormGroup as={Col} className="text-center">
                                <FormGroup>
                                    <FormLabel>Eliminado</FormLabel>
                                    <FormCheck id="player_deleted" checked={player_deleted === 1} onChange={onChangeControl} />
                                </FormGroup>
                            </FormGroup>
                            <FormGroup as={Col} className="text-center">
                                <FormGroup>
                                    <FormLabel>Fecha de eliminacion</FormLabel>                                    
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>{setFormatDate(datetime_deleted)}</FormLabel>
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
    const { player } = state;

    //BEGIN DROP DOWNS =================================================================================================    
    const playerTypeSelector = state => state.masterData.playerType
    const countriesSelector = state => state.country.countries
    const leaguesSelector = state => state.league.leagues
    const leagueTeamsSelector = state => state.leagueTeam.leagueTeams
    const playerPositionsSelector = state => state.playerPosition.playerPositions
    const playerVersionsSelector = state => state.playerVersion.playerVersions
    const playerZonesSelector = state => state.playerZone.playerZones
    const playersDuplicateSelector = state => state.player.playersDuplicate

    const selectedLeagueId = state => state.player.player.league_id ? +state.player.player.league_id : 0
    const selectedPositionId = state => state.player.player.player_position_id ? +state.player.player.player_position_id : 0

    const getCountryOptions = createSelector(
        countriesSelector, row => {
            const values = row.map(x => ({ value: x.id, description: x.name }))
            values.unshift({ value: '', description: '' })
            return values
        }
    )

    const getLeagueOptions = createSelector(
        leaguesSelector, row => {
            const values = row.map(x => ({ value: x.id, description: x.name }))
            values.unshift({ value: '', description: '' })
            return values
        }
    )

    const getPlayersDuplicateOptions = createSelector(
        playersDuplicateSelector, row => {
            const values = row.map(x => ({ value: x.order_number, description: x.rating + ' - ' + x.order_number + ' - ' + x.name }))            
            return values
        }
    )

    const getLeagueTeamOptions = createSelector(
        [leagueTeamsSelector, selectedLeagueId], (r, id) => {
          const l = r.filter(x => x.league_id === id).map(x => ({ value: x.id, description: x.name }))
          l.unshift({ value: '', description: '' })
          return l
        }
    )

    const getPlayerZoneOptions = createSelector(
        [playerZonesSelector, selectedPositionId], (r, id) => {
          const l = r.filter(x => x.player_position_id === id).map(x => ({ value: x.id, description: x.description }))
          l.unshift({ value: '', description: '' })
          return l
        }
    )


    const getPlayerPositionOptions = createSelector(
        playerPositionsSelector, row => {
            const values = row.map(x => ({ value: x.id, description: x.description }))
            values.unshift({ value: '', description: '' })
            return values
        }
    )

    const getPlayerVersionOptions = createSelector(
        playerVersionsSelector, row => {
            const values = row.map(x => ({ value: x.id, description: x.description }))
            values.unshift({ value: '', description: '' })
            return values
        }
    )

    

    const getPlayerTypeOptions = createSelector(
        playerTypeSelector, row => {
            const values = row.map(x => ({ value: x.id, description: x.description }))
            values.unshift({ value: '', description: '' })
            return values
        }
    )

    return {
        name: player.player.name,
        league_id: player.player.league_id,
        league_team_id: player.player.league_team_id,
        player_version_id: player.player.player_version_id,
        player_position_id: player.player.player_position_id,
        player_zone_id: player.player.player_zone_id,
        country_id: player.player.country_id,
        rating: player.player.rating,
        player_type: player.player.player_type,
        duplicate: player.player.duplicate,
        duplicate_times: player.player.duplicate_times,
        player_seleted: player.player.player_seleted,
        player_deleted: player.player.player_deleted,
        order_number: player.player.order_number,
        datetime_deleted: player.player.datetime_deleted, 

        //DROP DOWNS ====================
        countryOptions: getCountryOptions(state),
        leagueOptions: getLeagueOptions(state),
        playersDuplicateOptions: getPlayersDuplicateOptions(state),
        leagueTeamOptions: getLeagueTeamOptions(state),
        playerPositionOptions: getPlayerPositionOptions(state),
        playerVersionOptions: getPlayerVersionOptions(state),
        playerZoneOptions: getPlayerZoneOptions(state),
        playerTypeOptions: getPlayerTypeOptions(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack());
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(playerActions.updatePlayerProperty(propertyName, propertyValue));
        },
        create() {
            dispatch(playerActions.addPlayer());
        },
        update() {
            dispatch(playerActions.updatePlayer());
        },


        // GET DATA FOR DROP DOWNS =================================================================================================
        getPlayersDuplicate() {
            dispatch(playerActions.getPlayersDuplicate())
        },
        getCountries() {
            dispatch(countryActions.getCountries())
        },
        getLeagues() {
            dispatch(leagueActions.getLeagues())
        },
        getLeagueTeams() {
            dispatch(leagueTeamActions.getLeagueTeams())
        },
        getPlayerPositions() {
            dispatch(playerPositionActions.getPlayerPositions())
        },
        getPlayerVersions() {
            dispatch(playerVersionActions.getPlayerVersions())
        },
        getPlayerZones() {
            dispatch(playerZoneActions.getPlayerZones())
        },
        // ===========================================================================================================================
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen)