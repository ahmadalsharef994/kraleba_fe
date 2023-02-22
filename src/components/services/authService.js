function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.token) {
      return { 'x-access-token': user.token };
    } else {
      return {};
    }
  }
  
  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
  
  const logout = () => {
    localStorage.removeItem("user");
  }
  
  const AuthService = {
    authHeader,
    getCurrentUser,
    logout
  };
  
  export default AuthService;