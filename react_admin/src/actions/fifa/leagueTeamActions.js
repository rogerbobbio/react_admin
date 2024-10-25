import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';

var endpoint = 'leagueTeams';


const getLeagueTeams = () => async dispatch => {
    try {
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(endpoint, {}, 'GET')
        const body = await resp.json()
        //console.log('getPlayerZones',body);
        if (body.ok) {
            dispatch({ type: types.LEAGUE_TEAM_SET_LEAGUE_TEAMS, payload: { leagueTeams: body.leagueTeams } })
        } else {
            if (body.msg) {
                if (body.msg === 'Token invalid') dispatch(startLogout());
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg)
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e);
        dispatch({ type: types.LEAGUE_TEAM_SET_LEAGUE_TEAMS, payload: { leagueTeams: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo los equipos.', 'error')
    } finally {
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: false } })
    }
  }

const editLeagueTeam = (leagueTeam) => {
    const { id, name, league_id } = leagueTeam
    return {
        type: types.LEAGUE_TEAM_EDIT,
        payload: { id, name, league_id }
    }
}

const addLeagueTeam = () => async (dispatch, getState) => {
    try {
        const { name, league_id } = getState().leagueTeam.leagueTeam
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(endpoint, { name, league_id }, 'POST')
        const body = await resp.json()        
        if (body.ok) {
            Swal.fire('Éxito', 'El equipo fue creado', 'success');
            dispatch(push('/leagueTeams'))
        } else {
            if (body.msg) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg)
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e)
        Swal.fire('Error', 'Ocurrió un error guardando el equipo.', 'error')
    } finally {
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: false } })
    }
}

const updateLeagueTeam = () => async (dispatch, getState) => {
    try {
        const { id, name, league_id } = getState().leagueTeam.leagueTeam
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`leagueTeams/${id}`, { name, league_id }, 'PUT');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'El equipo fue actualizado', 'success');
            dispatch(push('/leagueTeams'))
        } else {
            if (body.msg) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg)
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e)
        Swal.fire('Error', 'Ocurrió un error guardando el equipo editado.', 'error')
    } finally {
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: false } })
    }
}

const deleteLeagueTeam = (leagueTeam) => async (dispatch) => {
    try {
        const { id } = leagueTeam
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`leagueTeams/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Equipo eliminado', 'success')
            dispatch(applyFilter())
        } else {
            if (body.msg) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg)
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e)
        Swal.fire('Error', 'Ocurrió un error borrando el equipo.', 'error');
    } finally {
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: false } })
    }
}

const newLeagueTeam = () => ({ type: types.LEAGUE_TEAM_NEW });

const updateLeagueTeamProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.LEAGUE_TEAM_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { name, league } = getState().leagueTeam.filter;    

    try {
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: true } });
        const resp = await fetchConToken('leagueTeams/search/',
            {
                name: name ? name : '',
                leagueId: league ? +league.value : 0
            }, 'GET');
        const body = await resp.json();
        
        if (body.ok) {
            dispatch({ type: types.LEAGUE_TEAM_SET_LEAGUE_TEAMS, payload: { leagueTeams: body.leagueTeams } })
        } else {
            if (body.msg) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg)
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e)
        dispatch({ type: types.LEAGUE_TEAM_SET_LEAGUE_TEAMS, payload: { leagueTeams: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.LEAGUE_TEAM_LOADING, payload: { loading: false } })
    }
}

const leagueTeamActions = {
    getLeagueTeams,
    editLeagueTeam,
    addLeagueTeam,
    updateLeagueTeam,
    deleteLeagueTeam,
    newLeagueTeam,
    updateLeagueTeamProperty,
    applyFilter
}
  
export default leagueTeamActions