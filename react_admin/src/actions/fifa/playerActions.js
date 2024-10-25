import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';


const getPlayers = () => async dispatch => {
    try {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('players', {}, 'GET');
        const body = await resp.json();
        //console.log(body);
        if (body.ok) {
            dispatch({ type: types.PLAYER_SET_PLAYERS, payload: { players: body.players } });
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
        dispatch({ type: types.PLAYER_SET_PLAYERS, payload: { players: [] } });
        Swal.fire('Error', 'Ocurrió un error obteniendo los jugadores.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: false } })
    }
}

const getPlayersDuplicate = () => async dispatch => {
    try {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('players/search/playersDuplicate/', {}, 'GET');
        const body = await resp.json();
        //console.log(body);
        if (body.ok) {
            dispatch({ type: types.PLAYER_SET_PLAYERS, payload: { playersDuplicate: body.players } });
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
        dispatch({ type: types.PLAYER_SET_PLAYERS, payload: { playersDuplicate: [] } });
        Swal.fire('Error', 'Ocurrió un error obteniendo los jugadores.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: false } })
    }
}

const editPlayer = (player) => {
    const { id, name, league_id, league_team_id, player_version_id, 
            player_position_id, player_zone_id, country_id, rating, player_type,
            duplicate, duplicate_times, player_seleted, player_deleted, order_number, datetime_deleted } = player;
    return {
        type: types.PLAYER_EDIT,
        payload: { id, name, league_id, league_team_id, player_version_id, 
            player_position_id, player_zone_id, country_id, rating, player_type,
            duplicate, duplicate_times, player_seleted, player_deleted, order_number, datetime_deleted }
    }
}

const addPlayer = () => async (dispatch, getState) => {
    try {
        const { name, league_id, league_team_id, player_version_id, 
            player_position_id, player_zone_id, country_id, rating, player_type,
            duplicate, duplicate_times, player_seleted, player_deleted, order_number } = getState().player.player;
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('players', { name, league_id, league_team_id, player_version_id, 
            player_position_id, player_zone_id, country_id, rating, player_type,
            duplicate, duplicate_times, player_seleted, player_deleted, order_number }, 'POST');
        const body = await resp.json();        
        if (body.ok) {
            Swal.fire('Éxito', 'Jugador creado', 'success');
            dispatch(push('/players'));
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
        console.error(e);        
        Swal.fire('Error', 'Ocurrió un error guardando un nuevo jugador.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: false } });
    }
}

const updatePlayer = () => async (dispatch, getState) => {
    try {
        const { id, name, league_id, league_team_id, player_version_id, 
            player_position_id, player_zone_id, country_id, rating, player_type,
            duplicate, duplicate_times, player_seleted, player_deleted, order_number } = getState().player.player;
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: true } });        

        const resp = await fetchConToken(`players/${id}`, { name, league_id, league_team_id, player_version_id, 
            player_position_id, player_zone_id, country_id, rating, player_type,
            duplicate, duplicate_times, player_seleted, player_deleted, order_number }, 'PUT');
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Jugador actualizado', 'success');
            dispatch(push('/players'));
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
        Swal.fire('Error', 'Ocurrió un error guardando el jugador editado.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: false } });
    }
}

const selectPlayer = (player) => async (dispatch, getState) => {
    try {
        const { id, name, league_id, league_team_id, player_version_id, 
            player_position_id, player_zone_id, country_id, rating, player_type,
            duplicate, duplicate_times, player_seleted, player_deleted, order_number } = player;
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: true } });

        //console.log(player_seleted);

        const resp = await fetchConToken(`players/${id}`, { name, league_id, league_team_id, player_version_id, 
            player_position_id, player_zone_id, country_id, rating, player_type,
            duplicate, duplicate_times, player_seleted, player_deleted, order_number }, 'PUT');
        const body = await resp.json()
        if (body.ok) {
            dispatch(push('/players'));
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
        Swal.fire('Error', 'Ocurrió un error guardando el jugador editado.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: false } });
    }
}

const deletePlayer = (player) => async (dispatch) => {
    try {
        const { id } = player
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`players/${id}`, {}, 'DELETE');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Jugador borrado', 'success');
            dispatch(getPlayers());
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
        Swal.fire('Error', 'Ocurrió un error borrando un jugador.', 'error');
    } finally {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: false } });
    }
}

const newPlayer = () => ({ type: types.PLAYER_NEW });

const updatePlayerProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.PLAYER_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { name,
            league,
            leagueTeam,
            playerVersion,
            playerPosition, 
            playerZone,
            country,
            rating,
            playerType,
            duplicate,
            playerSeleted,
            player_deleted,
            duplicateTimes,
            orderBy1 } = getState().player.filter;

    try {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: true } });

        let filter = false;

        if (name) { filter = true; }
        if (league) { filter = true; }
        if (leagueTeam) { filter = true; }
        if (playerVersion) { filter = true; }
        if (playerPosition) { filter = true; }
        if (playerZone) { filter = true; }
        if (country) { filter = true; }
        if (rating) { filter = true; }
        if (playerType) { filter = true; }
        if (duplicate) { filter = true; }
        if (playerSeleted) { filter = true; }
        if (player_deleted) { filter = true; }
        if (orderBy1) { filter = true; }
        if (duplicateTimes) { filter = true; }

        if (filter) {
            let endpoint = 'players/search/byparam/';
            let data = {
                name: name ? name : '',
                leagueId: league ? +league.value : 0,
                leagueTeamId: leagueTeam ? +leagueTeam.value : 0,
                playerVersionId: playerVersion ? +playerVersion.value : 0,
                playerPositionId: playerPosition ? +playerPosition.value : 0,
                playerZoneId: playerZone ? +playerZone.value : 0,
                countryId: country ? +country.value : 0,
                rating: rating ? +rating.value : 0,
                playerType: playerType ? playerType.value : '',
                duplicate: duplicate ? +duplicate.value : 3,
                playerSeleted: playerSeleted ? +playerSeleted.value : 3,
                playerDeleted: player_deleted ? +player_deleted.value : 0,
                orderBy1: orderBy1 ? orderBy1 : '',
                duplicateTimes: duplicateTimes ? +duplicateTimes.value : ''
            } 

            console.log(endpoint, data);

            const resp = await fetchConToken(endpoint, data);
            const body = await resp.json();
                    
            if (body.ok) {
                dispatch({ type: types.PLAYER_SET_PLAYERS, payload: { players: body.players } })
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
        } else {
            const resp = await fetchConToken('players', {}, 'GET');
            const body = await resp.json();
            if (body.ok) {
                dispatch({ type: types.PLAYER_SET_PLAYERS, payload: { players: body.players } });
            } else {
                dispatch({ type: types.PLAYER_SET_PLAYERS, payload: { players: [] } })
            }
        }          
        
        
    } catch (e) {
        console.error(e)
        dispatch({ type: types.PLAYER_SET_PLAYERS, payload: { players: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.PLAYER_LOADING, payload: { loading: false } })
    }
}

const playerActions = {
    getPlayers,
    editPlayer,
    addPlayer,
    updatePlayer,
    deletePlayer,
    newPlayer,
    updatePlayerProperty,
    applyFilter,
    selectPlayer,
    getPlayersDuplicate
}
  
export default playerActions