import React, { useState, useEffect } from "react";
import { getProducts } from "../services/api";

function AddItem(props) {
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  // Get products
  const search = async () => {
    if (input) {
      open();
      const result = await getProducts(input);
      setProducts(result.data);
    } else {
      setProducts([]);
    }
  };

  // Search when input changes
  useEffect(() => {
    document.addEventListener("click", close);
    search();
  }, [input]);

  const handleClick = (productName) => {
    setInput(productName);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setInput("");
    // Send input to parent component to add to list
    props.handleAdd(input);
  };

  // Open and close search results
  const close = () => {
    setIsOpen(false);
  };

  const open = () => {
    setIsOpen(true);
  };

  return (
    <div className="w-75 mx-auto" id="search">
      <form className="form-inline justify-content-center">
        <input
          className="form-control mr-1"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="New item..."
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Add
        </button>
      </form>
      <div className="list-group my-3">
        {products.map((product) => (
          <button
            key={product.id}
            className={
              isOpen ? "list-group-item list-group-item-action" : "d-none"
            }
            onClick={() => handleClick(product.name)}
          >
            {product.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AddItem;
