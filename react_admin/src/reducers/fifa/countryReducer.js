import { types } from "../../types/types";

const newCountry = {
  id: '',
  name: ''
}

const init = {
  countries: [],
  loading: false,
  filter: {
    name: null,
  },
  country: newCountry,
}

function countryReducer(state = init, { type, payload }) {
  switch (type) {
    case types.COUNTRY_SET_COUNTRIES:
    case types.COUNTRY_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.COUNTRY_NEW:
        return {
          ...state,
          country: newCountry,
        }
      case types.COUNTRY_EDIT:
        return {
          ...state,
          country: {
            ...payload
          },
        }
      case types.COUNTRY_SET_PROPERTY:
        return {
          ...state,
          country: {
            ...state.country,
            ...payload
          }
        }
      case types.COUNTRY_SET_FILTER:
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

export default countryReducer;