import { types } from "../../types/types";

const newMovie = {
  id: '',
  description: '',
  link: '',
  ranking: '3',
  subtitle: false,
  serie: false,
  old: false,
  converting: false,
  pending: false,
  note: '', 
  category_id: 0, 
  actor_id: 2,
  language_id: 1
}

const init = {
  movies: [],
  loading: false,
  filter: {
    description: null,
    link: null,
    category: null,
    actor: null,
    language: null,
    converting: null,
    pending: null,
  },
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