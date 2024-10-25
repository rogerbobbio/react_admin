import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip, CDataTable, CCallout } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faDatabase, faTrashRestoreAlt, faBookmark, faCopy, faBinoculars, faRedo } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';
import { push } from 'connected-react-router';
import Select from 'react-select';
import { createSelector } from 'reselect';
import { FormCheck, FormLabel } from 'react-bootstrap';

import { types } from '../../../../types/types';
import playerActions from 'src/actions/fifa/playerActions';

import countryActions from 'src/actions/fifa/countryActions';
import leagueActions from 'src/actions/fifa/leagueActions';
import leagueTeamActions from 'src/actions/fifa/leagueTeamActions';
import playerPositionActions from 'src/actions/fifa/playerPositionActions';
import playerVersionActions from 'src/actions/fifa/playerVersionActions';
import playerZoneActions from 'src/actions/fifa/playerZoneActions';


function PlayersScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);    
    
    const { filter, 
            getAllPlayers,
            getCountries, getLeagues, getLeagueTeams, getPlayerPositions, getPlayerVersions, getPlayerZones,
            countryOptions, leagueOptions, leagueTeamOptions, playerPositionOptions, playerVersionOptions, playerZoneOptions, 
            booleanOptions, playerTypeOptions, duplicateTimeOptions, ratingOptions  } = props;

    useEffect(() => {
        getAllPlayers(props.players.filter)
        getCountries()
        getLeagues()
        getLeagueTeams()
        getPlayerPositions()
        getPlayerVersions()
        getPlayerZones()
    }, [getAllPlayers, getCountries, getLeagues, getLeagueTeams, getPlayerPositions, getPlayerVersions, getPlayerZones])

    const headers = ['order_number','Actions', 'name','duplicate_times','country_name', 'rating', 
                     'player_zone_description', 'league_name','league_team_name', 'player_type',
                     'player_version_description', 'player_position_description', 'player_deleted'];

    const addPlayer = () => {
        props.addPlayer();
    }

    const allPlayers = () => {
        props.getAllPlayers(props.players.filter);
    }

    const resetFilters = () => {
        //name, country, league, leagueTeam, playerPosition, playerZone, playerVersion, playerSeleted, playerType, duplicate, duplicateTimes
        props.clearAllFilters('',null,null,null,null,null,null,'','','','');
    }

    const toggleFilter = () => {
        const show = !showFilter;
        setShowFilter(show);
    }

    const updateFilter = () => {
        props.updateFilters();
    }
    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>                    
                    <div className="col">
                        <h1>Lista de Jugadores</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addPlayer}>
                                <FontAwesomeIcon icon={faPlus} /> Crear
                            </CButton>
                            <CButton shape="pill" color="secondary" onClick={allPlayers}>
                                <FontAwesomeIcon icon={faDatabase} /> Todos
                            </CButton>
                            <CButton shape="pill" color="secondary" onClick={resetFilters}>
                                <FontAwesomeIcon icon={faTrashRestoreAlt} /> Reseteo Filtros
                            </CButton>
                            <CButton shape="pill" color="info"  onClick={toggleFilter}>
                                <FontAwesomeIcon icon={faBinoculars} /> Filtros
                            </CButton>
                            <CButton shape="pill" color="info"  onClick={updateFilter}>
                                <FontAwesomeIcon icon={faRedo} /> Actualizar
                            </CButton>
                        </div>
                    </div>
                </CRow>
                <CRow>
                    <CCol md={12}>
                        <hr></hr>
                    </CCol>
                </CRow>
                {showFilter && 

                <CRow>
                <CCol md={4}>
                    <FormLabel>Jugador</FormLabel>
                    <input 
                        className="form-control"
                        type="text"
                        placeholder="Busqueda por nombre jugador"
                        value={filter.name}
                        onChange={e => props.setFilterName(e.currentTarget.value)}
                    />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Paises</FormLabel>
                    <Select options={countryOptions} value={filter.country} onChange={e => props.setFilterCountry(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Ligas</FormLabel>
                    <Select options={leagueOptions} value={filter.league} onChange={e => props.setFilterLeague(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Equipos</FormLabel>
                    <Select options={leagueTeamOptions} value={filter.leagueTeam} onChange={e => props.setFilterLeagueTeam(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Zonas</FormLabel>
                    <Select options={playerPositionOptions} value={filter.playerPosition} onChange={e => props.setFilterPlayerPosition(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Posicion</FormLabel>
                    <Select options={playerZoneOptions} value={filter.playerZone} onChange={e => props.setFilterPlayerZone(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Version</FormLabel>
                    <Select options={playerVersionOptions} value={filter.playerVersion} onChange={e => props.setFilterPlayerVersion(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Tipo</FormLabel>
                    <Select options={playerTypeOptions} value={filter.playerType} onChange={e => props.setFilterPlayerType(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Selecionado</FormLabel>
                    <Select options={booleanOptions} value={filter.playerSeleted} onChange={e => props.setFilterPlayerSeleted(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Duplicado</FormLabel>
                    <Select options={booleanOptions} value={filter.duplicate} onChange={e => props.setFilterDuplicate(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Veces Duplicado</FormLabel>
                    <Select options={duplicateTimeOptions} value={filter.duplicateTimes} onChange={e => props.setFilterDuplicateTimes(e)} isClearable />
                </CCol>
                <CCol md={4}>
                    <FormLabel>Rating</FormLabel>
                    <Select options={ratingOptions} value={filter.rating} onChange={e => props.setFilterRating(e)} isClearable />
                </CCol>
            </CRow>                
                
                }

                <CRow>
                    <CCol md={12}>
                        <hr></hr>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol sm="2">
                      <CCallout color="info">
                        <small className="text-muted">Jugadores Encontrados</small>
                        <br />
                        <strong className="h4">{props.players.length}</strong>
                      </CCallout>
                    </CCol>
                    <CCol sm="2">
                      <CCallout color="danger">
                        <small className="text-muted">Jugadores Duplicados</small>
                        <br />
                        <strong className="h4">{props.players.filter(x => x.duplicate === 1).length}</strong>
                      </CCallout>
                    </CCol>
                    <CCol sm="2">
                      <CCallout color="warning">
                        <small className="text-muted">Jugadores Selecionados</small>
                        <br />
                        <strong className="h4">{props.players.filter(x => x.player_seleted === 1).length}</strong>
                      </CCallout>
                    </CCol>
                    <CCol sm="2">
                      <CCallout color="danger">
                        <small className="text-muted">Duplicados mas de 1</small>
                        <br />
                        <strong className="h4">{props.players.filter(x => x.duplicate_times > 0).length}</strong>
                      </CCallout>
                    </CCol>
                    <CCol sm="2">
                      <CCallout color="secondary">
                        <small className="text-muted">Eliminados</small>
                        <br />
                        <strong className="h4">{props.players.filter(x => x.player_deleted > 0).length}</strong>
                      </CCallout>
                    </CCol>
                </CRow>

                <hr className="mt-0" />
                
                <div className="table-responsive">
                    <CDataTable items={props.players}
                                fields={headers}
                                itemsPerPageSelect
                                itemsPerPage={50}
                                sorter
                                pagination
                                scopedSlots = {{
                                    'Actions':
                                        (row)=>(
                                        <td>
                                            <div className="d.flex justify-content-evenly text-nowrap text-center">
                                                <CTooltip content={row.duplicate ? 'Deselecionar' : 'Selecionar' }>
                                                    <CButton shape="pill" color={row.duplicate ? 'success' : 'info' } onClick={() => props.playerDuplicated(row)}>
                                                        <FontAwesomeIcon icon={faCopy} /> {row.duplicate ? 'Dupli' : 'No Dupli'}
                                                    </CButton>
                                                </CTooltip>
                                                <CTooltip content={row.player_seleted ? 'Deselecionar' : 'Selecionar' }>
                                                    <CButton shape="pill" color={row.player_seleted ? 'danger' : 'info' } onClick={() => props.selectPlayer(row)}>
                                                        <FontAwesomeIcon icon={faBookmark} /> {row.player_seleted ? 'Selected' : 'No Select'}
                                                    </CButton>
                                                </CTooltip>
                                                <CTooltip content={'Editar'}>
                                                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editPlayer(row)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </CButton>
                                                </CTooltip>
                                                <CTooltip content={'Borrar'}>
                                                    <CButton shape="pill" color="secondary" size="sm" onClick={() => props.deletePlayer(row)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </CButton>
                                                </CTooltip>
                                            </div>
                                        </td>
                                        )
                                }}
                                />  
                </div>
                <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addPlayer}>
                                <FontAwesomeIcon icon={faPlus} /> Crear
                            </CButton>
                            <CButton shape="pill" color="secondary" onClick={allPlayers}>
                                <FontAwesomeIcon icon={faDatabase} /> Todos
                            </CButton>
                            <CButton shape="pill" color="secondary" onClick={resetFilters}>
                                <FontAwesomeIcon icon={faTrashRestoreAlt} /> Reseteo Filtros
                            </CButton>
                            <CButton shape="pill" color="info"  onClick={updateFilter}>
                                <FontAwesomeIcon icon={faRedo} /> Actualizar
                            </CButton>
                        </div>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { player } = state

    //BEGIN DROP DOWNS =================================================================================================
    const booleanSelector = state => state.masterData.booleanQuestion
    const countriesSelector = state => state.country.countries
    const leaguesSelector = state => state.league.leagues
    const leagueTeamsSelector = state => state.leagueTeam.leagueTeams
    const playerPositionsSelector = state => state.playerPosition.playerPositions
    const playerVersionsSelector = state => state.playerVersion.playerVersions
    const playerZonesSelector = state => state.playerZone.playerZones
    const playerTypeSelector = state => state.masterData.playerType
    const duplicateTimeSelector = state => state.masterData.duplicateTime
    const ratingSelector = state => state.masterData.rating


    const getCountryOptions = createSelector(
        countriesSelector, rows => rows.map(row => ({ value: row.id, label: row.name }))
    )

    const getLeagueOptions = createSelector(
        leaguesSelector, rows => rows.map(row => ({ value: row.id, label: row.name }))
    )

    const getLeagueTeamOptions = createSelector(
        leagueTeamsSelector, rows => rows.map(row => ({ value: row.id, label: row.name }))
    )

    const getPlayerPositionOptions = createSelector(
        playerPositionsSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )

    const getPlayerVersionOptions = createSelector(
        playerVersionsSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )

    const getPlayerZoneOptions = createSelector(
        playerZonesSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )

    const getBooleanOptions = createSelector(
        booleanSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )

    const getPlayerTypeOptions = createSelector(
        playerTypeSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )

    const getDuplicateTimeOptions = createSelector(
        duplicateTimeSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )

    const getRatingOptions = createSelector(
        ratingSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )
    //=================================================================================================

    return {
        players: player.players,
        filter: player.filter,
        //DROP DOWNS ====================
        countryOptions: getCountryOptions(state),
        leagueOptions: getLeagueOptions(state),
        leagueTeamOptions: getLeagueTeamOptions(state),
        playerPositionOptions: getPlayerPositionOptions(state),
        playerVersionOptions: getPlayerVersionOptions(state),
        playerZoneOptions: getPlayerZoneOptions(state),
        booleanOptions: getBooleanOptions(state),
        playerTypeOptions: getPlayerTypeOptions(state),
        duplicateTimeOptions: getDuplicateTimeOptions(state),
        ratingOptions: getRatingOptions(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllPlayers(filter) {
            if (filter)
              dispatch(playerActions.applyFilter());
            else
              dispatch(playerActions.getPlayers());
        },
        getPlayers() {
            dispatch(playerActions.applyFilter());
        },
        addPlayer() {
            dispatch(playerActions.newPlayer());
            dispatch(push('/player/new'));
        },
        editPlayer(player) {
            //Inicializa el state
            dispatch(playerActions.newPlayer());
            //Carga la data
            dispatch(playerActions.editPlayer(player));
            dispatch(push(`/player/${player.id}`));
        },
        selectPlayer(player) {
            dispatch(playerActions.editPlayer(player));
            if (player.player_seleted === 1) {
                player.player_seleted = 0;
            } else {
                player.player_seleted = 1;
            }               
            dispatch(playerActions.selectPlayer(player));
        },
        playerDuplicated(player) {
            dispatch(playerActions.editPlayer(player));
            if (player.duplicate === 1) {
                if (player.duplicate_times > 0) {
                    player.duplicate_times = player.duplicate_times - 1;
                } else {
                    player.duplicate = 0;
                    player.order_number = 0;
                }                
            } else {
                player.duplicate = 1;
            }               
            dispatch(playerActions.selectPlayer(player));
        },
        async deletePlayer(player) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ player.name }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(playerActions.deletePlayer(player));
        },

        // FILTROS ===============================================================================================================
        setFilterName(name) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { name } });
            dispatch(playerActions.applyFilter());
        },
        setFilterCountry(country) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { country } });
            dispatch(playerActions.applyFilter());
        },
        setFilterLeague(league) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { league } });
            dispatch(playerActions.applyFilter());
        },
        setFilterLeagueTeam(leagueTeam) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { leagueTeam } })
            dispatch(playerActions.applyFilter())
        },
        setFilterPlayerPosition(playerPosition) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { playerPosition } })
            dispatch(playerActions.applyFilter())
        },
        setFilterPlayerZone(playerZone) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { playerZone } })
            dispatch(playerActions.applyFilter())
        },
        setFilterPlayerVersion(playerVersion) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { playerVersion } })
            dispatch(playerActions.applyFilter())
        },
        setFilterPlayerSeleted(playerSeleted) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { playerSeleted } })
            dispatch(playerActions.applyFilter())
        },
        setFilterPlayerType(playerType) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { playerType } })
            dispatch(playerActions.applyFilter())
        },
        setFilterDuplicate(duplicate) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { duplicate } })
            dispatch(playerActions.applyFilter())
        },
        setFilterDuplicateTimes(duplicateTimes) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { duplicateTimes } })
            dispatch(playerActions.applyFilter())
        },
        setFilterRating(rating) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { rating } })
            dispatch(playerActions.applyFilter())
        },
        
        clearAllFilters(name, country, league, leagueTeam, playerPosition, playerZone, playerVersion, playerSeleted, playerType, duplicate, duplicateTimes) {
            dispatch({ type: types.PLAYER_SET_FILTER, payload: { name, country, league, leagueTeam, playerPosition, playerZone, playerVersion, playerSeleted, playerType, duplicate, duplicateTimes } })
            dispatch(playerActions.applyFilter())
        },

        updateFilters(){
            dispatch(playerActions.applyFilter())
        },

        

        // GET DATA FOR DROP DOWNS =================================================================================================
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayersScreen)