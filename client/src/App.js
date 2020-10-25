import React from "react";
import "./App.css";
import CurrentList from "./CurrentList";
import OldListsIndex from "./OldListsIndex";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }



  render() {
    return (
      <div>

        <CurrentList></CurrentList>    
          <OldListsIndex></OldListsIndex>
      </div>
    )
  }
}
export default App;

