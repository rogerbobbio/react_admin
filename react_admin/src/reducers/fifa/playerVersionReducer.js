import { types } from "../../types/types";

const newPlayerVersion = {
  id: '',
  description: ''
}

const init = {
  playerVersions: [],
  loading: false,
  filter: {
    description: null,
  },
  playerVersion: newPlayerVersion,
}

function playerVersionReducer(state = init, { type, payload }) {
  switch (type) {
    case types.PLAYER_VERSION_SET_PLAYER_VERSIONS:
    case types.PLAYER_VERSION_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.PLAYER_VERSION_NEW:
        return {
          ...state,
          playerVersion: newPlayerVersion,
        }
      case types.PLAYER_VERSION_EDIT:
        return {
          ...state,
          playerVersion: {
            ...payload
          },
        }
      case types.PLAYER_VERSION_SET_PROPERTY:
        return {
          ...state,
          playerVersion: {
            ...state.playerVersion,
            ...payload
          }
        }
      case types.PLAYER_VERSION_SET_FILTER:
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

export default playerVersionReducer;