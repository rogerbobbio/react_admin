import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';

var endpoint = 'leagues';

const getLeagues = () => async dispatch => {
    try {
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(endpoint, {}, 'GET');
        const body = await resp.json();
        if (body.ok) {
            dispatch({ type: types.LEAGUE_SET_LEAGUES, payload: { leagues: body.leagues } })
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
        console.error(e)
        dispatch({ type: types.LEAGUE_SET_LEAGUES, payload: { leagues: [] } });
        Swal.fire('Error', 'Ocurrió un error obteniendo las ligas.', 'error');
    } finally {
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: false } });
    }
}

const editLeague = (league) => {
    const { id, name } = league
    return {
        type: types.LEAGUE_EDIT,
        payload: { id, name }
    }
}

const addLeague = () => async (dispatch, getState) => {
    try {
        const { name } = getState().league.league;
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(endpoint, { name }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Liga creada', 'success');
            dispatch(push('/leagues'));
        } else {            
            if (body.msg) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg);
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e);        
        Swal.fire('Error', 'Ocurrió un error guardando una liga.', 'error');
    } finally {
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: false } });
    }
}

const updateLeague = () => async (dispatch, getState) => {
    try {
        const { id, name } = getState().league.league;
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`leagues/${id}`, { name }, 'PUT');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Liga actualizada', 'success');
            dispatch(push('/leagues'));
        } else {
            if (body.msg) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg);
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'Ocurrió un error guardando la liga editada.', 'error');
    } finally {
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: false } });
    }
}

const deleteLeague = (league) => async (dispatch) => {
    try {
        const { id } = league;
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`leagues/${id}`, {}, 'DELETE');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Liga eliminada', 'success');
            dispatch(getLeagues());
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
        Swal.fire('Error', 'Ocurrió un error borrando la liga.', 'error');
    } finally {
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: false } });
    }
}

const newLeague = () => ({ type: types.LEAGUE_NEW });

const updateLeagueProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.LEAGUE_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { name } = getState().league.filter;

    try {
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: true } });
        if (name) {
           endpoint = `leagues/search/${name}`;
        } else {
            endpoint = 'leagues';
        }

        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        //console.log(body)
        if (body.ok) {
            dispatch({ type: types.LEAGUE_SET_LEAGUES, payload: { leagues: body.leagues } });
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
        dispatch({ type: types.LEAGUE_SET_LEAGUES, payload: { leagues: [] } });
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error');
    } finally {
        dispatch({ type: types.LEAGUE_LOADING, payload: { loading: false } });
    }
}

const leagueActions = {
    getLeagues,
    editLeague,
    addLeague,
    updateLeague,
    deleteLeague,
    newLeague,
    updateLeagueProperty,
    applyFilter
}
  
export default leagueActions