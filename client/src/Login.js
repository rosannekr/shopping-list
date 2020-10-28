import React, { useState } from "react";
const axios = require("axios");

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // send login credentials to back end
      const res = await axios.post("/users/login", { username, password });
      // store token on user's device
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.log(error);
    }
  };

  //   const requestData = () => {
  //       // send token in header
  //       const res = await axios.get("/users/profile", { })
  //   }

  return (
    <div className="text-center">
      <form className="w-25 mx-auto">
        <input
          className="form-control"
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          className="form-control mt-2"
          type="text"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button className="btn btn-primary mt-2" onClick={handleClick}>
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
