import { types } from "../../types/types";

const newMovie = {
  id: '',
  description: '',
  link: '',
  ranking: 3,
  subtitle: 0,
  serie: 0,
  old: 0,
  converting: 0,
  pending: 0,
  note: '',
  // Sin valores precargados: se eligen siempre a conciencia
  category_id: '',
  actor_id: '',
  language_id: ''
}

export const initialMovieFilter = {
  search: '',
  category: null,
  language: null,
  actor: null,
  status: null,       // 'pending' | 'converting' | 'ready'
  rankingMin: 0,
  subtitle: '',       // '' | '1' | '0'
  old: '',            // '' | '1' | '0'
  dateFrom: '',
  dateTo: '',
  orderBy: 'recent',
  page: 1,
  showAll: false,
}

const init = {
  movies: [],
  totalRecords: 0,
  loading: false,
  saving: false,
  filter: initialMovieFilter,
  movie: newMovie,
}

function movieReducer(state = init, { type, payload }) {
  switch (type) {
    case types.MOVIE_SET_MOVIES:
    case types.MOVIE_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.MOVIE_NEW:
        return {
          ...state,
          movie: newMovie,
        }
      case types.MOVIE_EDIT:
        return {
          ...state,
          movie: {
            ...payload
          },
        }
      case types.MOVIE_SET_PROPERTY:
        return {
          ...state,
          movie: {
            ...state.movie,
            ...payload
          }
        }
      case types.MOVIE_SET_FILTER:
            return {
              ...state,
              filter: {
                ...state.filter,
                ...payload,
              }
            }
    default:
      return state
  }
}

export default movieReducer;