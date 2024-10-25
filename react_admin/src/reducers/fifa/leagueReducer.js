import { types } from "../../types/types";

const newLeague = {
  id: '',
  name: ''
}

const init = {
  leagues: [],
  loading: false,
  filter: {
    name: null,
  },
  league: newLeague,
}

function leagueReducer(state = init, { type, payload }) {
  switch (type) {
    case types.LEAGUE_SET_LEAGUES:
    case types.LEAGUE_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.LEAGUE_NEW:
        return {
          ...state,
          league: newLeague,
        }
      case types.LEAGUE_EDIT:
        return {
          ...state,
          league: {
            ...payload
          },
        }
      case types.LEAGUE_SET_PROPERTY:
        return {
          ...state,
          league: {
            ...state.league,
            ...payload
          }
        }
      case types.LEAGUE_SET_FILTER:
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

export default leagueReducer;