import React from "react";
import { Route, Redirect } from "react-router-dom";
import { userIsLoggedIn } from "./Auth";

// This is a custom Route component with props:
// - children: any child components of the ProtectedRoute component
// - ...rest: any other props that were passed in => these are passed on to the Route component
// It uses a helper function (isLoggedIn) to check if user is authenticated

export const ProtectedRoute = ({ children, ...rest }) => {
  return (
    // The render prop takes a functional component
    <Route
      {...rest}
      render={(props) => {
        // if user is authenticated return child component
        return userIsLoggedIn() ? (
          children
        ) : (
          // else redirect user to login page
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
