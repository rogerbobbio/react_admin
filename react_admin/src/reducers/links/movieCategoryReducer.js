import { types } from "../../types/types";

const newMovieCategory = {
  id: '',
  description: ''
}

const init = {
  movieCategories: [],
  loading: false,
  filter: {
    description: null,
  },
  movieCategory: newMovieCategory,
}

function movieCategoryReducer(state = init, { type, payload }) {
  switch (type) {
    case types.MOVIE_CATEGORY_SET_MOVIE_CATEGORIES:
    case types.MOVIE_CATEGORY_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.MOVIE_CATEGORY_NEW:
        return {
          ...state,
          movieCategory: newMovieCategory,
        }
      case types.MOVIE_CATEGORY_EDIT:
        return {
          ...state,
          movieCategory: {
            ...payload
          },
        }
      case types.MOVIE_CATEGORY_SET_PROPERTY:
        return {
          ...state,
          movieCategory: {
            ...state.movieCategory,
            ...payload
          }
        }
      case types.MOVIE_CATEGORY_SET_FILTER:
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

export default movieCategoryReducer;