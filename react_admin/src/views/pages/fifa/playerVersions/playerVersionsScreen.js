import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import { types } from '../../../../types/types';
import playerVersionActions from 'src/actions/fifa/playerVersionActions';

function PlayerVersionsScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Versiones registradas');
    const { filter, setFilterDescription, getPlayerVersions } = props;

    useEffect(() => {
        getPlayerVersions()
    }, [getPlayerVersions])

    const headers = (columns) => {
        return <tr>{columns.map((columName, index) => <th key={index} className="text-nowrap text-center">{columName}</th>)}</tr>
    }

    const addPlayerVersion = () => {
        props.addPlayerVersion();
    }
    
    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Versiones encontradas');
        filter.description = '';
        if (!show)
        {
            setSubTitle('Versiones registradas');
            filter.description = null;
            getPlayerVersions();
        }            
    }

    const playerVersionList = (playerVersions) => {
        return playerVersions.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editPlayerVersion(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => props.deletePlayerVersion(row)}>
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
                        <h1>Lista de Versiones</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addPlayerVersion}>
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
                <p><em>{subTitle} ({props.playerVersions.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Descripcion'])}
                                </thead>
                                <tbody>
                                    {playerVersionList(props.playerVersions)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { playerVersion } = state;

    return {
        playerVersions: playerVersion.playerVersions,
        filter: playerVersion.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPlayerVersions() {
            dispatch(playerVersionActions.getPlayerVersions());
        },
        addPlayerVersion() {
            dispatch(playerVersionActions.newPlayerVersion());
            dispatch(push('/playerVersion/new'));
        },
        editPlayerVersion(playerVersion) {
            //Inicializa el state
            dispatch(playerVersionActions.newPlayerVersion());
            //Carga la data
            dispatch(playerVersionActions.editPlayerVersion(playerVersion));
            dispatch(push(`/playerVersion/${playerVersion.id}`));
        },
        setFilterDescription(descripcion) {
            if (descripcion === '')
              descripcion = null;
            dispatch({ type: types.PLAYER_VERSION_SET_FILTER, payload: { descripcion } });
            dispatch(playerVersionActions.applyFilter());
        },
        async deletePlayerVersion(playerVersion) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ playerVersion.descripcion }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(playerVersionActions.deletePlayerVersion(playerVersion));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerVersionsScreen)