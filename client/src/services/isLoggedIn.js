export const isLoggedIn = () => {
  return localStorage.getItem("token") ? true : false;
};
