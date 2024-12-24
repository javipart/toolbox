import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./components/Dashboard/Dashboard', () => () => 'Dashboard');
jest.mock('./components/Navbar/NavbarTool', () => () => 'Navbar');
jest.mock('react-redux', () => ({
  Provider: ({ children }) => children,
}));
jest.mock('./store.js', () => ({
  __esModule: true,
  default: {}
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});