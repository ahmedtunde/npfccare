
export default function handleError (errorObject, notify, cb = () => {}) {
  const { message } = errorObject;
  const msg = message.toLowerCase().includes("expire") ? "Session Expired" :
    message.toLowerCase().includes("timeout") ? "Service Timeout, Please Retry" :
    message.toLowerCase().includes("network") ? "Network Error!" : "Something went wrong!";

  console.error(errorObject);
  cb();
  notify(msg, "error", () => console.log("complete"));
}