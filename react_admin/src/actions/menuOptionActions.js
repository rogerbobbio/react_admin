import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { types } from "../types/types";
import { startLogout } from "./auth";


const getMenuOptions = () => async dispatch => {
    try {
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('screens', {}, 'GET')
        const body = await resp.json()
        //console.log(body);
        if (body.ok) {
            dispatch({ type: types.MENU_OPT_SET_MENU_OPTS, payload: { menuOptions: body.screens } })
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
        dispatch({ type: types.MENU_OPT_SET_MENU_OPTS, payload: { menuOptions: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo las opciones de menu.', 'error')
    } finally {
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: false } })
    }
  }

const editMenuOption = (menuOption) => {
    const { id, title, url, order_no, module_id } = menuOption
    return {
        type: types.MENU_OPT_EDIT,
        payload: { id, title, url, order_no, module_id }
    }
}

const addMenuOption = () => async (dispatch, getState) => {
    try {
        const { title, url, order_no, module_id } = getState().menuOption.menuOption
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('screens', { title, url, order_no, module_id }, 'POST')
        const body = await resp.json()        
        if (body.ok) {
            Swal.fire('Éxito', 'La opcion de menu fue creada', 'success')
            dispatch(push('/menuOptions'))
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
        Swal.fire('Error', 'Ocurrió un error guardando la opcion de menu.', 'error')
    } finally {
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: false } })
    }
}

const updateMenuOption = () => async (dispatch, getState) => {
    try {
        const { id, title, url, order_no, module_id } = getState().menuOption.menuOption
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`screens/${id}`, { title, url, order_no, module_id }, 'PUT')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'La opcion de menu fue actualizada', 'success')
            dispatch(push('/menuOptions'))
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
        Swal.fire('Error', 'Ocurrió un error guardando la opcion de menu editado.', 'error')
    } finally {
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: false } })
    }
}

const deleteMenuOption = (menuOption) => async (dispatch) => {
    try {
        const { id } = menuOption
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`screens/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Opcion de menu borrado', 'success')
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
        Swal.fire('Error', 'Ocurrió un error borrando la opcion de menu.', 'error');
    } finally {
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: false } })
    }
}

const newMenuOption = () => ({ type: types.MENU_OPT_NEW })

const updateMenuOptionProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.MENU_OPT_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { title, module } = getState().menuOption.filter;    

    try {
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: true } });
        const resp = await fetchConToken('screens/search/',
            {
                title: title ? title : '',
                moduleId: module ? +module.value : 0
            }, 'GET');
        const body = await resp.json();
        
        if (body.ok) {
            dispatch({ type: types.MENU_OPT_SET_MENU_OPTS, payload: { menuOptions: body.screens } })
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
        dispatch({ type: types.MODULE_SET_MODULES, payload: { menuOptions: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.MENU_OPT_LOADING, payload: { loading: false } })
    }
}

const menuOptionActions = {
    getMenuOptions,
    editMenuOption,
    addMenuOption,
    updateMenuOption,
    deleteMenuOption,
    newMenuOption,
    updateMenuOptionProperty,
    applyFilter
}
  
export default menuOptionActions