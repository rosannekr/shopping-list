import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoggedIn } from "../services/isLoggedIn";

// custom Route component with props
// children: child components of ProtectedRoute
// ...rest: any other props that were passed in => these are passed on to the Route component
export const ProtectedRoute = ({ children, ...rest }) => {
  // check if user is authenticated: check localStorage
  //   const isLoggedIn = localStorage.getItem("token") ? true : false;

  return (
    // render prop takes a functional component
    <Route
      {...rest}
      render={(props) => {
        // if user is authenticated return component
        return isLoggedIn() ? (
          children
        ) : (
          // else redirect to login page
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        );
      }}
    ></Route>
  );
};
