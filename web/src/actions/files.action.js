import { ACTIONS } from "../models/constants.js";
import { getFilesApi } from '../services/files.service.js';

const getFilesSuccess = data => ({ type: ACTIONS.FILES.GET, data });
const setLoading = value => ({ type: ACTIONS.FILES.SET_LOADING_FILES, value });

export function getFiles() {
  return (dispatch) => {
    dispatch(setLoading(true));
    return getFilesApi().then((data) => {
      dispatch(getFilesSuccess(data));
      dispatch(setLoading(false));
    }).catch(e => {
      dispatch(setLoading(false));
    });
  }
}