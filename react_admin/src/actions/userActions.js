import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { types } from "../types/types";
import { startLogout } from "./auth";

const getUsers = () => async dispatch => {
    try {
        dispatch({ type: types.USER_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('users', {}, 'GET')
        const body = await resp.json()
        if (body.ok) {
            dispatch({ type: types.USER_SET_USERS, payload: { users: body.users } })
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
        dispatch({ type: types.USER_SET_USERS, payload: { users: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo usuarios.', 'error')
    } finally {
        dispatch({ type: types.USER_LOADING, payload: { loading: false } })
    }
}

const editUser = (user) => {
    const { id, userName, firstName, lastName, email, password, img, role_id } = user
    return {
        type: types.USER_EDIT,
        payload: { id, userName, firstName, lastName, email, password, img, role_id }
    }
}

const addUser = () => async (dispatch, getState) => {
    try {
        const { userName, email, firstName, lastName, password, role_id } = getState().user.user
        dispatch({ type: types.USER_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('users', { userName, password, firstName, lastName, email, role_id }, 'POST')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Usuario creado', 'success')
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
        Swal.fire('Error', 'Ocurrió un error guardando usuario nuevo.', 'error')
    } finally {
        dispatch({ type: types.USER_LOADING, payload: { loading: false } })
    }
}

const updateUser = () => async (dispatch, getState) => {
    try {
        const { id, userName, email, firstName, lastName, role_id } = getState().user.user
        dispatch({ type: types.USER_LOADING, payload: { loading: true } })
        //console.log('password', password);
        //Cuando se edita un usuario no se debe camhiar el password.
        const resp = await fetchConToken(`users/${id}`, { userName, firstName, lastName, email, role_id }, 'PUT')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Usuario actualizado', 'success')            
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
        Swal.fire('Error', 'Ocurrió un error guardando usuario editado.', 'error')
    } finally {
        dispatch({ type: types.USER_LOADING, payload: { loading: false } })
    }
}

const updateUserProfile = () => async (dispatch, getState) => {
    try {
        const { id, userName, email, firstName, lastName, password, role_id } = getState().user.user;
        dispatch({ type: types.USER_LOADING, payload: { loading: true } });        

        let formData = { userName, firstName, lastName, email, role_id }
        if (password !== ''){
           formData = { userName, password, firstName, lastName, email, role_id }
        }

        const resp = await fetchConToken(`users/${id}`, formData , 'PUT');        
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Perfil del usuario actualizado', 'success');
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
        Swal.fire('Error', 'Ocurrió un error guardando usuario editado.', 'error')
    } finally {
        dispatch({ type: types.USER_LOADING, payload: { loading: false } })
    }
}

const deleteUser = (user) => async (dispatch) => {
    try {
        const { id } = user
        dispatch({ type: types.USER_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`users/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Usuario borrado', 'success')
            dispatch(userActions.getUsers())
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
        Swal.fire('Error', 'Ocurrió un error borrando usuario.', 'error')
    } finally {
        dispatch({ type: types.USER_LOADING, payload: { loading: false } })
    }
}

const newUser = () => ({ type: types.USER_NEW })

const updateUserProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    if (propertyName === 'userName')
        payload["email"] = propertyValue
    return { type: types.USER_SET_PROPERTY, payload }
}

const getUserById = (userId) => async dispatch => {
    try {
        dispatch({ type: types.USER_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`users/${userId}`, {}, 'GET')
        const body = await resp.json()
        if (body.ok) {
            //console.log(body);
            const { id, userName, firstName, lastName, email, password, img, role_id } = body.user
            dispatch({ type: types.USER_EDIT, payload: { id, userName, firstName, lastName, email, password, img, role_id } })
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
        Swal.fire('Error', 'Ocurrió un error obteniendo la informacion del usuario.', 'error');
    } finally {
        dispatch({ type: types.USER_LOADING, payload: { loading: false } })
    }
}

const applyFilter = () => async (dispatch, getState) => {
    const { userName } = getState().user.filter;    

    try {
        dispatch({ type: types.USER_LOADING, payload: { loading: true } });
        let endpoint = 'users';
        if (userName) {
           endpoint = `users/search/${userName}`;
        } 
        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        //console.log(body)
        if (body.ok) {
            dispatch({ type: types.USER_SET_USERS, payload: { users: body.users } })
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
        dispatch({ type: types.USER_SET_USERS, payload: { users: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.USER_LOADING, payload: { loading: false } })
    }
}

const userActions = {
    getUsers,
    addUser,
    updateUser,
    newUser,
    editUser,
    deleteUser,
    updateUserProperty,
    getUserById,
    updateUserProfile,
    applyFilter
}

export default userActions