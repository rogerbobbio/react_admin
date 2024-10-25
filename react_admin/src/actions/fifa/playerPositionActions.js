import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';

var endpoint = 'playerPositions';

const getPlayerPositions = () => async dispatch => {
    try {
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(endpoint, {}, 'GET');
        const body = await resp.json();
        if (body.ok) {
            dispatch({ type: types.PLAYER_POSITION_SET_PLAYER_POSITIONS, payload: { playerPositions: body.playerPositions } })
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
        dispatch({ type: types.PLAYER_POSITION_SET_PLAYER_POSITIONS, payload: { playerPositions: [] } });
        Swal.fire('Error', 'Ocurrió un error obteniendo las posiciones de los jugadores.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: false } });
    }
}

const editPlayerPosition = (playerPosition) => {
    const { id, description } = playerPosition
    return {
        type: types.PLAYER_POSITION_EDIT,
        payload: { id, description }
    }
}

const addPlayerPosition = () => async (dispatch, getState) => {
    try {
        const { description } = getState().playerPosition.playerPosition;
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(endpoint, { description }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Posicion creada', 'success');
            dispatch(push('/playerPositions'));
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
        Swal.fire('Error', 'Ocurrió un error guardando una posicion de jugador.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: false } });
    }
}

const updatePlayerPosition = () => async (dispatch, getState) => {
    try {
        const { id, description } = getState().playerPosition.playerPosition;
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`playerPositions/${id}`, { description }, 'PUT');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Posicion actualizada', 'success');
            dispatch(push('/playerPositions'));
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
        Swal.fire('Error', 'Ocurrió un error guardando la posicion editada.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: false } });
    }
}

const deletePlayerPosition = (playerPosition) => async (dispatch) => {
    try {
        const { id } = playerPosition;
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`playerPositions/${id}`, {}, 'DELETE');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Posicion eliminada', 'success');
            dispatch(getPlayerPositions());
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
        Swal.fire('Error', 'Ocurrió un error borrando la posicion del jugador.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: false } });
    }
}

const newPlayerPosition = () => ({ type: types.PLAYER_POSITION_NEW });

const updatePlayerPositionProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.PLAYER_POSITION_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { description } = getState().playerPosition.filter;

    try {
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: true } });
        if (description) {
           endpoint = `playerPositions/search/${description}`;
        } else {
           endpoint = 'playerPositions';
        }

        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        if (body.ok) {
            dispatch({ type: types.PLAYER_POSITION_SET_PLAYER_POSITIONS, payload: { playerPositions: body.playerPositions } });
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
        dispatch({ type: types.PLAYER_POSITION_SET_PLAYER_POSITIONS, payload: { playerPositions: [] } });
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_POSITION_LOADING, payload: { loading: false } });
    }
}

const playerPositionActions = {
    getPlayerPositions,
    editPlayerPosition,
    addPlayerPosition,
    updatePlayerPosition,
    deletePlayerPosition,
    newPlayerPosition,
    updatePlayerPositionProperty,
    applyFilter
}
  
export default playerPositionActions