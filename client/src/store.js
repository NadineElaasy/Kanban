import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import setAuthToken from "./utils/setAuthToken";
import reduxThunk from 'redux-thunk';

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    console.error(e);
  }
}
function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("state");
    const token = localStorage.getItem("jwtToken");
    setAuthToken(token);

    if (serializedState === null) return {};
    return JSON.parse(serializedState);
  } catch (e) {
    return {};
  }
}

const persistedState = loadFromLocalStorage();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const middleware = [thunk];
const store = createStore(
  rootReducer /*our reducer */,
  persistedState /*our initial state */,
  composeEnhancers(applyMiddleware(reduxThunk))
  // compose(
  //   applyMiddleware(...middleware)
  //   // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
);

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
