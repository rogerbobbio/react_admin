import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';


const getActors = () => async dispatch => {
    try {
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('actors', {}, 'GET')
        const body = await resp.json()
        if (body.ok) {
            dispatch({ type: types.ACTOR_SET_ACTORS, payload: { actors: body.actors } })
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
        dispatch({ type: types.ACTOR_SET_ACTORS, payload: { actors: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo los idiomas.', 'error')
    } finally {
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: false } })
    }
}

const editActor = (actor) => {
    const { id, name } = actor
    return {
        type: types.ACTOR_EDIT,
        payload: { id, name }
    }
}

const addActor = () => async (dispatch, getState) => {
    try {
        const { title, name } = getState().actor.actor
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('actors', { title, name }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Actor creado', 'success');
            dispatch(push('/actors'));
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
        Swal.fire('Error', 'Ocurrió un error guardando un actor.', 'error');
    } finally {
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: false } });
    }
}

const updateActor = () => async (dispatch, getState) => {
    try {
        const { id, name } = getState().actor.actor
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`actors/${id}`, { name }, 'PUT');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Actor actualizado', 'success');
            dispatch(push('/actors'));
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
        Swal.fire('Error', 'Ocurrió un error guardando el actor editado.', 'error');
    } finally {
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: false } });
    }
}

const deleteActor = (actor) => async (dispatch) => {
    try {
        const { id } = actor
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`actors/${id}`, {}, 'DELETE');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Actor borrado', 'success');
            dispatch(getActors());
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
        Swal.fire('Error', 'Ocurrió un error borrando actor.', 'error');
    } finally {
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: false } })
    }
}

const newActor = () => ({ type: types.ACTOR_NEW })

const updateActorProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.ACTOR_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { name } = getState().actor.filter;    

    try {
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: true } });
        let endpoint = 'actors';
        if (name) {
           endpoint = `actors/search/${name}`;
        }

        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        //console.log(body)
        if (body.ok) {
            dispatch({ type: types.ACTOR_SET_ACTORS, payload: { actors: body.actors } })
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
        dispatch({ type: types.ACTOR_SET_ACTORS, payload: { actors: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.ACTOR_LOADING, payload: { loading: false } })
    }
}

const actorActions = {
    getActors,
    editActor,
    addActor,
    updateActor,
    deleteActor,
    newActor,
    updateActorProperty,
    applyFilter
}
  
export default actorActions