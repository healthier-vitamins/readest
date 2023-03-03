function Protected({ children, isUserLoggedIn }) {
  return isUserLoggedIn ? children : null;
}

export default Protected;
