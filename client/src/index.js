import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import { createStore, applyMiddleware, compose } from 'redux';
// import reduxThunk from 'redux-thunk';

import App from "./App";
import store from "./store";

ReactDOM.render(
  
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>,
    </BrowserRouter>,
    
  document.querySelector("#root")
);
