import { types } from "../types/types";

const newModule = {
  id: '',
  title: '',
  icon: '',
  order_no: ''
}

const init = {
  modules: [],
  loading: false,
  filter: {
    title: null,
  },
  module: newModule,
}

function moduleReducer(state = init, { type, payload }) {
  switch (type) {
    case types.MODULE_SET_MODULES:
    case types.MODULE_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.MODULE_NEW:
        return {
          ...state,
          module: newModule,
        }
      case types.MODULE_EDIT:
        return {
          ...state,
          module: {
            ...payload
          },
        }
      case types.MODULE_SET_PROPERTY:
        return {
          ...state,
          module: {
            ...state.module,
            ...payload
          }
        }
      case types.MODULE_SET_FILTER:
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

export default moduleReducer