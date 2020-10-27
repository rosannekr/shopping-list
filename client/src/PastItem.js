import React from "react";

class PastItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  delete() {
    return this.props.deleteItem(this.props.itemData);
  }
  add(){
    // add item to this week
    let itemData = this.props.itemData
    fetch("/currentApi/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(itemData)
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.setState({
          data: json
        });
      });
  }

  render() {
    
    const item = this.props.itemData.name;

    return (
              <div>
              <label>
                <input value={item}/>
                <button onClick={() => this.add()}>Add</button>
              </label>

            </div>
    );
  }
}
export default PastItem;