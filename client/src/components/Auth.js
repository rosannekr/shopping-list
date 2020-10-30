export const userIsLoggedIn = () => {
  return localStorage.getItem("token") ? true : false;
};
