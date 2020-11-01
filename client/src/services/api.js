import axios from "axios";
import { Redirect } from "react-router-dom";

/* Configuration */

// Not working
// axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

// Do something before request is sent
axios.interceptors.request.use(
  (config) => {
    // Grab token
    const token = localStorage.getItem("token");

    // Add header with token to every request
    if (token != null) {
      config.headers.Authorization = token;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Intercept 401 unauthorized responses
axios.interceptors.response.use(
  (response) => {
    // if reponse is ok, just return the response
    return response;
  },
  (error) => {
    // if user is not authorized, remove token and redirect to login page
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      <Redirect to="/login" />;
    }
    return error;
  }
);

/* Fetch requests */

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

// Get user info
export const getUser = async () => {
  return await axios.get("/users/profile");
};

// Get this week's items
export const getItems = async () => {
  return await axios.get("/currentApi/items");
};

// Add item
export const addItem = async (name) => {
  return await axios.post("/currentApi/items", { name });
};

// Delete item
export const deleteItem = async (id) => {
  return await axios.delete(`/currentApi/items/${id}`);
};

// Complete item
export const completeItem = async (id, status) => {
  return await axios.put(`/currentApi/items/${id}`, { status });
};

// Update item
export const updateItem = async (id, prop) => {
  return await axios.put(`/currentApi/items/${id}?prop=${prop}`);
};

// Get suggestions (default filter by frequency)
export const getSuggestions = async (filter = "frequent") => {
  return await axios.get(`/currentApi/suggestions?filter=${filter}`);
};
