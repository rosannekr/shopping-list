import React, { useState } from "react";
import { addUser } from "../services/requests";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await addUser(username, password);
      setIsRegistered(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="text-center">
      {isRegistered && <div className="alert alert-success">Registered!</div>}
      {!isRegistered && (
        <div>
          <h2>Sign Up</h2>
          <form className="w-25 mx-auto mt-2">
            <input
              className="form-control"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              className="form-control mt-2"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button className="btn btn-primary mt-2" onClick={handleClick}>
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
