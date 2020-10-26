import React from "react";
import "./App.css";
import List from "./List";
import PastLists from "./PastLists";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
    
    <div>
      <Router>
      <div>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/currentList">Current List</Link>
          </li>
          <li>
            <Link to="/pastList">Past Lists</Link>
          </li>
        </ul>

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
    </Router>
      </div>
    )
  }
}

function Login() {
  return <h2>to be added at a later date</h2>;
}

//   let match = useRouteMatch();
//   let weeks= []//map week ids to li objects 

//   return (
//     <div>
//       <h2>Past Lists</h2>

//       <ul>
//         {weeks}
//       </ul>
//       <Switch>
//         <Route path={`${match.path}/:weekId`}>
//           <Topic />
//         </Route>
//         <Route path={match.path}>
//           <h3>Select a list.</h3>
//         </Route>
//       </Switch>
//     </div>
//   );
// }

// function Topic() {
//   let { weekId } = useParams();
//   return <h3>Requested week ID: {topicId}</h3>;


export default App;

