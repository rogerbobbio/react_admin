import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { types } from "../types/types";
import { startLogout } from "./auth";


const getModules = () => async dispatch => {
    try {
        dispatch({ type: types.MODULE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('modules', {}, 'GET')
        const body = await resp.json()
        if (body.ok) {
            dispatch({ type: types.MODULE_SET_MODULES, payload: { modules: body.modules } })
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
        dispatch({ type: types.MODULE_SET_MODULES, payload: { modules: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo los modulos.', 'error')
    } finally {
        dispatch({ type: types.MODULE_LOADING, payload: { loading: false } })
    }
}

const editModule = (module) => {
    const { id, title, icon, order_no } = module
    return {
        type: types.MODULE_EDIT,
        payload: { id, title, icon, order_no }
    }
}

const addModule = () => async (dispatch, getState) => {
    try {
        const { title, icon, order_no } = getState().module.module
        dispatch({ type: types.MODULE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('modules', { title, icon, order_no }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Modulo creado', 'success')
            dispatch(push('/modules'))
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
        Swal.fire('Error', 'Ocurrió un error guardando un modulo nuevo.', 'error')
    } finally {
        dispatch({ type: types.MODULE_LOADING, payload: { loading: false } })
    }
}

const updateModule = () => async (dispatch, getState) => {
    try {
        const { id, title, icon, order_no } = getState().module.module
        dispatch({ type: types.MODULE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`modules/${id}`, { title, icon, order_no }, 'PUT')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Modulo actualizado', 'success')
            dispatch(push('/modules'))
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
        Swal.fire('Error', 'Ocurrió un error guardando el modulo editado.', 'error')
    } finally {
        dispatch({ type: types.MODULE_LOADING, payload: { loading: false } })
    }
}

const deleteModule = (module) => async (dispatch) => {
    try {
        const { id } = module
        dispatch({ type: types.MODULE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`modules/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Modulo borrado', 'success')
            dispatch(moduleActions.getModules())
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
        Swal.fire('Error', 'Ocurrió un error borrando modulo.', 'error');
    } finally {
        dispatch({ type: types.MODULE_LOADING, payload: { loading: false } })
    }
}

const newModule = () => ({ type: types.MODULE_NEW })

const updateModuleProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.MODULE_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { title } = getState().module.filter;    

    try {
        dispatch({ type: types.MODULE_LOADING, payload: { loading: true } });
        let endpoint = 'modules';
        if (title) {
           endpoint = `modules/search/${title}`;
        }

        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        //console.log(body)
        if (body.ok) {
            dispatch({ type: types.MODULE_SET_MODULES, payload: { modules: body.modules } })
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
        dispatch({ type: types.MODULE_SET_MODULES, payload: { modules: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.MODULE_LOADING, payload: { loading: false } })
    }
}

const moduleActions = {
    getModules,
    editModule,
    addModule,
    updateModule,
    newModule,
    updateModuleProperty,
    deleteModule,
    applyFilter
}
  
export default moduleActions