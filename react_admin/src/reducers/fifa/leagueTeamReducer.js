import { types } from "../../types/types";

const newLeagueTeam = {
  id: '',
  name: '',
  league_id: ''
}

const init = {
  leagueTeams: [],
  loading: false,
  filter: {
    name: null,
    league: null,
  },
  leagueTeam: newLeagueTeam,
}

function leagueTeamReducer(state = init, { type, payload }) {
  //console.log(type, payload);
  switch (type) {
    case types.LEAGUE_TEAM_SET_LEAGUE_TEAMS:
    case types.LEAGUE_TEAM_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.LEAGUE_TEAM_NEW:
        return {
          ...state,
          leagueTeam: newLeagueTeam,
        }
      case types.LEAGUE_TEAM_EDIT:
        return {
          ...state,
          leagueTeam: {
            ...payload
          },
        }
      case types.LEAGUE_TEAM_SET_PROPERTY:
        return {
          ...state,
          leagueTeam: {
            ...state.leagueTeam,
            ...payload
          }
        }
      case types.LEAGUE_TEAM_SET_FILTER:
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

export default leagueTeamReducer