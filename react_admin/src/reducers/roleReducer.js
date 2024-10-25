import { types } from "../types/types";

const newRole = {
  id: '',
  description: ''
}

const init = {
  userRoles: [],
  loading: false,
  filter: {
    description: null,
  },
  role: newRole,
}

function roleReducer(state = init, { type, payload }) {
  switch (type) {
    case types.ROLE_SET_ROLES:
    case types.ROLE_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.ROLE_NEW:
        return {
          ...state,
          role: newRole,
        }
      case types.ROLE_EDIT:
        return {
          ...state,
          role: {
            ...payload
          },
        }
      case types.ROLE_SET_PROPERTY:
        return {
          ...state,
          role: {
            ...state.role,
            ...payload
          }
        }
      case types.ROLE_SET_FILTER:
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

export default roleReducer;