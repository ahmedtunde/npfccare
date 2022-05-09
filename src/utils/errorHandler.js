export default function errorHandler(auth) {
  return (errorObject, notify, cb = () => {}) => {
    const { message } = errorObject;
    const msg = errorObject?.toLowerCase?.().includes?.("unauth")
      ? "Session Expired, please log in."
      : message?.toLowerCase?.().includes?.("timeout")
      ? "Service Timeout, Please Retry"
      : message?.toLowerCase?.().includes?.("network")
      ? "Network Error!"
      : "Something went wrong!";

    console.error(errorObject);
    cb();
    notify(msg, "error", () => console.log("complete"));
    if (errorObject?.toLowerCase?.().includes?.("unauth")) auth.signout();
  };
}

export function LoanErrorHandler(auth) {
  return (errorObject, notify, cb = () => {}) => {
    const { message } = errorObject;
    const isTokenExpired =
      errorObject?.toLowerCase?.().includes?.("unauth") ||
      errorObject?.data?.toLowerCase?.().includes?.("token");
    const msg = isTokenExpired
      ? "Session Expired, please log in."
      : message?.toLowerCase?.().includes?.("timeout")
      ? "Service Timeout, Please Retry"
      : message?.toLowerCase?.().includes?.("network")
      ? "Network Error!"
      : "Something went wrong!";

    console.error(errorObject);
    cb();
    notify(msg, "error", () => console.log("complete"));
    if (isTokenExpired) auth.signout();
  };
}

export function validateToken(token, history, jwt_decode, auth, notify) {
  if (token && token !== "") {
    const decodedToken = jwt_decode(token);
    let currentDate = new Date();

    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      notify("Session expired", "error");
      history.push("/login");
      auth.signout();
      return;
    }
  } else {
    history.push("/login");
  }
}
