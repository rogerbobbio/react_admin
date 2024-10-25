import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';


const getLanguages = () => async dispatch => {
    try {
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('languages', {}, 'GET')
        const body = await resp.json()
        if (body.ok) {
            dispatch({ type: types.LANGUAGE_SET_LANGUAGES, payload: { languages: body.languages } })
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
        dispatch({ type: types.LANGUAGE_SET_LANGUAGES, payload: { languages: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo los idiomas.', 'error')
    } finally {
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: false } })
    }
}

const editLanguage = (language) => {
    const { id, description } = language
    return {
        type: types.LANGUAGE_EDIT,
        payload: { id, description }
    }
}

const addLanguage = () => async (dispatch, getState) => {
    try {
        const { title, description } = getState().language.language
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('languages', { title, description }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Idioma creado', 'success');
            dispatch(push('/languages'));
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
        Swal.fire('Error', 'Ocurrió un error guardando un lenguaje nuevo.', 'error');
    } finally {
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: false } });
    }
}

const updateLanguage = () => async (dispatch, getState) => {
    try {
        const { id, description } = getState().language.language
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`languages/${id}`, { description }, 'PUT')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Idioma actualizado', 'success');
            dispatch(push('/lenguages'));
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
        Swal.fire('Error', 'Ocurrió un error guardando el lenguaje editado.', 'error');
    } finally {
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: false } });
    }
}

const deleteLanguage = (language) => async (dispatch) => {
    try {
        const { id } = language
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`languages/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Idioma borrado', 'success');
            dispatch(getLanguages());
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
        Swal.fire('Error', 'Ocurrió un error borrando idioma.', 'error');
    } finally {
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: false } })
    }
}

const newLanguage = () => ({ type: types.LANGUAGE_NEW })

const updateLanguageProperty = (propertyName, propertyValue) => {    
    const payload = { [propertyName]: propertyValue }    
    return { type: types.LANGUAGE_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { description } = getState().language.filter;    

    try {
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: true } });
        let endpoint = 'languages';
        if (description) {
           endpoint = `languages/search/${description}`;
        }

        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        //console.log(body)
        if (body.ok) {
            dispatch({ type: types.LANGUAGE_SET_LANGUAGES, payload: { languages: body.languages } })
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
        dispatch({ type: types.LANGUAGE_SET_LANGUAGES, payload: { languages: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.LANGUAGE_LOADING, payload: { loading: false } })
    }
}

const languageActions = {
    getLanguages,
    editLanguage,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    newLanguage,
    updateLanguageProperty,
    applyFilter
}
  
export default languageActions