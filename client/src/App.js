import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import BoardList from "./components/BoardList";
import history from "./history";
const App = () => {
  return (
    <div className="ui container">
      <Router history={history}>
        <Switch>
          <Route  path="/" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route  path="/boards" exact component={BoardList} />
        </Switch>
      </Router>
    </div>
  );
};
export default App;
