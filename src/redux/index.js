import { combineReducers } from "redux";
import user from "./reducer/user";
import modals from "./reducer/modals";
import { DESTROY_SESSION } from "./types";

const reducer = combineReducers({
  user: user,
  modals: modals,
});

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  if (action.type === DESTROY_SESSION)
    state = {
      ...state,
      user: {},
    };

  return reducer(state, action);
};

export default rootReducer;
