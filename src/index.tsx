import store from '@redux/store';
import React from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import App from './App';
import './styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="bottom-center" />
    </Provider>
  </React.StrictMode>,
  document.getElementById(`root`),
);
