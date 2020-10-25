import React from "react";
import "./App.css";
import Item from "./Item";

class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    this.updateInput= this.updateInput.bind(this)
    this.componentDidMount= this.componentDidMount.bind(this)
    this.state = {
      input: "",
      data: []
    };
  }

  updateInput(e) {
    e.preventDefault();
    this.setState({
      input: e.target.value
    });
  }

  componentDidMount() {
      //change to fetch this week from database
    fetch("/currentApi/items")
      .then(res => res.json())
      .then(json => {
        this.setState({data: json});
      })
      .catch(error => {
        fetch("currentApi/new/week")
          .then(res=> res.json)
      });
  }

  addItem() {
    // add item to this week, but first add to products and
    // week if not already there
    fetch("/currentApi/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: this.state.input })
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.setState({
          data: json
        });
      });
  }
  autoAdd() {
    // add item to this week, but first add to products and
    // week if not already there
    fetch("/currentApi/items/auto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: this.state.input })
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.setState({
          data: json
        });
      });
  }

  updateItem(itemStatus) {
    console.log("data sent back to parent")
//update to completed
    fetch("/currentApi/items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(itemStatus)
    })
      .then(res => res.json())
      .then(json => {
        console.log("JSON data", json)
        this.setState({
          data: json
        });
      });
  }

  deleteItem(unwanted) {
      //remove item from week. does not remove existence 
    fetch(`/currentApi/items`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(unwanted)
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          data: json
        });
      });
  }
  pushItemToNextWeek (pushed){
    let item = pushed
      //pushes item to next week's list
  }

  render() {
    let data = this.state.data;
    let items = data.map(item => 
    (
      <Item
        key={item.id}
        itemData={item}
        updateItem={itemStatus => this.updateItem(itemStatus)}
        deleteItem={unwanted => this.deleteItem(unwanted)}
        pushToNext={item=>this.pushItemToNextWeek(item)}
      />
    ));
    let newBtn= <button onClick={e => this.autoAdd()}>Auto-Add</button>

    return (
      <div>
        <h1>Shopping List</h1>
            <div>
              <label>
                <input onChange={e => this.updateInput(e)}
                value={this.state.name}/>
              </label>
              <button onClick={e => this.addItem()}>Add</button>
              {items.length&&items||newBtn}
            </div>
      </div>
    );
  }
}

export default CurrentList;