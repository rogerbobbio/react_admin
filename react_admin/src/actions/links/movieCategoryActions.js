import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';


const getMovieCategories = () => async dispatch => {
    try {        
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('movieCategories', {}, 'GET')
        const body = await resp.json()
        //console.log(body);
        if (body.ok) {
            dispatch({ type: types.MOVIE_CATEGORY_SET_MOVIE_CATEGORIES, payload: { movieCategories: body.categories } })
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
        dispatch({ type: types.MOVIE_CATEGORY_SET_MOVIE_CATEGORIES, payload: { movieCategories: [] } })
        Swal.fire('Error', 'Ocurrió un error obteniendo las categorias de link.', 'error')
    } finally {
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: false } })
    }
}

const editMovieCategory = (movieCategory) => {
    const { id, description } = movieCategory
    return {
        type: types.MOVIE_CATEGORY_EDIT,
        payload: { id, description }
    }
}

const addMovieCategory = () => async (dispatch, getState) => {
    try {
        const { title, description } = getState().movieCategory.movieCategory
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('movieCategories', { title, description }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Categoria de link creado', 'success');
            dispatch(push('/movieCategories'));
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
        Swal.fire('Error', 'Ocurrió un error guardando una categoria de link nueva.', 'error');
    } finally {
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: false } });
    }
}

const updateMovieCategory = () => async (dispatch, getState) => {
    try {
        const { id, description } = getState().movieCategory.movieCategory
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`movieCategories/${id}`, { description }, 'PUT')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Categoria de link actualizada', 'success');
            dispatch(push('/movieCategories'));
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
        Swal.fire('Error', 'Ocurrió un error guardando la categoria de link editada.', 'error');
    } finally {
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: false } });
    }
}

const deleteMovieCategory = (movieCategory) => async (dispatch) => {
    try {
        const { id } = movieCategory
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`movieCategories/${id}`, {}, 'DELETE')
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Categoria de link eliminada', 'success');
            dispatch(getMovieCategories());
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
        Swal.fire('Error', 'Ocurrió un error borrando una categoria de link.', 'error');
    } finally {
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: false } })
    }
}

const newMovieCategory = () => ({ type: types.MOVIE_CATEGORY_NEW })

const updateMovieCategoryProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.MOVIE_CATEGORY_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { description } = getState().movieCategory.filter;    

    try {
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: true } });
        let endpoint = 'movieCategories';
        if (description) {
           endpoint = `movieCategories/search/${description}`;
        }

        const resp = await fetchConToken(endpoint);
        const body = await resp.json();
        
        //console.log(body)
        if (body.ok) {
            dispatch({ type: types.MOVIE_CATEGORY_SET_MOVIE_CATEGORIES, payload: { movieCategories: body.categories } })
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
        dispatch({ type: types.MOVIE_CATEGORY_SET_MOVIE_CATEGORIES, payload: { movieCategories: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.MOVIE_CATEGORY_LOADING, payload: { loading: false } })
    }
}

const movieCategoryActions = {
    getMovieCategories,
    editMovieCategory,
    addMovieCategory,
    updateMovieCategory,
    deleteMovieCategory,
    newMovieCategory,
    updateMovieCategoryProperty,
    applyFilter
}
  
export default movieCategoryActions