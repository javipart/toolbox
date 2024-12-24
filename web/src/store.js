import reducerMix from './reducers/index.js';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: reducerMix,
});

export default store;