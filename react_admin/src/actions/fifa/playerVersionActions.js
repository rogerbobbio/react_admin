import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';

var endpoint = 'playerVersions';

const getPlayerVersions = () => async dispatch => {
    try {
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(endpoint, {}, 'GET');
        const body = await resp.json();
        if (body.ok) {
            dispatch({ type: types.PLAYER_VERSION_SET_PLAYER_VERSIONS, payload: { playerVersions: body.playerVersions } })
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
        dispatch({ type: types.PLAYER_VERSION_SET_PLAYER_VERSIONS, payload: { playerVersions: [] } });
        Swal.fire('Error', 'Ocurrió un error obteniendo las versiones de los jugadores.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: false } });
    }
}

const editPlayerVersion = (playerVersion) => {
    const { id, description } = playerVersion
    return {
        type: types.PLAYER_VERSION_EDIT,
        payload: { id, description }
    }
}

const addPlayerVersion = () => async (dispatch, getState) => {
    try {
        const { description } = getState().playerVersion.playerVersion;
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(endpoint, { description }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Version del jugador creada', 'success');
            dispatch(push('/playerVersions'));
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
        Swal.fire('Error', 'Ocurrió un error guardando una version de jugador.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: false } });
    }
}

const updatePlayerVersion = () => async (dispatch, getState) => {
    try {
        const { id, description } = getState().playerVersion.playerVersion;
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`playerVersions/${id}`, { description }, 'PUT');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Version de jugador actualizado', 'success');
            dispatch(push('/playerVersions'));
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
        Swal.fire('Error', 'Ocurrió un error guardando la version editada.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: false } });
    }
}

const deletePlayerVersion = (playerVersion) => async (dispatch) => {
    try {
        const { id } = playerVersion;
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`playerVersions/${id}`, {}, 'DELETE');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Version de jugador eliminado', 'success');
            dispatch(getPlayerVersions());
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
        Swal.fire('Error', 'Ocurrió un error borrando la version del jugador.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: false } });
    }
}

const newPlayerVersion = () => ({ type: types.PLAYER_VERSION_NEW });

const updatePlayerVersionProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.PLAYER_VERSION_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { description } = getState().playerVersion.filter;

    try {
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: true } });
        if (description) {
           endpoint = `playerVersions/search/${description}`;
        } else {
            endpoint = 'playerVersions';
        }

        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        //console.log(body)
        if (body.ok) {
            dispatch({ type: types.PLAYER_VERSION_SET_PLAYER_VERSIONS, payload: { playerVersions: body.playerVersions } });
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
        dispatch({ type: types.PLAYER_VERSION_SET_PLAYER_VERSIONS, payload: { playerVersions: [] } });
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_VERSION_LOADING, payload: { loading: false } });
    }
}

const playerVersionActions = {
    getPlayerVersions,
    editPlayerVersion,
    addPlayerVersion,
    updatePlayerVersion,
    deletePlayerVersion,
    newPlayerVersion,
    updatePlayerVersionProperty,
    applyFilter
}
  
export default playerVersionActions