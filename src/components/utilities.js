import numeral from "numeral";
import React, { createContext, useContext, useState } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import {
  clearAllTokens,
  clearRoles,
  clearToken,
  clearLoanRoles,
  clearBranchId,
  getAccessToken,
  clearEmail,
} from "../utils/localStorageService";

const authContext = createContext();

export const useAuth = (_) => useContext(authContext);

// app wrapper granting access to the authentication context
export const ProvideAuth = (props) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>{props.children}</authContext.Provider>
  );
};

// private route component
export const PrivateRoute = ({ children, ...rest }) => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
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
  },
};

// the authentication method
function useProvideAuth() {
  function getRoles() {
    const token = getAccessToken();
    if (!token) return null;
    const tokenDetails = JSON.parse(atob(token.split(".")[1]));
    return tokenDetails.roles;
  }
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
    clearRoles();
    clearLoanRoles();
    clearBranchId();
    clearEmail();
    clearAllTokens();
    // return fakeAuth.signout(() => {
    //   setUser(null);
    //   if(cb) cb();
    // });
  };

  return {
    user,
    signin,
    signout,
  };
}

export const handleOpenModal = (modalSelector, cb = () => {}) =>
  document.$(modalSelector).modal("show").on("hidden.bs.modal", cb);

export const handleHideModal = (modalSelector, cb = () => {}) =>
  document.$(modalSelector).modal("hide").on("hidden.bs.modal", cb);

export const isAlphaNumeric = (string) => {
  let re = /^.*(?=.*[a-z])(?=.*\d)/;
  return re.test(string);
};

export const isValidDate = (date) => {
  console.log(date);
  return !!(
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
};

export const formatAmount = (amount) => numeral(amount).format("0,0.00");

export const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};
