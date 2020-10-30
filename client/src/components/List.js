import React from "react";
import "../App.css";
import Item from "./Item";
import { getItems } from "../services/api";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      data: [],
    };
  }

  updateInput = (e) => {
    e.preventDefault();
    this.setState({
      input: e.target.value,
    });
  };

  async componentDidMount() {
    // res is initially empty?
    const res = await getItems();
    this.setState({ data: res.data });

    // .catch((error) => {
    //   fetch("currentApi/new/week").then((res) => res.json);
    // });
  }

  addItem() {
    // add item to this week, but first add to products and
    // week if not already there
    fetch("/currentApi/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: this.state.input }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        this.setState({
          data: json,
        });
      });
  }
  autoAdd() {
    // add most common items to current week, need to find way to add week though
    fetch("/currentApi/items/auto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: this.state.input }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        this.setState({
          data: json,
        });
      });
  }

  updateItem(itemStatus) {
    //update to completed
    fetch("/currentApi/items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemStatus),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          data: json,
        });
      });
  }

  deleteItem(unwanted) {
    //remove item from week. does not remove existence
    fetch(`/currentApi/items`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(unwanted),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          data: json,
        });
      });
  }
  pushItemToNextWeek(pushed) {
    console.log("pushed", pushed);
    fetch("/currentApi/items/auto/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pushed),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          data: json,
        });
      });
    this.deleteItem(pushed);
  }

  render() {
    let data = this.state.data;
    let items = data.map((item) => (
      <Item
        key={item.id}
        itemData={item}
        updateItem={(itemStatus) => this.updateItem(itemStatus)}
        deleteItem={(unwanted) => this.deleteItem(unwanted)}
        pushToNext={(pushed) => this.pushItemToNextWeek(pushed)}
      />
    ));
    let newBtn = <button onClick={(e) => this.autoAdd()}>Auto-Add</button>;

    return (
      <div>
        <h1>Shopping List</h1>
        <div>
          <label>
            <input
              onChange={(e) => this.updateInput(e)}
              value={this.state.name}
            />
          </label>
          <button onClick={(e) => this.addItem()}>Add</button>
          {(items.length && items) || newBtn}
        </div>
      </div>
    );
  }
}

export default List;
