
export default function handleError (errorObject, notify, cb = () => {}, auth) {
  const { message } = errorObject;
  const msg = errorObject.toLowerCase?.().includes?.("unauth") ? "Session Expired, please log in." :
    message.toLowerCase().includes("timeout") ? "Service Timeout, Please Retry" :
    message.toLowerCase().includes("network") ? "Network Error!" : "Something went wrong!";

  console.error(errorObject);
  cb();
  notify(msg, "error", () => console.log("complete"));
  if (errorObject.toLowerCase?.().includes?.("unauth")) auth.signout();
}