import React, { useState, useEffect } from "react";
import { getSuggestions, addItem } from "../services/api";

function SuggestionsList(props) {
  // Set initial state
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const result = await getSuggestions(offset);
      setData(result.data);
    };
    fetchData();
  }, [offset]);

  // Add product to items of this week
  const handleAdd = async (item) => {
    try {
      await addItem(item.name);
      const result = await getSuggestions(offset);
      setData(result.data);

      // Trigger rerender of List component
      props.updateData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3>Suggestions</h3>
      <p className="text-secondary">Based on your recent purchases</p>
      <div className="d-flex justify-content-center">
        <div className="list-group d-inline-block mr-2 mb-2">
          {data.map((item) => (
            <li key={item.productId} className="list-group-item text-left pr-5">
              <button className="btn mr-4" onClick={() => handleAdd(item)}>
                <i className="fas fa-plus"></i>
              </button>
              {item.name}
            </li>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <button
          onClick={() => setOffset(offset - 5)}
          className="btn btn-primary d-block mr-1"
          disabled={offset <= 0 ? true : false}
        >
          <i className="fas fa-arrow-up"></i>
        </button>

        <button
          onClick={() => setOffset(offset + 5)}
          className="btn btn-primary d-block "
          disabled={data.length < 5 ? true : false}
        >
          <i className="fas fa-arrow-down"></i>
        </button>
      </div>
    </div>
  );
}

export default SuggestionsList;
