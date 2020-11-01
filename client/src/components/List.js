import React from "react";
import "../App.css";
import Item from "./Item";
import { getItems, addItem, deleteItem, updateItem } from "../services/api";

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
        data: res.data,
        input: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateItem = async (id, status) => {
    //update to completed
    try {
      await updateItem(id, "completed");
      const res = await getItems();
      this.setState({
        data: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteItem = async (id) => {
    //remove item from week (does not remove existence)
    try {
      await deleteItem(id);
      const res = await getItems();
      this.setState({
        data: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  pushToNextWeek = async (item) => {
    //move item to next week's list
    try {
      await updateItem(item.id, "weekId");
      this.deleteItem(item.id);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let data = this.state.data;

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

          <div className="list-group d-inline-block">
            {data.map((item) => (
              <Item
                key={item.id}
                item={item}
                deleteItem={this.deleteItem}
                updateItem={this.updateItem}
                pushToNextWeek={this.pushToNextWeek}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default List;
