import { ACTIONS } from "../models/constants.js";
import { getFilesApi } from '../services/files.service.js';

const getFilesSuccess = data => ({ type: ACTIONS.FILES.GET, data });
const setLoading = value => ({ type: ACTIONS.FILES.SET_LOADING_FILES, value });
const setFilterValue = value => ({ type: ACTIONS.FILES.FILTER, value });

export function getFiles(fileName = '') {
  return (dispatch) => {
    dispatch(setLoading(true));
    return getFilesApi(fileName).then((data) => {
      dispatch(getFilesSuccess(data));
      dispatch(setLoading(false));
    }).catch(e => {
      dispatch(setLoading(false));
    });
  }
}

export function setFilter(value) {
  return (dispatch) => {
    dispatch(setFilterValue(value));
  }
}