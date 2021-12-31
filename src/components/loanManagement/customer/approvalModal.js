import React from "react";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import notify from "../../../utils/notification";
import {
  approveOrRejectLoan,
  disburseLoan,
} from "../../../services/loanService";
import { useState } from "react/cjs/react.development";
import { useSpring, animated } from "react-spring";
import { useHistory } from "react-router-dom";
import moment from "moment";

export const ApprovalModal = ({
  approveModalBtn,
  setApproveModalBtn,
  approveData,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);
  const [isAboveLoading, setIsAboveLoading] = useState(false);
  const [acceptModalBtn, setAcceptModalBtn] = useState(false);
  const [acceptData, setAcceptData] = useState({});

  const history = useHistory();

  const aboveLimit = async () => {
    try {
      const data = {
        isWithinLimit: false,
      };
      const loanAppId = approveData.loanAppId;

      setIsAboveLoading((prev) => !prev);

      const approveRejectApi = await approveOrRejectLoan(data, loanAppId);

      if (approveRejectApi.error) return notify(approveRejectApi.data, "error");

      notify(approveRejectApi.data.text, "success");
      setApproveModalBtn((prev) => !prev);
      setIsAboveLoading((prev) => !prev);
      history.push("/pages/loanMan");
    } catch (error) {
      notify(error.data, "error");
      setIsAboveLoading((prev) => !prev);
    }
  };

  const animateModal = useSpring({
    config: {
      duration: 250,
    },
    opacity: approveModalBtn ? 1 : 0,
    transform: approveModalBtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  const handleAcceptModal = () => {
    return (
      <BookAndAcceptLoanModal
        acceptModalBtn={acceptModalBtn}
        setAcceptModalBtn={setAcceptModalBtn}
        acceptData={acceptData}
      />
    );
  };

  const checkAcceptModal = () => {
    setApproveModalBtn((prev) => !prev);
    setAcceptModalBtn((prev) => !prev);

    var data = {
      limit: approveData.limit,
      maxTerm: approveData.maxTerm,
      loanAppId: approveData.loanAppId,
      customerId: approveData.customerId,
      applicationDate: approveData.applicationDate,
      status: approveData.status,
      narrative: approveData.narrative,
      isWithinLimit: approveData.isWithinLimit,
      email: approveData.email,
      firstname: approveData.firstname,
      lastname: approveData.lastname,
      productName: approveData.productName,
    };

    setAcceptData(data);
  };

  return (
    <>
      {handleAcceptModal()}
      {approveModalBtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div approveModalBtn={approveModalBtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setApproveModalBtn((prev) => !prev)}
              >
                <TimesCircleFill className="modal-cancel-icon" />
              </button>
              <p className="appr-modal-text">
                Is the loan amount within your limit?
              </p>
              <div className="appr-modal-btn">
                <button
                  className="btn approve-loan-btn first-btn"
                  onClick={checkAcceptModal}
                >
                  <CheckCircleFill /> &nbsp;
                  {isAprroveLoading ? (
                    <SpinnerIcon className="limit-loading rotating" />
                  ) : (
                    "Yes"
                  )}
                </button>

                <button className="btn reject-loan-btn" onClick={aboveLimit}>
                  <TimesCircleFill />
                  {isAboveLoading ? (
                    <SpinnerIcon className="limit-loading rotating" />
                  ) : (
                    "No"
                  )}
                </button>
              </div>
            </div>
          </animated.div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const NarrativeModal = ({
  narrativeModalBtn,
  setNarrativeModalBtn,
  approveData,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);
  const [count, setCount] = useState(false);
  const [narrative, setNarrative] = useState("");
  const [countNum, setCountNum] = useState(120);
  const [isDisabled, setIsDisabled] = useState(true);
  const history = useHistory();

  const handleSetCount = () => {
    setCount((prev) => !prev);
  };

  const handleRemoveCount = () => {
    setCount(false);
  };

  const getNarrative = (e) => {
    setNarrative(e.target.value);
  };

  const textCounter = () => {
    //max charcater is 120
    const maxAmount = 120;
    //check if user is greater than max character
    narrative.length > maxAmount
      ? //if input is greater than max character set textarea to only have
        //the amount of max character entered and nothing more
        setNarrative(narrative.substring(0, maxAmount))
      : //set count indicator value
        setCountNum(maxAmount - narrative.length);

    //enable button if input is valid and vice verse
    const validText = narrative.trim();
    validText.length > 30 ? setIsDisabled(false) : setIsDisabled(true);
  };

  const countValue =
    countNum > 1
      ? `${countNum} characters remaining`
      : `${countNum} character remaining`;

  const approveOrReject = async () => {
    try {
      const data = {
        status: approveData.status,
        narrative: narrative.trim(),
        isWithinLimit: approveData.isWithinLimit,
        email: approveData.email,
        firstname: approveData.firstname,
        lastname: approveData.lastname,
        productName: approveData.productName,
      };

      const loanAppId = approveData.loanAppId;

      setIsApproveLoading((prev) => !prev);

      const approveRejectApi = await approveOrRejectLoan(data, loanAppId);

      if (approveRejectApi.error) return notify(approveRejectApi.data, "error");
      console.log(data);

      notify(`Loan Rejection successful`, "success");
      setNarrativeModalBtn((prev) => !prev);
      setIsApproveLoading((prev) => !prev);
      history.push("/pages/loanMan");
    } catch (error) {
      notify(error.data, "error");
      setIsApproveLoading((prev) => !prev);
    }
  };

  const animateModal = useSpring({
    config: {
      duration: 250,
    },
    opacity: narrativeModalBtn ? 1 : 0,
    transform: narrativeModalBtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {narrativeModalBtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div narrativeModalBtn={narrativeModalBtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setNarrativeModalBtn((prev) => !prev)}
              >
                <TimesCircleFill className="modal-cancel-icon" />
              </button>
              <p className="appr-modal-text">
                State your reason for declining this loan request
              </p>
              <div>
                <textarea
                  onFocus={handleSetCount}
                  onBlur={handleRemoveCount}
                  rows="3"
                  className="narrative-text"
                  value={narrative}
                  onChange={getNarrative}
                  onKeyUp={textCounter}
                  onKeyDown={textCounter}
                ></textarea>
                {count ? (
                  <>
                    <input
                      className="text-count"
                      readOnly={true}
                      type="text"
                      value={countValue}
                    />
                    <span></span>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="narr-modal-btn">
                <button
                  className="btn approve-loan-btn first-btn"
                  onClick={approveOrReject}
                  disabled={isDisabled}
                >
                  <CheckCircleFill />
                  &nbsp; &nbsp;
                  {isAprroveLoading ? (
                    <SpinnerIcon className="limit-loading rotating" />
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  className="btn reject-loan-btn"
                  onClick={() => setNarrativeModalBtn((prev) => !prev)}
                >
                  <TimesCircleFill />
                  Cancel
                </button>
              </div>
            </div>
          </animated.div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const BookAndAcceptLoanModal = ({
  acceptModalBtn,
  setAcceptModalBtn,
  acceptData,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);
  const [amount, setAmount] = useState(null);
  const [tenure, setTenure] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState("");
  const history = useHistory();

  const getAmount = (e) => {
    setAmount(e.target.value);
    if (amount && tenure) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    setError("");
  };

  const getTenure = (e) => {
    setTenure(e.target.value);
    if (amount && tenure) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    setError("");
  };

  const handleCancel = () => {
    setAcceptModalBtn((prev) => !prev);
    setAmount(null);
    setTenure(null);
    setIsDisabled(true);
  };

  const bookAndApprovedLoan = async () => {
    try {
      const data = {
        narrative: acceptData.narrative,
        isWithinLimit: acceptData.isWithinLimit,
        status: acceptData.status,
        email: acceptData.email,
        firstname: acceptData.firstname,
        lastname: acceptData.lastname,
        productName: acceptData.productName,
        approvedAmount: amount,
        approvedTenure: tenure,
        applicationDate: moment(acceptData.applicationDate).format("LL"),
      };

      const loanAppId = acceptData.loanAppId;
      //   const customerId = acceptData.customerId;
      const limit = acceptData.limit;
      const maxTerm = acceptData.maxTerm;

      if (amount > limit) {
        setError(`Amount should not exceed ${limit}`);
        return;
      }
      if (tenure > maxTerm) {
        setError(`Maximun tenure is ${maxTerm} months`);
        return;
      }

      setIsApproveLoading((prev) => !prev);
      setError("");

      console.log(data);

      const bookLoan = await approveOrRejectLoan(data, loanAppId);

      if (bookLoan.error) {
        console.log(bookLoan);
        return notify(bookLoan.data, "error");
      }

      notify(`Loan Approval successful`, "success");
      setAcceptModalBtn((prev) => !prev);
      setIsApproveLoading((prev) => !prev);
      history.push("/pages/customers");
    } catch (error) {
      notify(error.data, "error");
      setIsApproveLoading((prev) => !prev);
    }
  };

  const animateModal = useSpring({
    config: {
      duration: 250,
    },
    opacity: acceptModalBtn ? 1 : 0,
    transform: acceptModalBtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {acceptModalBtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div acceptModalBtn={acceptModalBtn}>
              <button className="btn appr-close-btn" onClick={handleCancel}>
                <TimesCircleFill className="modal-cancel-icon" />
              </button>
              <p className="accept-error">{error}</p>
              <div className="accept-input">
                <label>Approved Amount</label>
                <input
                  className="amount-input"
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={getAmount}
                />

                <label>Approved Tenure</label>
                <input
                  className="month-input"
                  type="number"
                  placeholder="In months"
                  value={tenure}
                  onChange={getTenure}
                />
              </div>
              <div className="narr-modal-btn">
                <button
                  className="btn approve-loan-btn first-btn"
                  onClick={bookAndApprovedLoan}
                  disabled={isDisabled}
                >
                  <CheckCircleFill />
                  &nbsp; &nbsp;
                  {isAprroveLoading ? (
                    <SpinnerIcon className="limit-loading rotating" />
                  ) : (
                    "Submit"
                  )}
                </button>
                <button className="btn reject-loan-btn" onClick={handleCancel}>
                  <TimesCircleFill />
                  Cancel
                </button>
              </div>
            </div>
          </animated.div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const DisburseModal = ({
  disburseModalBtn,
  setDisburseModalBtn,
  approveData,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);

  const history = useHistory();

  const disburse = async () => {
    try {
      var data = {
        email: approveData.email,
        firstname: approveData.firstname,
        lastname: approveData.lastname,
        productName: approveData.productName,
      };

      const loanAppId = approveData.loanAppId;
      const customerId = approveData.customerId;

      setIsApproveLoading((prev) => !prev);

      const disburse = await disburseLoan(data, loanAppId, customerId);

      if (disburse.error) return notify(disburse.data, "error");
      console.log(data);

      notify(`Loan disbursed successfully`, "success");

      setDisburseModalBtn((prev) => !prev);
      setIsApproveLoading((prev) => !prev);
      history.push("/pages/loanMan");
    } catch (error) {
      notify(error.data, "error");
      setIsApproveLoading((prev) => !prev);
    }
  };

  const animateModal = useSpring({
    config: {
      duration: 250,
    },
    opacity: disburseModalBtn ? 1 : 0,
    transform: disburseModalBtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {disburseModalBtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div disburseModalBtn={disburseModalBtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setDisburseModalBtn((prev) => !prev)}
              >
                <TimesCircleFill className="modal-cancel-icon" />
              </button>
              <p className="appr-modal-text">Proceed with loan disbursement?</p>
              <div className="appr-modal-btn">
                <button
                  className="btn approve-loan-btn first-btn"
                  onClick={disburse}
                >
                  <CheckCircleFill /> &nbsp;
                  {isAprroveLoading ? (
                    <SpinnerIcon className="limit-loading rotating" />
                  ) : (
                    "Yes"
                  )}
                </button>

                <button
                  className="btn reject-loan-btn"
                  onClick={() => setDisburseModalBtn((prev) => !prev)}
                >
                  <TimesCircleFill />
                  No
                </button>
              </div>
            </div>
          </animated.div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const AcceptLoanModal = ({
  acceptLoanModalBtn,
  setAcceptLoanModalBtn,
  approveData,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);

  const acceptLoan = async () => {
    try {
      const data = {
        isWithinLimit: false,
      };
      const loanAppId = approveData.loanAppId;

      setIsApproveLoading((prev) => !prev);

      const approveRejectApi = await approveOrRejectLoan(data, loanAppId);

      if (approveRejectApi.error) return notify(approveRejectApi.data, "error");

      notify(approveRejectApi.data.text, "success");
      setAcceptLoanModalBtn((prev) => !prev);
      setIsApproveLoading((prev) => !prev);
      window.location.reload();
    } catch (error) {
      notify(error.data, "error");
      setIsApproveLoading((prev) => !prev);
    }
  };

  const animateModal = useSpring({
    config: {
      duration: 250,
    },
    opacity: acceptLoanModalBtn ? 1 : 0,
    transform: acceptLoanModalBtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {acceptLoanModalBtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div acceptLoanModalBtn={acceptLoanModalBtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setAcceptLoanModalBtn((prev) => !prev)}
              >
                <TimesCircleFill className="modal-cancel-icon" />
              </button>
              <p className="appr-modal-text">Proceed to loan acceptance?</p>

              <div className="appr-modal-btn">
                <button
                  className="btn approve-loan-btn first-btn"
                  onClick={acceptLoan}
                >
                  <CheckCircleFill />
                  &nbsp; &nbsp;
                  {isAprroveLoading ? (
                    <SpinnerIcon className="limit-loading rotating" />
                  ) : (
                    "Proceed"
                  )}
                </button>
                <button
                  className="btn reject-loan-btn"
                  onClick={() => setAcceptLoanModalBtn((prev) => !prev)}
                >
                  <TimesCircleFill />
                  Cancel
                </button>
              </div>
            </div>
          </animated.div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
