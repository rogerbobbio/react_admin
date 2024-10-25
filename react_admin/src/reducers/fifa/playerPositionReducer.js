import { types } from "../../types/types";

const newPlayerPosition = {
  id: '',
  description: ''
}

const init = {
  playerPositions: [],
  loading: false,
  filter: {
    description: null,
  },
  playerPosition: newPlayerPosition,
}

function playerPositionReducer(state = init, { type, payload }) {
  switch (type) {
    case types.PLAYER_POSITION_SET_PLAYER_POSITIONS:
    case types.PLAYER_POSITION_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.PLAYER_POSITION_NEW:
        return {
          ...state,
          playerPosition: newPlayerPosition,
        }
      case types.PLAYER_POSITION_EDIT:
        return {
          ...state,
          playerPosition: {
            ...payload
          },
        }
      case types.PLAYER_POSITION_SET_PROPERTY:
        return {
          ...state,
          playerPosition: {
            ...state.playerPosition,
            ...payload
          }
        }
      case types.PLAYER_POSITION_SET_FILTER:
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

export default playerPositionReducer;