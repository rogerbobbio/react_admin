import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import { types } from '../../../../types/types';
import leagueActions from 'src/actions/fifa/leagueActions';

function LeaguesScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Ligas registradas');
    const { filter, setFilterName, getLeagues } = props;

    useEffect(() => {
        getLeagues()
    }, [getLeagues])

    const headers = (columns) => {
        return <tr>{columns.map((columName, index) => <th key={index} className="text-nowrap text-center">{columName}</th>)}</tr>
    }

    const addLeague = () => {
        props.addLeague();
    }
    
    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Ligas encontradas');
        filter.name = '';
        if (!show)
        {
            setSubTitle('Ligas registradas');
            filter.name = null;
            getLeagues();
        }            
    }

    const leagueList = (leagues) => {
        return leagues.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editLeague(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => props.deleteLeague(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>
                </div>
            </td>
            <td className="text-nowrap">{row.name}</td>
        </tr>)
    }
    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Ligas</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addLeague}>
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
                            placeholder="Busqueda por nombre"
                            value={filter.name}
                            onChange={e => setFilterName(e.currentTarget.value)}
                        />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.leagues.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Nombre'])}
                                </thead>
                                <tbody>
                                    {leagueList(props.leagues)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { league } = state;

    return {
        leagues: league.leagues,
        filter: league.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getLeagues() {
            dispatch(leagueActions.getLeagues());
        },
        addLeague() {
            dispatch(leagueActions.newLeague());
            dispatch(push('/league/new'));
        },
        editLeague(league) {
            //Inicializa el state
            dispatch(leagueActions.newLeague());
            //Carga la data
            dispatch(leagueActions.editLeague(league));
            dispatch(push(`/league/${league.id}`));
        },
        setFilterName(name) {
            if (name === '')
              name = null;
            dispatch({ type: types.LEAGUE_SET_FILTER, payload: { name } });
            dispatch(leagueActions.applyFilter());
        },
        async deleteLeague(league) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ league.name }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(leagueActions.deleteLeague(league));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaguesScreen)