import { types } from "../../types/types";

const newLanguage = {
  id: '',
  description: ''
}

const init = {
  languages: [],
  loading: false,
  filter: {
    description: null,
  },
  language: newLanguage,
}

function languageReducer(state = init, { type, payload }) {
  switch (type) {
    case types.LANGUAGE_SET_LANGUAGES:
    case types.LANGUAGE_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.LANGUAGE_NEW:
        return {
          ...state,
          language: newLanguage,
        }
      case types.LANGUAGE_EDIT:
        return {
          ...state,
          language: {
            ...payload
          },
        }
      case types.LANGUAGE_SET_PROPERTY:
        return {
          ...state,
          language: {
            ...state.language,
            ...payload
          }
        }
      case types.LANGUAGE_SET_FILTER:
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

export default languageReducer;