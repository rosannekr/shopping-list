import React from "react";

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: !!this.props.itemData.completed,
    };
  }

  setCompleted() {
    console.log("clicked!")
    let itemStatus = {...this.props.itemData};
    itemStatus.completed = !itemStatus.completed ? 'CURDATE()' : 'null';
    console.log("itemStatus", itemStatus)
    this.setState({
      isChecked: !this.state.isChecked,
    });
    return this.props.updateItem(itemStatus);
  }

  delete() {
    return this.props.deleteItem(this.props.itemData);
  }
  next(){
    console.log("item data", this.props.itemData)
    return this.props.pushToNext(this.props.itemData)
  }

  render() {
    
    const item = this.props.itemData.name;
    let status = this.state.isChecked
    console.log("status", status)

    return (
              <div>
              <label style={status ? { color: "GrayText" } : { color: "black" }}>
                <input checked={status} className="checkBox" type="checkbox" onChange={() => this.setCompleted()} />
                <input value={item}/>
                <button onClick={() => this.delete()}>Del</button>
                <button onClick={() => this.next()}>ToNext</button>
              </label>

            </div>
    );
  }
}
export default Item;