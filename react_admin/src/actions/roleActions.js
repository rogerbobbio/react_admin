import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken, fetchSinToken } from "../helpers/fetch";
import { types } from "../types/types";
import { startLogout } from "./auth";

const getRoles = () => async dispatch => {
  try {      
      dispatch({ type: types.ROLE_LOADING, payload: { loading: true } })
      const resp = await fetchConToken('userRoles', {}, 'GET')
      const body = await resp.json()
      if (body.ok) {
          dispatch({ type: types.ROLE_SET_ROLES, payload: { userRoles: body.userRoles } })
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
      dispatch({ type: types.ROLE_SET_ROLES, payload: { userRoles: [] } })
      Swal.fire('Error', 'Ocurrió un error obteniendo los roles.', 'error')
  } finally {
      dispatch({ type: types.ROLE_LOADING, payload: { loading: false } })
  }
}

const editRole = (role) => {
    const { id, description, is_system } = role
    return {
        type: types.ROLE_EDIT,
        payload: { id, description, is_system }
    }
}

const addRole = () => async (dispatch, getState) => {
    try {
        const { description, is_system } = getState().role.role
        dispatch({ type: types.ROLE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('userRoles', { description, is_system }, 'POST')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Rol creado', 'success')
            dispatch(push('/roles'))
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
        Swal.fire('Error', 'Ocurrió un error guardando un rol nuevo.', 'error')
    } finally {
        dispatch({ type: types.ROLE_LOADING, payload: { loading: false } })
    }
}

const updateRole = () => async (dispatch, getState) => {
    try {
        const { id, description, is_system } = getState().role.role
        dispatch({ type: types.ROLE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`userRoles/${id}`, { description, is_system }, 'PUT')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Rol actualizado', 'success')
            dispatch(push('/roles'))
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
        Swal.fire('Error', 'Ocurrió un error guardando rol editado.', 'error')
    } finally {
        dispatch({ type: types.ROLE_LOADING, payload: { loading: false } })
    }
}

const deleteRole = (role) => async (dispatch) => {
    try {
        const { id } = role
        dispatch({ type: types.ROLE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`userRoles/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Rol borrado', 'success')
            dispatch(roleActions.getRoles())
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
        Swal.fire('Error', 'Ocurrió un error borrando rol.', 'error');
    } finally {
        dispatch({ type: types.ROLE_LOADING, payload: { loading: false } })
    }
}

const newRole = () => ({ type: types.ROLE_NEW })

const updateRoleProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }    
    return { type: types.ROLE_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { description } = getState().role.filter;    

    try {
        dispatch({ type: types.ROLE_LOADING, payload: { loading: true } });
        let endpoint = 'userRoles';
        if (description) {
           endpoint = `userRoles/search/${description}`;
        }

        const resp = await fetchSinToken(endpoint);
        const body = await resp.json();
        
        //console.log(body)
        if (body.ok) {
            dispatch({ type: types.ROLE_SET_ROLES, payload: { userRoles: body.userRoles } })
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
        dispatch({ type: types.ROLE_SET_ROLES, payload: { userRoles: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.ROLE_LOADING, payload: { loading: false } })
    }
}

const roleActions = {
  getRoles,
  editRole,
  addRole,
  updateRole,
  newRole,
  updateRoleProperty,
  deleteRole,
  applyFilter
}

export default roleActions