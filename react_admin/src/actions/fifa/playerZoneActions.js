import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';

var endpoint = 'playerZones';


const getPlayerZones = () => async dispatch => {
    try {
        dispatch({ type: types.PLAYER_ZONE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(endpoint, {}, 'GET')
        const body = await resp.json()
        //console.log('getPlayerZones',body);
        if (body.ok) {
            dispatch({ type: types.PLAYER_ZONE_SET_PLAYER_ZONES, payload: { playerZones: body.playerZones } })
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
        console.error('getPlayerZones error',e);
        dispatch({ type: types.PLAYER_ZONE_SET_PLAYER_ZONES, payload: { playerZones: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo las zonas de juego.', 'error')
    } finally {
        dispatch({ type: types.PLAYER_ZONE_LOADING, payload: { loading: false } })
    }
  }

const editPlayerZone = (playerZone) => {
    const { id, description, player_position_id } = playerZone
    return {
        type: types.PLAYER_ZONE_EDIT,
        payload: { id, description, player_position_id }
    }
}

const addPlayerZone = () => async (dispatch, getState) => {
    try {
        const { title, description, player_position_id } = getState().playerZone.playerZone
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(endpoint, { title, description, player_position_id }, 'POST')
        const body = await resp.json()        
        if (body.ok) {
            Swal.fire('Éxito', 'La zona del jugador fue creada', 'success')
            dispatch(push('/playerZones'))
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
        Swal.fire('Error', 'Ocurrió un error guardando la zona del jugador.', 'error')
    } finally {
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: false } })
    }
}

const updatePlayerZone = () => async (dispatch, getState) => {
    try {
        const { id, description, player_position_id } = getState().playerZone.playerZone
        dispatch({ type: types.PLAYER_ZONE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`playerZones/${id}`, { description, player_position_id }, 'PUT')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'La zona del jugador fue actualizada', 'success')
            dispatch(push('/playerZones'))
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
        Swal.fire('Error', 'Ocurrió un error guardando la zona editada.', 'error')
    } finally {
        dispatch({ type: types.PLAYER_ZONE_LOADING, payload: { loading: false } })
    }
}

const deletePlayerZone = (playerZone) => async (dispatch) => {
    try {
        const { id } = playerZone
        dispatch({ type: types.PLAYER_ZONE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`playerZones/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Zona de jugador borrado', 'success')
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
        Swal.fire('Error', 'Ocurrió un error borrando la zona de jugador.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_ZONE_LOADING, payload: { loading: false } })
    }
}

const newPlayerZone = () => ({ type: types.PLAYER_ZONE_NEW })

const updatePlayerZoneProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.PLAYER_ZONE_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { description, player_position } = getState().playerZone.filter;    

    try {
        dispatch({ type: types.PLAYER_ZONE_LOADING, payload: { loading: true } });
        const resp = await fetchConToken('playerZones/search/',
            {
                description: description ? description : '',
                playerPositionId: player_position ? +player_position.value : 0
            }, 'GET');
        const body = await resp.json();
        
        if (body.ok) {
            dispatch({ type: types.PLAYER_ZONE_SET_PLAYER_ZONES, payload: { playerZones: body.playerZones } })
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
        dispatch({ type: types.PLAYER_ZONE_SET_PLAYER_ZONES, payload: { playerZones: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.PLAYER_ZONE_LOADING, payload: { loading: false } })
    }
}

const playerZoneActions = {
    getPlayerZones,
    editPlayerZone,
    addPlayerZone,
    updatePlayerZone,
    deletePlayerZone,
    newPlayerZone,
    updatePlayerZoneProperty,
    applyFilter
}
  
export default playerZoneActions