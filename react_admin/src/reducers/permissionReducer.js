import { types } from "../types/types";

const newPermission = {
  id: '',
  role_id: '',
  module_id: '',
  screen_id: '',
  access: 0,
  created: 0,
  edit: 0,
  deleted: 0,
  especial1: 0,
  especial2: 0,
  especial3: 0,
  especial4: 0,
  especial5: 0,
}

const init = {
  permissions: [],
  loading: false,
  filter: {
    role: null,
    module: null,
    screen: null,
  },
  permission: newPermission,
}

function permissionReducer(state = init, { type, payload }) {
  switch (type) {
    case types.PERMISSION_SET_PERMISSIONS:
      return {
        ...state,
        ...payload,
      }
    case types.PERMISSION_SET_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...payload,
        }
      }
    case types.PERMISSION_EDIT:
      return {
        ...state,
        permission: {
          ...payload
        },
      }
    case types.PERMISSION_NEW:
      return {
        ...state,
        permission: newPermission,
      }
    case types.PERMISSION_SET_PROPERTY:
      return {
        ...state,
        permission: {
          ...state.permission,
          ...payload
        }
      }
    default:
      return state
  }
}

export default permissionReducer