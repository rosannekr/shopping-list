import React from "react";
import "./App.css";
import List from "./components/List";
import PastLists from "./components/PastLists";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
              <Route path="/register">
                <RegisterPage />
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <ProtectedRoute path="/">
                <List />
              </ProtectedRoute>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
