import React from "react";

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: !!this.props.item.completed,
    };
  }

  complete(item) {
    this.setState({
      isChecked: !this.state.isChecked,
    });
    this.props.completeItem(item);
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
        <div
          style={{ textDecoration: isChecked ? "line-through" : "none" }}
          className={isChecked ? "text-secondary mr-5" : "mr-5"}
        >
          <input
            checked={isChecked}
            className="mr-3"
            type="checkbox"
            onChange={() => this.complete(item)}
          />
          <span>{item.name}</span>
        </div>
        <div>
          <button className="btn mx-2" onClick={() => this.delete(item.id)}>
            <i className="fas fa-minus"></i>
          </button>
          {/* <button
            className="btn btn-outline-dark p-1"
            onClick={() => this.next(item)}
          >
            Next
          </button> */}
        </div>
      </li>
    );
  }
}
export default Item;
