import React from "react";
import "./App.css";
import List from "./List";
import PastLists from "./PastLists";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { NavBar } from "./NavBar";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <NavBar />
        <div className="container">
          <div>
            <Switch>
              <Route path="/currentList">
                <List />
              </Route>
              <Route path="/pastList">
                <PastLists />
              </Route>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
