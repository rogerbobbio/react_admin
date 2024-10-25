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
import leagueActions from 'src/actions/fifa/leagueActions';
import leagueTeamActions from 'src/actions/fifa/leagueTeamActions';


function LeagueTeamsScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Ligas registradas');
    const { filter, setFilterName, setFilterLeague,
            deleteLeagueTeam, getLeagueTeams, getLeagues, leagues } = props;


    useEffect(() => {
        getLeagueTeams()
        getLeagues()
    }, [getLeagueTeams])
    
    const headers = (columns) => {
        return <tr>{columns.map((name, index) => <th key={index} className="text-nowrap text-center">{name}</th>)}</tr>
    }

    const addRecord = () => {
        props.addLeagueTeam();  
    }    

    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Equipos encontrados');
        filter.name = '';
        if (!show)
        {
            setSubTitle('Equipos registrados');
            filter.name = null;
            getLeagueTeams()
        }
    }
    
    const leagueTeamList = (leagueTeams) => {
        return leagueTeams.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editLeagueTeam(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => deleteLeagueTeam(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>
                </div>
            </td>
            <td className="text-nowrap">{row.league_name}</td>
            <td className="text-nowrap">{row.name}</td>
        </tr>)
    }

    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Equipos</h1>
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
                            placeholder="Busqueda por nombre"
                            value={filter.name}
                            onChange={e => setFilterName(e.currentTarget.value)}
                        />
                    </CCol>
                    <CCol md={4}>
                        <Select options={leagues} value={filter.league} onChange={e => setFilterLeague(e)} isClearable />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.leagueTeams.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Liga', 'Equipo'])}
                                </thead>
                                <tbody>
                                    {leagueTeamList(props.leagueTeams)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {    
    const { leagueTeam } = state

    const leagueSelector = state => state.league.leagues

    const getLeagues = createSelector(
        leagueSelector, rows => rows.map(league => ({ value: league.id, label: league.name }))
      )

    //console.log('map',playerZone);
    return {        
        leagueTeams: leagueTeam.leagueTeams,
        filter: leagueTeam.filter,
        leagues: getLeagues(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getLeagueTeams() {
            dispatch(leagueTeamActions.getLeagueTeams());
        },
        getLeagues() {
            dispatch(leagueActions.getLeagues())
        },
        addLeagueTeam() {
            dispatch(leagueTeamActions.newLeagueTeam())
            dispatch(push('/leagueTeam/new'))
        },
        editLeagueTeam(leagueTeam) {
            //Inicializa el state del modulo
            dispatch(leagueTeamActions.newLeagueTeam())
            //Carga la data
            dispatch(leagueTeamActions.editLeagueTeam(leagueTeam))
            dispatch(push(`/leagueTeam/${leagueTeam.id}`))
        },        
        async deleteLeagueTeam(leagueTeam) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ leagueTeam.name }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(leagueTeamActions.deleteLeagueTeam(leagueTeam));
        },

        setFilterLeague(league) {
            dispatch({ type: types.LEAGUE_TEAM_SET_FILTER, payload: { league } })
            dispatch(leagueTeamActions.applyFilter())
        },
        setFilterName(name) {
            if (name === '')
              name = null;
            dispatch({ type: types.LEAGUE_TEAM_SET_FILTER, payload: { name } });
            dispatch(leagueTeamActions.applyFilter());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueTeamsScreen)