import { types } from "../../types/types";

const newActor = {
  id: '',
  name: ''
}

const init = {
  actors: [],
  loading: false,
  filter: {
    name: null,
  },
  actor: newActor,
}

function actorReducer(state = init, { type, payload }) {
  switch (type) {
    case types.ACTOR_SET_ACTORS:
    case types.ACTOR_LOADING:
      return {
        ...state,
        ...payload,
      }
    case types.ACTOR_NEW:
        return {
          ...state,
          actor: newActor,
        }
      case types.ACTOR_EDIT:
        return {
          ...state,
          actor: {
            ...payload
          },
        }
      case types.ACTOR_SET_PROPERTY:
        return {
          ...state,
          actor: {
            ...state.actor,
            ...payload
          }
        }
      case types.ACTOR_SET_FILTER:
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

export default actorReducer;