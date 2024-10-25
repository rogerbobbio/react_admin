import { types } from "../types/types";

const newMenuOption = {
  id: '',
  title: '',
  url: '',
  order_no: '',
  module_id: ''
}

const init = {
  menuOptions: [],
  loading: false,
  filter: {
    title: null,
    module: null,
  },
  menuOption: newMenuOption,
}

function menuOptionReducer(state = init, { type, payload }) {
  switch (type) {
    case types.MENU_OPT_SET_MENU_OPTS:
    case types.MENU_OPT_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.MENU_OPT_NEW:
        return {
          ...state,
          menuOption: newMenuOption,
        }
      case types.MENU_OPT_EDIT:
        return {
          ...state,
          menuOption: {
            ...payload
          },
        }
      case types.MENU_OPT_SET_PROPERTY:
        return {
          ...state,
          menuOption: {
            ...state.menuOption,
            ...payload
          }
        }
      case types.MENU_OPT_SET_FILTER:
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

export default menuOptionReducer