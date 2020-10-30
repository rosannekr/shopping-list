import React from "react";
import "./App.css";
import List from "./components/List";
import PastLists from "./components/PastLists";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { userIsLoggedIn } from "./components/Auth";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
  }

  componentDidMount() {
    const loggedIn = userIsLoggedIn();
    this.setState({ loggedIn });
  }

  login = () => {
    this.setState({ loggedIn: true });
  };

  logout = () => {
    localStorage.removeItem("token");
    this.setState({ loggedIn: false });
  };

  render() {
    return (
      <Router>
        <NavBar loggedIn={this.state.loggedIn} logout={this.logout} />
        <div className="container">
          <div>
            <Switch>
              <ProtectedRoute path="/pastList">
                <PastLists />
              </ProtectedRoute>
              <Route path="/register">
                <RegisterPage />
              </Route>
              <Route path="/login">
                <LoginPage login={this.login} />
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
