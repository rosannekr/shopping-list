import axios from "axios";

/* Configuration */

// Send header with token in every request
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

// Intercept 401 unauthorized responses
axios.interceptors.response.use(
  (response) => {
    // if reponse is ok, just return the response
    return response;
  },
  (error) => {
    // if user is not authorized, redirect to login page
    if (error.response.status === 401) {
      // Request to access home page?
      console.log("redirecting");
      localStorage.removeItem("token");
      // redirect user to login route, can't use hook
    }
    return error;
  }
);

/* Fetch requests */

// for testing
export const getData = async () => {
  // Request protected data, send token in header
  return await axios.get("/users/profile");
};

// Register
export const addUser = async (username, password) => {
  // send username and password to server
  await axios.post("/users/register", { username, password });
};

// Login
export const getToken = async (username, password) => {
  // request a token, return promise
  return await axios.post("/users/login", { username, password });
};

// Get items
export const getItems = async () => {
  console.log("token in request", localStorage.getItem("token"));

  return await axios.get("/currentApi/items");
};
