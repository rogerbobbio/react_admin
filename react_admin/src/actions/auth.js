import Swal from "sweetalert2";
import { fetchSinToken, fetchConToken } from "../helpers/fetch"
import { types } from "../types/types";
import { push } from "connected-react-router";

export const startLogin = (email, password) => {
    return async(dispatch) => {
        //console.log(email, password);
        const resp = await fetchSinToken('login',{email, password},'POST');        
        const body = await resp.json();
        //console.log(body);

        if(body.ok){
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(startChecking());            
        } else {
            if (body.msg)
              Swal.fire('Error', body.msg, 'error');
            else 
              Swal.fire('Error', body.errors.email.msg, 'error');
        }
    }
}


export const resetPassword = (userId, oldPassword, newPassword) => {
    return async(dispatch) => {
        console.log(userId, oldPassword, newPassword);
        const resp = await fetchSinToken('login/resetPassword',{userId, oldPassword, newPassword},'POST');
        const body = await resp.json();
        //console.log(body);

        if(body.ok){
            Swal.fire('Éxito', 'Clave actualizada', 'success');
            dispatch(push('/login'));
        } else {
            if (body.msg)
              Swal.fire('Error', body.msg, 'error');
            else 
              Swal.fire('Error', body.errors.email.msg, 'error');
        }
    }
}


export const startChecking = () => {
    return async(dispatch) => {
        //console.log('startChecking');
        const resp = await fetchConToken('login/renew');
        const body = await resp.json();
        //console.log('startChecking', body);
        if(body.ok){
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(login({
                uid: body.user.id,
                name: body.user.userName,
                fullName: body.user.firstName + ' ' + body.user.lastName
            }))
            //Una vez que esta autenticado el usuario se lanza el App.js
        } else {
            dispatch(checkingFinish());
        }
    }
}

const checkingFinish = () => ({ type: types.authCheckingFinish });

const login = (user) => ({
    type: types.authLogin,
    payload: user
});


export const startLogout = () => {
    return (dispatch) => {
        localStorage.removeItem('token');
        localStorage.removeItem('token-init-date');
        dispatch(logout());
    }
}

const logout = () => ({type: types.authLogout});