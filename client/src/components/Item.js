import React from "react";

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: !!this.props.item.completed,
    };
  }

  complete(id, status) {
    this.setState({
      isChecked: !this.state.isChecked,
    });
    this.props.updateItem(id, status);
  }

  delete(id) {
    this.props.deleteItem(id);
  }

  next(item) {
    this.props.pushToNextWeek(item);
  }

  render() {
    const { item } = this.props;
    const { isChecked } = this.state;

    return (
      <li className="list-group-item py-2 d-flex justify-content-between align-items-baseline">
        <div style={{ textDecoration: isChecked ? "line-through" : "none" }}>
          <input
            checked={isChecked}
            className="mr-2"
            type="checkbox"
            onChange={() => this.complete(item.id, item.completed)}
          />
          {item.name}
        </div>
        <div>
          <button
            className="btn btn-outline-dark mx-2 p-1"
            onClick={() => this.delete(item.id)}
          >
            Delete
          </button>
          <button
            className="btn btn-outline-dark p-1"
            onClick={() => this.next(item)}
          >
            Next
          </button>
        </div>
      </li>
    );
  }
}
export default Item;
