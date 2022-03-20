import React, { useEffect, useState, useCallback } from "react";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as ArrowRightShort } from "../../../assets/icons/arrow-right-short.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import errorHandler from "../../../utils/errorHandler";
import { useAuth } from "../../utilities";
import {
  addAdminCriteria,
  adminLoanScoring,
  adminTotalScore,
} from "../../../services/loanService";
import notify from "../../../utils/notification";

const NumberDiv = (props) => {
  const [number, setNumber] = useState(null);

  useEffect(() => {
    if (number != null) {
      alert(number);
    }
  }, [number]);

  return (
    <div className="col">
      <div className="num-div">
        {props.num &&
          props.num.map((content) => (
            <span onClick={() => setNumber(content)}>{content || 0}</span>
          ))}
      </div>
    </div>
  );
};

const DetailDiv = (props) => (
  <>
    <div className="row">
      <div className="col-5 mb-1">
        Significant change in interest rate because of changes in credit risk
        since initial recognition:
      </div>
      <div className="col-2">Yes</div>
      <div className="col">
        <div>
          <button
            className="btn py-1"
            style={{
              backgroundColor: "#2dbe7e",
              color: "#fff",
              borderRadius: "50px",
              padding: "0 1.5em",
              marginRight: "1em",
            }}
          >
            <CheckCircleFill /> Yes
          </button>
          <button
            className="btn py-1"
            style={{
              border: "1px solid red",
              color: "red",
              borderRadius: "50px",
              padding: "0 1.5em",
            }}
          >
            <TimesCircleFill /> No
          </button>
        </div>
      </div>
    </div>
  </>
);

const UpdateScore = ({ loan, adminWorkFlowLevel }) => {
  const auth = useAuth();
  const [leftCriteria, setLeftCriteria] = useState([]);
  const [rightCriteria, setRightCriteria] = useState([]);
  const [getRequirement, setGetRequirement] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState({
    userFull: false,
    acceptApplication: false,
    rejectApplication: false,
    approveApplication: false,
    printApplication: false,
    loadPage: false,
  });

  const handleError = useCallback(
    (errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb),
    [auth]
  );

  useEffect(() => {
    setDisabled(false);
    setStatus("");
    setLoading({
      userFull: false,
      acceptApplication: false,
      rejectApplication: false,
      approveApplication: false,
      printApplication: false,
      loadPage: false,
    });
    const criteriaArray = [];

    console.log(loan);

    loan.loanApp.loanProduct.loanProductCategory.criterias.forEach(
      (criteria) => {
        if (criteria.scoreType === "Behavioural") {
          criteriaArray.push(criteria);
        }
      }
    );

    const halfOfArray = Math.round(criteriaArray.length / 2);
    setLeftCriteria(criteriaArray.slice(0, halfOfArray));
    setRightCriteria(
      criteriaArray.slice(halfOfArray + 1, criteriaArray.length)
    );

    console.log(rightCriteria, leftCriteria);
  }, []);

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

  const handleEventSelect = async (e) => {
    try {
      console.log(e.target.value);

      handleChangeLoading("loadPage", true);
      setDisabled(true);
      const app_data = {
        requirement: getRequirement,
        value: e.target.value,
        score_type: "Admin",
      };

      const loanAppId = loan.loan_app_id;

      const response = await addAdminCriteria(loanAppId, app_data);

      console.log(response, getRequirement, loanAppId);

      if (response.status === "success") {
        setStatus(<CheckCircleFill />);
        handleChangeLoading("loadPage", false);
        setDisabled(false);
        return;
      } else {
        setStatus("Something went wrong");
        handleChangeLoading("loadPage", false);
        setDisabled(false);
        return;
      }
    } catch (error) {
      handleError(error, notify, () => {
        setStatus("Something went wrong");
        handleChangeLoading("loadPage", false);
        setDisabled(false);
      });
    }
  };

  const handleRequirement = (data) => {
    console.log(data);
    setGetRequirement(data);
  };

  const handleAdminScoring = async () => {
    try {
      const loanAppId = loan.loan_app_id;

      handleChangeLoading("acceptApplication", true);
      setDisabled(true);

      const response = await adminLoanScoring(loanAppId);

      if (response.status === "error") {
        notify("Something went wrong", "error");
        handleChangeLoading("acceptApplication", false);
        setDisabled(false);
        return;
      }

      if (response.status === "success") {
        const totalScore = await adminTotalScore(loanAppId);

        if (totalScore.status === "error") {
          notify("Something went wrong", "error");
          handleChangeLoading("acceptApplication", false);
          setDisabled(false);
          return;
        }

        if (totalScore.status === "success") {
          notify("Loan Successfully scored", "success");
          handleChangeLoading("acceptApplication", false);
          setDisabled(false);

          setTimeout(() => {
            window.location.reload();
          }, 2000);
          return;
        }
      }
    } catch (error) {
      handleError(error, notify, () => {
        setStatus("Something went wrong");
        handleChangeLoading("acceptApplication", false);
        setDisabled(false);
      });
    }
  };

  const displayRightBehLoanScore = () => {
    return (
      rightCriteria &&
      rightCriteria.map((criteria) => {
        const { id, requirements } = criteria;
        return (
          <>
            <div className="row" key={id}>
              <div className="col mb-1">{requirements}:</div>
              <div className="col">
                <span className="color-sec-green">
                  <div
                    class="dropdown"
                    style={{ width: "40%", outline: "none" }}
                  >
                    <select
                      disabled={
                        disabled ||
                        adminWorkFlowLevel >= loan.loanApp.workFlowLevel
                          ? false
                          : true
                      }
                      class="btn dropdown-toggle"
                      style={{
                        border: "1px solid #ccc",
                        outline: "none",
                        borderRadius: "10px",
                        fontSize: "14px",
                        padding: "0.8em 1em",
                        width: "100%",
                        fontWeight: "600",
                      }}
                      // value={getValue}
                      onClick={() => handleRequirement(requirements)}
                      onChange={(e) => {
                        handleEventSelect(e);
                        // handleRequirement(requirements);
                      }}
                    >
                      {criteria.optionValues.map((option) => (
                        <>
                          <option value={option}>{option}</option>
                        </>
                      ))}
                    </select>
                  </div>
                  <div>
                    {requirements === getRequirement &&
                      (isLoading.loadPage ? (
                        <SpinnerIcon className="limit-loading rotating" />
                      ) : (
                        <span
                          style={
                            status === "Something went wrong"
                              ? { fontSize: "12px", color: "red" }
                              : {}
                          }
                        >
                          {" "}
                          {status}
                        </span>
                      ))}
                  </div>
                </span>
              </div>
            </div>
          </>
        );
      })
    );
  };

  const displayLeftBehLoanScore = () => {
    return (
      leftCriteria &&
      leftCriteria.map((criteria, idx) => {
        const { id, requirements } = criteria;

        return (
          <>
            <div className="row" key={id}>
              <div className="col mb-1">{requirements}:</div>
              <div className="col">
                &nbsp;&nbsp;
                <span className="color-sec-green">
                  <div
                    class="dropdown"
                    style={{ width: "40%", outline: "none" }}
                  >
                    <select
                      disabled={
                        disabled ||
                        adminWorkFlowLevel >= loan.loanApp.workFlowLevel
                          ? false
                          : true
                      }
                      class="btn dropdown-toggle"
                      style={{
                        border: "1px solid #ccc",
                        outline: "none",
                        borderRadius: "10px",
                        fontSize: "14px",
                        padding: "0.8em 1em",
                        width: "100%",
                        fontWeight: "600",
                      }}
                      // value={getValue}
                      onClick={() => handleRequirement(requirements)}
                      onChange={(e) => {
                        handleEventSelect(e);
                      }}
                    >
                      {criteria.optionValues.map((option, idx) => (
                        <>
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        </>
                      ))}
                    </select>
                  </div>
                  <div>
                    {requirements === getRequirement &&
                      (isLoading.loadPage ? (
                        <SpinnerIcon className="limit-loading rotating" />
                      ) : (
                        <span
                          style={
                            status === "Something went wrong"
                              ? { fontSize: "12px", color: "red" }
                              : {}
                          }
                        >
                          {" "}
                          {status}
                        </span>
                      ))}
                  </div>
                </span>
              </div>
            </div>
          </>
        );
      })
    );
  };
  return (
    <>
      <div className="loan-details col">
        <div className="mb-5">
          <div className="details-header">Criteria Details</div>
          <div style={{ width: "100%" }}>{displayLeftBehLoanScore()}</div>

          {/* <div style={{ width: "65%" }}>
            <div className="row">
              <div className="col-5 mb-1">Existing loan exposure:</div>
              <div className="col-2">50%</div>
              <NumberDiv num={[5, 10, 15, 20, 30]} />
            </div>
          </div>
          <div style={{ width: "70%" }}>
            <div className="row">
              <div className="col-5 mb-1">Date of Enlistment:</div>
              <div className="col-3">12/02/2021</div>
              <NumberDiv num={[1, 2, 3, 4, 5]} />
            </div>
          </div>
          <div style={{ width: "65%" }}>
            <div className="row">
              <div className="col-5 mb-1">Employer type:</div>
              <div className="col-3">Federal</div>
              <NumberDiv num={[1, 2, 3]} />
            </div>
          </div>
          <div style={{ width: "65%" }}>
            <div className="row">
              <div className="col-5 mb-1">Default:</div>
              <div className="col-3">13days</div>
              <NumberDiv num={[1, 2, 3, 4, 5]} />
            </div>
          </div> */}
        </div>
      </div>
      <div className="loan-details col">
        <div className="details-header">More Criteria Details</div>
        <div style={{ width: "100%" }}>{displayRightBehLoanScore()}</div>
        <button
          onClick={handleAdminScoring}
          style={{ marginTop: "2rem" }}
          disabled={
            adminWorkFlowLevel >= loan.loanApp.workFlowLevel ? false : true
          }
          className={`btn accept-loan-btn ${
            isLoading.acceptApplication ? "loading disabled" : ""
          }`}
        >
          {isLoading.acceptApplication ? (
            <>
              Scoring <SpinnerIcon className="rotating" />
            </>
          ) : (
            <>
              Score{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-right-short"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            </>
          )}
        </button>
        {/* <div
          style={{
            margin: "2em 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <span>Continue Scoring</span>
          <button className="btn btn-info">
            Score Documents <ArrowRightShort />
          </button>
        </div> */}
      </div>
    </>
  );
};

export default UpdateScore;
