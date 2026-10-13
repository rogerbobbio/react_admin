import { push } from "connected-react-router";
import Swal from "sweetalert2";
import { fetchConToken } from "../../helpers/fetch";
import { types } from "../../types/types";
import { startLogout } from '../auth';
import { initialMovieFilter } from '../../reducers/links/movieReducer';


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

const toast = title => Swal.fire({ toast: true, position: 'top-end', icon: 'success', title,
                                   showConfirmButton: false, timer: 2000 });

// Carga un link por id (cuando se abre /movie/:id directamente)
const getMovie = id => async dispatch => {
    try {
        dispatch({ type: types.MOVIE_LOADING, payload: { saving: true } });
        const resp = await fetchConToken(`movies/${id}`, {}, 'GET');
        const body = await resp.json();
        if (body.ok) {
            dispatch(editMovie(body.movie));
        } else {
            Swal.fire('Error', body.msg || 'No se encontró el link.', 'error');
            dispatch(push('/movies'));
        }
    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'Ocurrió un error obteniendo el link.', 'error');
        dispatch(push('/movies'));
    } finally {
        dispatch({ type: types.MOVIE_LOADING, payload: { saving: false } });
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
        dispatch({ type: types.MOVIE_LOADING, payload: { saving: true } })
        const resp = await fetchConToken('movies', { description, link, ranking, subtitle, serie, old,
              converting, pending, note, category_id, actor_id, language_id }, 'POST');
        const body = await resp.json();
        if (body.ok) {
            toast('Link creado');
            dispatch(push('/movies'));
            dispatch(applyFilter());
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
        dispatch({ type: types.MOVIE_LOADING, payload: { saving: false } });
    }
}

const updateMovie = () => async (dispatch, getState) => {
    try {
        const { id, description, link, ranking, subtitle, serie, old, converting, pending,
                note, category_id, actor_id, language_id } = getState().movie.movie;
        dispatch({ type: types.MOVIE_LOADING, payload: { saving: true } });
        const resp = await fetchConToken(`movies/${id}`, { description, link, ranking, subtitle, serie, old,
            converting, pending, note, category_id, actor_id, language_id }, 'PUT');
        const body = await resp.json()
        if (body.ok) {
            toast('Link actualizado');
            dispatch(push('/movies'));
            dispatch(applyFilter());
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
        dispatch({ type: types.MOVIE_LOADING, payload: { saving: false } });
    }
}

const deleteMovie = (movie) => async (dispatch, getState) => {
    try {
        const { id } = movie
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: true } })
        const resp = await fetchConToken(`movies/${id}`, {}, 'DELETE');
        const body = await resp.json();
        if (body.ok) {
            Swal.fire('Éxito', 'Link borrado', 'success');
            dispatch(applyFilter());

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

export const MOVIES_PAGE_SIZE = 25;
export const MIN_SEARCH_LENGTH = 2;

// Cantidad de filtros activos, sin contar el texto de búsqueda
export const countActiveFilters = f =>
    [f.category, f.language, f.actor, f.status, f.rankingMin > 0, f.subtitle, f.old, f.dateFrom, f.dateTo]
        .filter(Boolean).length;

export const hasSearchCriteria = f =>
    f.showAll || f.search.trim().length >= MIN_SEARCH_LENGTH || countActiveFilters(f) > 0;

// Cambia el filtro y vuelve a la página 1 (salvo que se cambie la página)
const setFilter = changes => dispatch => {
    dispatch({ type: types.MOVIE_SET_FILTER, payload: { page: 1, ...changes } });
    dispatch(applyFilter());
}

const clearFilters = () => dispatch => {
    dispatch({ type: types.MOVIE_SET_FILTER, payload: initialMovieFilter });
    dispatch(applyFilter());
}

// Evita que una respuesta lenta pise a una búsqueda más nueva
let lastRequestId = 0;

const applyFilter = () => async (dispatch, getState) => {
    const f = getState().movie.filter;
    const requestId = ++lastRequestId;

    if (!hasSearchCriteria(f)) {
        dispatch({ type: types.MOVIE_SET_MOVIES, payload: { movies: [], totalRecords: 0, loading: false } });
        return;
    }

    try {
        dispatch({ type: types.MOVIE_LOADING, payload: { loading: true } });

        const search = f.search.trim();
        // 1 = sí, 0 = no, 3 = sin filtro
        const data = {
            search: search.length >= MIN_SEARCH_LENGTH ? encodeURIComponent(search) : '',
            categoryId: f.category ? +f.category.value : 0,
            actorId: f.actor ? +f.actor.value : 0,
            languageId: f.language ? +f.language.value : 0,
            pending: f.status === 'pending' ? 1 : f.status === 'ready' ? 0 : 3,
            converting: f.status === 'converting' ? 1 : f.status === 'ready' ? 0 : 3,
            rankingMin: f.rankingMin,
            subtitle: f.subtitle,
            old: f.old,
            dateFrom: f.dateFrom,
            dateTo: f.dateTo,
            orderBy: f.orderBy,
            limit: MOVIES_PAGE_SIZE,
            offset: (f.page - 1) * MOVIES_PAGE_SIZE,
        }

        const resp = await fetchConToken('movies/search/byparam/', data);
        const body = await resp.json();
        if (requestId !== lastRequestId) return;

        if (body.ok) {
            dispatch({ type: types.MOVIE_SET_MOVIES, payload: { movies: body.movies, totalRecords: body.totalRecords } })
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
        if (requestId !== lastRequestId) return;
        console.error(e)
        dispatch({ type: types.MOVIE_SET_MOVIES, payload: { movies: [], totalRecords: 0 } })
        Swal.fire('Error', 'Ocurrió un error en la busqueda de registros.', 'error')
    } finally {
        if (requestId === lastRequestId) {
            dispatch({ type: types.MOVIE_LOADING, payload: { loading: false } })
        }
    }
}

const movieActions = {
    getMovies,
    getMovie,
    editMovie,
    addMovie,
    updateMovie,
    deleteMovie,
    newMovie,
    updateMovieProperty,
    applyFilter,
    setFilter,
    clearFilters
}
  
export default movieActions