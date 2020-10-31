import React from "react";
import "../App.css";
import Item from "./Item";
import { getItems, addItem } from "../services/api";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      data: [],
    };
  }

  updateInput = (e) => {
    this.setState({
      input: e.target.value,
    });
  };

  async componentDidMount() {
    // TODO
    // if current week exists: show items of current week
    // otherwise show suggestions

    // get items of current week
    try {
      const res = await getItems();
      this.setState({ data: res.data });
    } catch (error) {
      console.log(error);
    }
  }

  handleAdd = async (e) => {
    e.preventDefault();
    // add item to this week, but first add to products and
    // week if not already there
    try {
      await addItem(this.state.input);
      const res = await getItems();
      this.setState({
        data: res.date,
        input: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

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
          <form className="form-inline justify-content-center mb-3">
            <input
              className="form-control mr-1"
              onChange={this.updateInput}
              value={this.state.input}
              placeholder="New item..."
            />
            <button className="btn btn-primary" onClick={this.handleAdd}>
              Add
            </button>
          </form>
          <h3>Suggestions:</h3>
          {(items.length && items) || newBtn}
        </div>
      </div>
    );
  }
}

export default List;
