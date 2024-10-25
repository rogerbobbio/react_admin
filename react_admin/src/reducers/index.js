import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router';
import { authReducer } from "./authReducer";
import userReducer from "./userReducer";
import roleReducer from "./roleReducer";
import moduleReducer from "./moduleReducer";
import menuOptionReducer from "./menuOptionReducer";
import permissionReducer from "./permissionReducer";
import languageReducer from "./links/languageReducer";
import actorReducer from "./links/actorReducer";
import movieCategoryReducer from "./links/movieCategoryReducer";
import movieReducer from "./links/movieReducer";
import masterDataReducer from "./masterDataReducer";
import countryReducer from './fifa/countryReducer';
import leagueReducer from './fifa/leagueReducer';
import playerPositionReducer from './fifa/playerPositionReducer';
import playerVersionReducer from './fifa/playerVersionReducer';
import playerZoneReducer from './fifa/playerZoneReducer';
import leagueTeamReducer from './fifa/leagueTeamReducer';
import playerReducer from './fifa/playerReducer';


const initialState = {
    sidebarShow: 'responsive'
  }
  
  const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
      case 'set':
        return {...state, ...rest }
      default:
        return state
    }
  }

const rootReducer = (history) => combineReducers({
    nav: changeState,
    auth: authReducer,
    user: userReducer,
    role: roleReducer,
    module: moduleReducer,
    menuOption: menuOptionReducer,
    permission: permissionReducer,
    language: languageReducer,
    actor: actorReducer,
    movieCategory: movieCategoryReducer,
    movie: movieReducer,
    masterData: masterDataReducer,
    country: countryReducer,
    league: leagueReducer,
    playerPosition: playerPositionReducer,
    playerVersion: playerVersionReducer,
    playerZone: playerZoneReducer,
    leagueTeam: leagueTeamReducer,
    player: playerReducer,
    router: connectRouter(history),
});

export default rootReducer;