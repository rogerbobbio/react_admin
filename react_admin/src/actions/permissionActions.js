import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { types } from "../types/types";
import { startLogout } from "./auth";


const getPermissions = () => async dispatch => {
    try {
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('permissions', {}, 'GET')
        const body = await resp.json()
        if (body.ok) {
            dispatch({ type: types.PERMISSION_SET_PERMISSIONS, payload: { permissions: body.permissions } })
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
        dispatch({ type: types.USER_SET_USERS, payload: { permissions: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo permisos.', 'error')
    } finally {
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: false } })
    }
}

const applyFilter = () => async (dispatch, getState) => {    
    const { role, module, screen } = getState().permission.filter;    
    try {
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('permissions/search/main/',
            {
                roleId: role ? +role.value : 0,
                moduleId: module ? +module.value : 0,
                screenId: screen ? +screen.value : 0,
            }, 'GET')        
        const body = await resp.json();        
        if (body.ok) {
            dispatch({ type: types.PERMISSION_SET_PERMISSIONS, payload: { permissions: body.permissions } })
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
        dispatch({ type: types.USER_SET_USERS, payload: { permissions: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo permisos.', 'error')
    } finally {
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: false } })
    }
}

const addPermmission = () => async (dispatch, getState) => {
    try {
        const { role_id, module_id, screen_id, access, created, edit, deleted, especial1, especial2, especial3, especial4, especial5 } = getState().permission.permission
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('permissions', { role_id, module_id, screen_id, access, created, edit, deleted, especial1, especial2, especial3, especial4, especial5 }, 'POST')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Permiso creado', 'success')
            dispatch(push('/permissions'))
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
        Swal.fire('Error', 'Ocurrió un error guardando permiso nuevo.', 'error')
    } finally {
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: false } })
    }
}

const updatePermission = () => async (dispatch, getState) => {
    try {
        const { id, role_id, module_id, screen_id, access, created, edit, deleted, especial1, especial2, especial3, especial4, especial5 } = getState().permission.permission
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`permissions/${id}`, { role_id, module_id, screen_id, access, created, edit, deleted, especial1, especial2, especial3, especial4, especial5 }, 'PUT')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Permiso actualizado', 'success')
            dispatch(push('/permissions'))
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
        Swal.fire('Error', 'Ocurrió un error guardando permiso editado.', 'error')
    } finally {
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: false } })
    }
}

const deletePermission = (permission) => async (dispatch) => {
    try {
        const { id } = permission
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`permissions/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Permiso borrado', 'success')
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
        Swal.fire('Error', 'Ocurrió un error borrando permiso.', 'error')
    } finally {
        dispatch({ type: types.PERMISSION_LOADING, payload: { loading: false } })
    }
}

const updatePermissionProperty = (propertyName, propertyValue) => {    
    const payload = { [propertyName]: propertyValue }
    return { type: types.PERMISSION_SET_PROPERTY, payload }
}

const newPermission = () => ({ type: types.PERMISSION_NEW });

const editPermission = (permission) => {
    const payload = {
        id: permission.id,
        role_id: permission.role_id,
        module_id: permission.module_id,
        screen_id: permission.screen_id,
        access: permission.access,
        created: permission.created,
        edit: permission.edit,
        deleted: permission.deleted,
        especial1: permission.especial1,
        especial2: permission.especial2,
        especial3: permission.especial3,
        especial4: permission.especial4,
        especial5: permission.especial5,
      }
    return {
        type: types.PERMISSION_EDIT,
        payload
    }
}

const permissionActions = {
    getPermissions,
    applyFilter,
    addPermmission,
    updatePermission,
    deletePermission,
    newPermission,
    updatePermissionProperty,
    editPermission
}

export default permissionActions