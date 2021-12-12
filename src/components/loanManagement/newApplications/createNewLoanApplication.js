// Checkboxes beside customers are commented out to until feature to export data of selected customers is needed
// -----------------------------------------------
import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useHistory } from "react-router-dom";
import face from "../../../assets/img/face.jpg";
import { ReactComponent as TimesIcon } from "../../../assets/icons/times.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import { ReactComponent as NothingFoundIcon } from "../../../assets/icons/nothing-found.svg";
import errorHandler from "../../../utils/errorHandler";
import notify from "../../../utils/notification";
import { useAuth, useQueryParams } from "../../utilities";
import { generateCustomerToken } from "../../../services/authService";
import CryptoJS from "crypto-js";
const { REACT_APP_LOAN_API_PROXY_URL, REACT_APP_SECRET_KEY } = process.env;

const CreateNewLoanApplication = (props) => {
  const history = useHistory();
  const auth = useAuth();
  // useCallback ensures that handle error function isn't recreated on every render
  const handleError = useCallback(
    (errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb),
    [auth]
  );
  const [isLoading, setLoading] = useState(false);

  const [customerToken, setCustomerToken] = useState("");
  const [loansURL, setLoansURL] = useState("");
  const queryParams = useQueryParams();
  const customerId = useMemo(
    () => queryParams.get("customer_id"),
    [queryParams]
  );

  useEffect(() => {
    async function handleGenerateCustomerToken(userId) {
      setLoading(true);
      try {
        const result = await generateCustomerToken(userId);
        setLoading(false);
        const wasUserFound = result.message !== "User not found";
        notify(
          wasUserFound ? "Successful" : result.message,
          !wasUserFound ? "error" : "success"
        );
        if (!wasUserFound || !result.token) {
          history.push("/loanMan/new/selectCustomer");
          return;
        }
        if (result.token) setCustomerToken(result.token);
      } catch (error) {
        console.log(error);
        handleError(error, notify, () => setLoading(false));
      }
    }

    handleGenerateCustomerToken(customerId);
  }, [customerId, handleError, history]);

  useEffect(() => {
    if (customerToken) {
      encryptToken(customerToken);
    }
  }, [customerToken]);

  const encryptToken = (token) => {
    var ciphertext = CryptoJS.AES.encrypt(
      token,
      REACT_APP_SECRET_KEY
    ).toString();

    const url = `${REACT_APP_LOAN_API_PROXY_URL}/apply/loans?auth=${ciphertext}`;
    setLoansURL(url);
  };

  return (
    <>
      <header>
        <div>
          <h1>
            <button
              onClick={(e) => history.goBack()}
              className="btn btn-primary back-btn"
            >
              <TimesIcon />
            </button>
            New Loan Application
          </h1>
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            NPF Admin
            <i className="arrow down"></i>
          </div>
        </div>
      </header>
      <main className="customers-page">
        {(isLoading || !customerToken) && (
          <div className="searching-block">
            <div className={"svg-holder " + (!isLoading ? "not-loading" : "")}>
              {isLoading ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <NothingFoundIcon />
              )}
            </div>
            {!isLoading && <p>NOTHING FOUND!</p>}
          </div>
        )}
        {!isLoading && !!loansURL && (
          // Styles are just for fast; review if needed
          <div
            className="customer-details"
            style={{ backgroundColor: "#f8fafd" }}
          >
            <div className="">
              <iframe
                src={loansURL}
                width="100%"
                height="749px"
                style={{ border: "none" }}
                title="Loan Application"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default CreateNewLoanApplication;
