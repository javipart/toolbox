import { combineReducers } from "redux";
import files from "./files.reducer.js";

const reducers = {
    files,
};

const reducerMix = combineReducers(reducers);

export default reducerMix;
