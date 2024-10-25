import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';

var endpoint = 'countries';

const getCountries = () => async dispatch => {
    try {
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(endpoint, {}, 'GET');
        const body = await resp.json();
        if (body.ok) {
            dispatch({ type: types.COUNTRY_SET_COUNTRIES, payload: { countries: body.countries } })
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
        dispatch({ type: types.COUNTRY_SET_COUNTRIES, payload: { countries: [] } });
        Swal.fire('Error', 'Ocurrió un error obteniendo los paises.', 'error');
    } finally {
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: false } });
    }
}

const editCountry = (country) => {
    const { id, name } = country
    return {
        type: types.COUNTRY_EDIT,
        payload: { id, name }
    }
}

const addCountry = () => async (dispatch, getState) => {
    try {
        const { title, name } = getState().country.country;
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(endpoint, { title, name }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Pais creado', 'success');
            dispatch(push('/countries'));
        } else {            
            if (body.msg) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg);
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e);        
        Swal.fire('Error', 'Ocurrió un error guardando un pais.', 'error');
    } finally {
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: false } });
    }
}

const updateCountry = () => async (dispatch, getState) => {
    try {
        const { id, name } = getState().country.country;
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`countries/${id}`, { name }, 'PUT');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Pais actualizado', 'success');
            dispatch(push('/countries'));
        } else {
            if (body.msg) {
                Swal.fire('Error', body.msg, 'error');
            } else {
                const errors = Object.keys(body.errors).map(e => body.errors[e].msg);
                console.log('Error', errors);
                Swal.fire('Error', errors[0], 'error');
            }
        }
    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'Ocurrió un error guardando el pais editado.', 'error');
    } finally {
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: false } });
    }
}

const deleteCountry = (country) => async (dispatch) => {
    try {
        const { id } = country;
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`countries/${id}`, {}, 'DELETE');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Pais borrado', 'success');
            dispatch(getCountries());
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
        Swal.fire('Error', 'Ocurrió un error borrando el pais.', 'error');
    } finally {
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: false } });
    }
}

const newCountry = () => ({ type: types.COUNTRY_NEW });

const updateCountryProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.COUNTRY_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { name } = getState().country.filter;

    try {
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: true } });
        if (name) {
           endpoint = `countries/search/${name}`;
        } else
           endpoint = 'countries';

        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        if (body.ok) {
            dispatch({ type: types.COUNTRY_SET_COUNTRIES, payload: { countries: body.countries } });
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
        dispatch({ type: types.COUNTRY_SET_COUNTRIES, payload: { countries: [] } });
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error');
    } finally {
        dispatch({ type: types.COUNTRY_LOADING, payload: { loading: false } });
    }
}

const countryActions = {
    getCountries,
    editCountry,
    addCountry,
    updateCountry,
    deleteCountry,
    newCountry,
    updateCountryProperty,
    applyFilter
}
  
export default countryActions