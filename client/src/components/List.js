import React from "react";
import "../App.css";
import Item from "./Item";
import SuggestionsList from "./SuggestionsList";
import AddItem from "./AddItem";
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

  updateData = async () => {
    // get items of current week
    try {
      const res = await getItems();
      this.setState({ data: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  handleAdd = async (name) => {
    // add item to this week, but first add to products and
    // week if not already there

    try {
      await addItem(name);
      const res = await getItems();
      this.setState({
        data: res.data,
        input: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  completeItem = async (item) => {
    // set completed to date of today
    try {
      await updateItem(item.id, "completed", item.completed);
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
      await updateItem(item.id, "weekId", item.weekId);
      const res = await getItems();
      this.setState({
        data: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let data = this.state.data;

    return (
      <div className="row">
        <div className="col-3 text-left">
          <h4>Hi, {this.props.username}!</h4>
          <p>
            This is your shopping list for this week, based on your most
            frequent purchases. <br />
            Every Monday a new list is generated.
          </p>
        </div>
        <div className="col">
          <h1>Shopping List</h1>
          <AddItem handleAdd={this.handleAdd} />
          <div>
            <div className="list-group w-75 mx-auto shadow">
              {data?.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  deleteItem={this.deleteItem}
                  completeItem={this.completeItem}
                  pushToNextWeek={this.pushToNextWeek}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="col pt-5">
          <SuggestionsList updateData={this.updateData} />
        </div>
      </div>
    );
  }
}

export default List;
