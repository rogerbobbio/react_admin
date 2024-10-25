import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';


const getMovies = () => async dispatch => {
    try {
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('movies', {}, 'GET');
        const body = await resp.json();
        //console.log(body);
        if (body.ok) {
            dispatch({ type: types.MOVIE_SET_MOVIES, payload: { movies: body.movies } });
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
        dispatch({ type: types.MOVIE_SET_MOVIES, payload: { movies: [] } });
        Swal.fire('Error', 'Ocurrió un error obteniendo los links.', 'error');
    } finally {
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: false } })
    }
}

const editMovie = (movie) => {
    const { id, description, link, ranking, subtitle, serie, old, converting, pending, 
            note, category_id, actor_id, language_id } = movie
    return {
        type: types.MOVIE_EDIT,
        payload: { id, description, link, ranking, subtitle, serie, old, converting, pending,
                   note, category_id, actor_id, language_id }
    }
}

const addMovie = () => async (dispatch, getState) => {
    try {
        const { description, link, ranking, subtitle, serie, old, converting, pending,
                note, category_id, actor_id, language_id } = getState().movie.movie;
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken('movies', { description, link, ranking, subtitle, serie, old, 
              converting, pending, note, category_id, actor_id, language_id }, 'POST');
        const body = await resp.json();        
        if (body.ok) {
            Swal.fire('Éxito', 'Link creado', 'success');
            dispatch(push('/movies'));
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
        Swal.fire('Error', 'Ocurrió un error guardando un nuevo link.', 'error');
    } finally {
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: false } });
    }
}

const updateMovie = () => async (dispatch, getState) => {
    try {
        const { id, description, link, ranking, subtitle, serie, old, converting, pending,
                note, category_id, actor_id, language_id } = getState().movie.movie;
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: true } });
        const resp = await fetchConToken(`movies/${id}`, { description, link, ranking, subtitle, serie, old, 
            converting, pending, note, category_id, actor_id, language_id }, 'PUT');
        const body = await resp.json()
        if (body.ok) {
            Swal.fire('Éxito', 'Link actualizado', 'success');
            dispatch(push('/movies'));
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
        Swal.fire('Error', 'Ocurrió un error guardando el link editado.', 'error');
    } finally {
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: false } });
    }
}

const deleteMovie = (movie) => async (dispatch, getState) => {
    const { description, category, actor, language, link, converting, pending } = getState().movie.filter;

    try {
        // Verifica si hay algún filtro seleccionado
        const hayFiltros = description || category || actor || language || link || converting || pending;
        const { id } = movie
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`movies/${id}`, {}, 'DELETE');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Link borrado', 'success');
            if (hayFiltros) {
              dispatch(applyFilter());
            } else {
              dispatch(getMovies());
            }
            
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
        Swal.fire('Error', 'Ocurrió un error borrando un link.', 'error');
    } finally {
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: false } });
    }
}

const newMovie = () => ({ type: types.MOVIE_NEW });

const updateMovieProperty = (propertyName, propertyValue) => {
    const payload = { [propertyName]: propertyValue }
    return { type: types.MOVIE_SET_PROPERTY, payload }
}

const applyFilter = () => async (dispatch, getState) => {
    const { description, category, actor, language, link, converting, pending } = getState().movie.filter;

    try {
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: true } });

        let filter = false;

        if (description) { filter = true; }
        if (category) { filter = true; }
        if (actor) { filter = true; }
        if (language) { filter = true; }
        if (converting) { filter = true; }
        if (pending) { filter = true; }
        if (link) { filter = true; }

        if (filter) {
            let endpoint = 'movies/search/byparam/';
            let data = {
                description: description ? description : '',
                link: link ? link : '',
                categoryId: category ? +category.value : 0,
                actorId: actor ? +actor.value : 0,
                languageId: language ? +language.value : 0,
                converting: converting ? +converting.value : 3,
                pending: pending ? +pending.value : 0,
            }

            const resp = await fetchConToken(endpoint, data);
            const body = await resp.json();
                    
            if (body.ok) {
                dispatch({ type: types.MOVIE_SET_MOVIES, payload: { movies: body.movies } })
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
        } else {
            dispatch({ type: types.MOVIE_SET_MOVIES, payload: { movies: [] } })
        }          
        
        
    } catch (e) {
        console.error(e)
        dispatch({ type: types.MOVIE_SET_MOVIES, payload: { movies: [] } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: false } })
    }
}

const movieActions = {
    getMovies,
    editMovie,
    addMovie,
    updateMovie,
    deleteMovie,
    newMovie,
    updateMovieProperty,
    applyFilter
}
  
export default movieActions