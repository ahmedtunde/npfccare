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
