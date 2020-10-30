import { Link } from "react-router-dom";

export function NavBar(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-5">
      {props.loggedIn ? (
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Current List
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pastList">
                All Lists
              </Link>
            </li>
          </ul>
          <div className="navbar-nav">
            <Link className="nav-link" to="/login" onClick={props.logout}>
              Log Out
            </Link>
          </div>
        </div>
      ) : (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              Sign Up
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
