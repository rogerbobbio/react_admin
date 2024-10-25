import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';
import Select from 'react-select';

import { types } from '../../../../types/types';
import playerPositionActions from 'src/actions/fifa/playerPositionActions';
import playerZoneActions from 'src/actions/fifa/playerZoneActions';


function PlayerZonesScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Zonas de jugadores registrados');
    const { filter, setFilterDescription, setFilterPosition,
            deletePlayerZone, getPlayerZones, getPlayerPositions, playerPositions } = props;


    useEffect(() => {
        getPlayerZones()
        getPlayerPositions()
    }, [getPlayerZones])
    
    const headers = (columns) => {
        return <tr>{columns.map((name, index) => <th key={index} className="text-nowrap text-center">{name}</th>)}</tr>
    }

    const addRecord = () => {
        props.addPlayerZone();  
    }    

    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Zonas de jugadores encontradas');
        filter.description = '';
        if (!show)
        {
            setSubTitle('Zonas de jugadores registradas');
            filter.description = null;
            getPlayerZones()
        }
    }
    
    const playerZoneList = (playerZones) => {
        return playerZones.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editPlayerZone(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => deletePlayerZone(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>
                </div>
            </td>
            <td className="text-nowrap">{row.player_position_description}</td>
            <td className="text-nowrap">{row.description}</td>
        </tr>)
    }

    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Zonas de jugadores</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addRecord}>
                                <FontAwesomeIcon icon={faPlus} /> Crear
                            </CButton>
                            <CButton shape="pill" color="info"  onClick={toggleFilter}>
                                <FontAwesomeIcon icon={faBinoculars} /> Buscar
                            </CButton>
                        </div>
                    </div>
                </CRow>
                <CRow>
                    <CCol md={12}>
                        <hr></hr>
                    </CCol>
                </CRow>
                {showFilter && <CRow>
                    <CCol md={4}>
                        <input 
                            className="form-control"
                            type="text"
                            placeholder="Busqueda por descripción"
                            value={filter.description}
                            onChange={e => setFilterDescription(e.currentTarget.value)}
                        />
                    </CCol>
                    <CCol md={4}>
                        <Select options={playerPositions} value={filter.player_position} onChange={e => setFilterPosition(e)} isClearable />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.playerZones.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Posicion', 'Zona'])}
                                </thead>
                                <tbody>
                                    {playerZoneList(props.playerZones)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {    
    const { playerZone } = state

    const playerPositionSelector = state => state.playerPosition.playerPositions

    const getPlayerPositions = createSelector(
        playerPositionSelector, rows => rows.map(playerPosition => ({ value: playerPosition.id, label: playerPosition.description }))
      )

    //console.log('map',playerZone);
    return {        
        playerZones: playerZone.playerZones,
        filter: playerZone.filter,
        playerPositions: getPlayerPositions(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPlayerZones() {
            dispatch(playerZoneActions.getPlayerZones());
        },
        getPlayerPositions() {
            dispatch(playerPositionActions.getPlayerPositions())
        },
        addPlayerZone() {
            dispatch(playerZoneActions.newPlayerZone())
            dispatch(push('/playerZone/new'))
        },
        editPlayerZone(playerZone) {
            //Inicializa el state del modulo
            dispatch(playerZoneActions.newPlayerZone())
            //Carga la data
            dispatch(playerZoneActions.editPlayerZone(playerZone))
            dispatch(push(`/playerZone/${playerZone.id}`))
        },        
        async deletePlayerZone(playerZone) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ playerZone.description }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(playerZoneActions.deletePlayerZone(playerZone));
        },

        setFilterPosition(playerPosition) {
            dispatch({ type: types.PLAYER_ZONE_SET_FILTER, payload: { playerPosition } })
            dispatch(playerZoneActions.applyFilter())
        },
        setFilterDescription(description) {            
            if (description === '')
              description = null;
            dispatch({ type: types.PLAYER_ZONE_SET_FILTER, payload: { description } });
            dispatch(playerZoneActions.applyFilter());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerZonesScreen)