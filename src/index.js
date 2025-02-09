import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/App';
import './index.css';
import store from './redux/store';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Provider store = {store}>
            <App/>
        </Provider>
    </BrowserRouter>
);

reportWebVitals();
