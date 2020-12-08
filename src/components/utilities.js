import React, { createContext, useContext, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { clearToken, getAccessToken } from '../utils/localStorageService';

const authContext = createContext();

export const useAuth = _ => useContext(authContext);


// app wrapper granting access to the authentication context
export const ProvideAuth = props => {
  const auth = useProvideAuth();
  return(
    <authContext.Provider value={auth}>
      {props.children}
    </authContext.Provider>
  );
};

// private route component
export const PrivateRoute = ({children, ...rest}) => {
  const auth = useAuth();
  return(
    <Route 
      {... rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : 
        <Redirect to={{
          pathname: "/login",
          state: { from: location}
        }}/>}
    />
  );
};

// fake authentication state object 
const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 1000); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 3000);
  }
};

// the authentication method
function useProvideAuth() {
  function getRoles () {
    const token = getAccessToken();
    if(!token) return null;
    const tokenDetails = JSON.parse(atob(token.split(".")[1]));
    return tokenDetails.roles;
  };
  const [user, setUser] = useState(() => getRoles());

  const signin = (cb = () => {}) => {
    setUser(getRoles());
    cb();
    // setTimeout(cb(), 500);
    // return fakeAuth.signin(() => {
    //   setUser("user");
    //   if(cb) cb();
    // });
  };

  const signout = (cb = () => {}) => {
    setUser(null);
    clearToken();
    // return fakeAuth.signout(() => {
    //   setUser(null);
    //   if(cb) cb();
    // });
  };

  return {
    user,
    signin,
    signout
  };
};