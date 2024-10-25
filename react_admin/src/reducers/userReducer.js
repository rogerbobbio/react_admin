import { types } from "../types/types";

const newUser = {
  id: '',
  userName: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  img: '',
  role_id: ''
}

const init = {
  users: [],
  loading: false,
  filter: {
    userName: null,
  },
  user: newUser,
}

function userReducer(state = init, { type, payload }) {
  switch (type) {
    case types.USER_SET_USERS:
    case types.USER_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.USER_NEW:
      return {
        ...state,
        user: newUser,
      }
    case types.USER_EDIT:
      return {
        ...state,
        user: {
          ...payload
        },
      }
    case types.USER_SET_PROPERTY:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload
        }
      }
    case types.USER_SET_FILTER:
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

export default userReducer;