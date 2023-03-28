function Protected({ children, isUserLoggedIn }: any) {
  return isUserLoggedIn ? children : null;
}

export default Protected;
