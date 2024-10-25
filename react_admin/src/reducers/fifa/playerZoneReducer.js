import { types } from "../../types/types";

const newPlayerZone = {
  id: '',
  description: '',
  player_position_id: ''
}

const init = {
  playerZones: [],
  loading: false,
  filter: {
    description: null,
    player_position: null,
  },
  playerZone: newPlayerZone,
}

function playerZoneReducer(state = init, { type, payload }) {
  //console.log(type, payload);
  switch (type) {
    case types.PLAYER_ZONE_SET_PLAYER_ZONES:
    case types.PLAYER_ZONE_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.PLAYER_ZONE_NEW:
        return {
          ...state,
          playerZone: newPlayerZone,
        }
      case types.PLAYER_ZONE_EDIT:
        return {
          ...state,
          playerZone: {
            ...payload
          },
        }
      case types.PLAYER_ZONE_SET_PROPERTY:
        return {
          ...state,
          playerZone: {
            ...state.playerZone,
            ...payload
          }
        }
      case types.PLAYER_ZONE_SET_FILTER:
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

export default playerZoneReducer