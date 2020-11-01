import React, { useState, useEffect } from "react";
import Item from "./Item";
import { getItems, getSuggestions } from "../services/api";

function HomePage() {
  // Set initial state
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("frequent");

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const result = await getItems();
      setData(result.data);
    };
    fetchData();
  }, []);

  const handleClick = async () => {
    await getSuggestions(filter);
  };

  return (
    <div>
      <h1>Shopping List</h1>
      {/* <form className="form-inline justify-content-center mb-3">
        <input
          className="form-control mr-1"
          onChange={this.updateInput}
          value={this.state.input}
          placeholder="New item..."
        />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
      </form> */}
      {!data.length && (
        <div>
          <p>No items yet</p>
          <div
            className="btn-group btn-group-toggle my-3 d-block"
            data-toggle="buttons"
            onChange={(e) => setFilter(e.target.value)}
          >
            <label
              className={
                filter === "recent"
                  ? "btn btn-secondary active"
                  : "btn btn-secondary"
              }
            >
              <input type="radio" value="recent" name="filter" /> Most recent
            </label>
            <label
              className={
                filter === "frequent"
                  ? "btn btn-secondary active"
                  : "btn btn-secondary"
              }
            >
              <input type="radio" value="frequent" name="filter" /> Most
              frequent
            </label>
          </div>
          <button className="btn btn-primary" onClick={handleClick}>
            Add Items
          </button>
        </div>
      )}

      <div className="list-group d-inline-block">
        {data.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
