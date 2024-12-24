import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import store from './store.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
