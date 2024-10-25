import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import { types } from '../../../../types/types';
import playerPositionActions from 'src/actions/fifa/playerPositionActions';

function PlayerPositionsScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Posiciones registradas');
    const { filter, setFilterDescription, getPlayerPositions } = props;

    useEffect(() => {
        getPlayerPositions()
    }, [getPlayerPositions])

    const headers = (columns) => {
        return <tr>{columns.map((columName, index) => <th key={index} className="text-nowrap text-center">{columName}</th>)}</tr>
    }

    const addPlayerPosition = () => {
        props.addPlayerPosition();
    }
    
    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Posiciones encontradas');
        filter.description = '';
        if (!show)
        {
            setSubTitle('Posiciones registradas');
            filter.description = null;
            getPlayerPositions();
        }            
    }

    const playerPositionList = (playerPositions) => {
        return playerPositions.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editPlayerPosition(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => props.deletePlayerPosition(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>
                </div>
            </td>
            <td className="text-nowrap">{row.description}</td>
        </tr>)
    }
    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Posiciones</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addPlayerPosition}>
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
                            placeholder="Busqueda por descripcion"
                            value={filter.description}
                            onChange={e => setFilterDescription(e.currentTarget.value)}
                        />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.playerPositions.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Descripcion'])}
                                </thead>
                                <tbody>
                                    {playerPositionList(props.playerPositions)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { playerPosition } = state;

    return {
        playerPositions: playerPosition.playerPositions,
        filter: playerPosition.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPlayerPositions() {
            dispatch(playerPositionActions.getPlayerPositions());
        },
        addPlayerPosition() {
            dispatch(playerPositionActions.newPlayerPosition());
            dispatch(push('/playerPosition/new'));
        },
        editPlayerPosition(playerPosition) {
            //Inicializa el state
            dispatch(playerPositionActions.newPlayerPosition());
            //Carga la data
            dispatch(playerPositionActions.editPlayerPosition(playerPosition));
            dispatch(push(`/playerPosition/${playerPosition.id}`));
        },
        setFilterDescription(descripcion) {
            if (descripcion === '')
              descripcion = null;
            dispatch({ type: types.PLAYER_POSITION_SET_FILTER, payload: { descripcion } });
            dispatch(playerPositionActions.applyFilter());
        },
        async deletePlayerPosition(playerPosition) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ playerPosition.descripcion }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(playerPositionActions.deletePlayerPosition(playerPosition));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerPositionsScreen)