import { types } from "../../types/types";

const newPlayer = {
  id: '',
  name: '',
  league_id: 0, 
  league_team_id: 0, 
  player_version_id: 1, 
  player_position_id: 0, 
  player_zone_id: 0,
  country_id: 0,
  rating: null,
  player_type: 'NORMAL',
  duplicate: 1,
  duplicate_times: 0,
  player_seleted: 0,
  player_deleted: false,  
  order_number: null,
  datetime_deleted: null,
}

const init = {
  players: [],
  playersDuplicate: [],
  loading: false,
  filter: {
    name: null,
    league: null,
    leagueTeam: null,
    playerVersion: null,
    playerPosition: null, 
    playerZone: null,
    country: null,
    rating: null,
    playerType: null,
    duplicateTimes: null,
    duplicate: false,
    playerSeleted: false,
    playerDeleted: false,  
    orderBy1: null
  },
  player: newPlayer,
}

function playerReducer(state = init, { type, payload }) {
  switch (type) {
    case types.PLAYER_SET_PLAYERS:
    case types.PLAYER_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.PLAYER_NEW:
        return {
          ...state,
          player: newPlayer,
        }
      case types.PLAYER_EDIT:
        return {
          ...state,
          player: {
            ...payload
          },
        }
      case types.PLAYER_SET_PROPERTY:
        return {
          ...state,
          player: {
            ...state.player,
            ...payload
          }
        }
      case types.PLAYER_SET_FILTER:
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

export default playerReducer;