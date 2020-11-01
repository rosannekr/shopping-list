import React from "react";

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isChecked: !!this.props.itemData.completed,
      isChecked: false,
    };
  }

  setCompleted() {
    console.log("clicked!");
    // let itemStatus = { ...this.props.itemData };
    // itemStatus.completed = !itemStatus.completed ? "CURDATE()" : "null";
    // console.log("itemStatus", itemStatus);
    this.setState({
      isChecked: !this.state.isChecked,
    });
    // return this.props.updateItem(itemStatus);
  }

  delete() {
    // return this.props.deleteItem(this.props.itemData);
  }
  next() {
    // console.log("item data", this.props.itemData);
    // return this.props.pushToNext(this.props.itemData);
  }

  render() {
    // const item = this.props.itemData.name;
    let status = this.state.isChecked;

    return (
      <li className="list-group-item py-0 d-flex justify-content-between align-items-baseline">
        <div>
          <input
            checked={status}
            className="mr-1"
            type="checkbox"
            onChange={() => this.setCompleted()}
          />
          {this.props.item.name}
        </div>
        <div>
          <button
            className="btn btn-outline-dark mr-2"
            onClick={() => this.delete()}
          >
            Del
          </button>
          <button className="btn btn-outline-dark" onClick={() => this.next()}>
            Next
          </button>
        </div>
      </li>
    );
  }
}
export default Item;
