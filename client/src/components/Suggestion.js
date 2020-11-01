import React, { useState, useEffect } from "react";

function Suggestion(props) {
  const [isChecked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!isChecked);
    // Add suggestion to items for this week
  };

  // Save class names for normal and checked states
  const classItem =
    "list-group-item py-0 d-flex justify-content-between align-items-baseline";
  const classItemDisabled = classItem + " disabled text-secondary";

  return (
    <li className={isChecked ? classItemDisabled : classItem}>
      <div>
        <button
          className={isChecked ? "btn text-secondary" : "btn"}
          onClick={handleCheck}
        >
          <i class="fas fa-plus-circle"></i>
        </button>
        {props.item.name}
      </div>
      <button
        className={
          isChecked
            ? "btn btn-outline-secondary mt-2"
            : "btn btn-outline-dark mt-2"
        }
      >
        Next
      </button>
    </li>
  );
}

export default Suggestion;
