import { ACTIONS, initialState } from '../models/constants.js';

const filesReducer = (state = initialState.files, action = {}) => {

  switch (action.type) {
    case ACTIONS.FILES.GET:
      const data = action.data;
      return { ...state, all: data };
    case ACTIONS.FILES.SET_LOADING_FILES:
      return { ...state, loading: action.value };
    default:
      return state;
  }
};

export default filesReducer;