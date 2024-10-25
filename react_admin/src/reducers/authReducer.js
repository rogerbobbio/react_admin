import { types } from '../types/types';

const initialState = {
    checking: true, //para saber si esta autenticado
    uid: null,
    name: null
}

export const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.authLogin:
            return {
                ...state,
                ...action.payload,
                checking: false
            }
        case types.authCheckingFinish:
            return {
                ...state,
                checking: false
            }
        case types.authLogout:
            return {
                checking: false
            }
        
    
        default:
            return state;
    }

}