import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CRMSystem from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
// import { ThemeProvider } from '@mui/material/styles';
// import theme from './theme'; // Import the theme file you created

axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}> */}
    <CRMSystem />
    {/* </ThemeProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
