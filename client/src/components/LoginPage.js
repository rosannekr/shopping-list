import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { getToken } from "../services/api";

function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // request a token (send user info to back end)
      const res = await getToken(username, password);
      // store token on user's device
      localStorage.setItem("token", res.data.token);
      // call login method to set state in App component
      props.login();
      // redirect user to home page
      history.push("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="text-center">
      <h2>Log In</h2>
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
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
