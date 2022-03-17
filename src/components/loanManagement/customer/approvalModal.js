import React from "react";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import notify from "../../../utils/notification";
import {
  addComment,
  approveOrRejectLoan,
  disburseLoan,
  getLoanDetails,
  loanRequestBooking,
} from "../../../services/loanService";
import { useState } from "react/cjs/react.development";
import { useSpring, animated } from "react-spring";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { getAdminEmail } from "../../../utils/localStorageService";

export const ApprovalModal = ({
  approvemodalbtn,
  setapprovemodalbtn,
  approvedata,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);
  const [isAboveLoading, setIsAboveLoading] = useState(false);
  const [acceptmodalbtn, setAcceptmodalbtn] = useState(false);
  const [acceptData, setAcceptData] = useState({});

  const history = useHistory();

  const aboveLimit = async () => {
    try {
      const data = {
        isWithinLimit: false,
        work_flow_level: approvedata.work_flow_level,
      };
      const loanAppId = approvedata.loanAppId;

      setIsAboveLoading((prev) => !prev);

      const approveRejectApi = await approveOrRejectLoan(data, loanAppId);

      if (approveRejectApi.error) return notify(approveRejectApi.data, "error");

      notify(approveRejectApi.data.text, "success");
      setapprovemodalbtn((prev) => !prev);
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
    opacity: approvemodalbtn ? 1 : 0,
    transform: approvemodalbtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  const handleAcceptModal = () => {
    return (
      <BookAndAcceptLoanModal
        acceptmodalbtn={acceptmodalbtn}
        setAcceptmodalbtn={setAcceptmodalbtn}
        acceptdata={acceptData}
      />
    );
  };

  const checkAcceptModal = () => {
    setapprovemodalbtn((prev) => !prev);
    setAcceptmodalbtn((prev) => !prev);

    var data = {
      limit: approvedata.limit,
      maxTerm: approvedata.maxTerm,
      loanAppId: approvedata.loanAppId,
      customerId: approvedata.customerId,
      applicationDate: approvedata.applicationDate,
      status: approvedata.status,
      narrative: approvedata.narrative,
      isWithinLimit: approvedata.isWithinLimit,
      email: approvedata.email,
      firstname: approvedata.firstname,
      lastname: approvedata.lastname,
      productName: approvedata.productName,
    };

    setAcceptData(data);
  };

  return (
    <>
      {handleAcceptModal()}
      {approvemodalbtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div approvemodalbtn={approvemodalbtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setapprovemodalbtn((prev) => !prev)}
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
  narrativemodalbtn,
  setNarrativemodalbtn,
  approvedata,
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
    validText.length > 20 ? setIsDisabled(false) : setIsDisabled(true);
  };

  const countValue =
    countNum > 1
      ? `${countNum} characters remaining`
      : `${countNum} character remaining`;

  const approveOrReject = async () => {
    try {
      const data = {
        status: approvedata.status,
        narrative: narrative.trim(),
        isWithinLimit: approvedata.isWithinLimit,
        email: approvedata.email,
        firstname: approvedata.firstname,
        lastname: approvedata.lastname,
        productName: approvedata.productName,
      };

      const loanAppId = approvedata.loanAppId;

      setIsApproveLoading((prev) => !prev);

      const approveRejectApi = await approveOrRejectLoan(data, loanAppId);

      if (approveRejectApi.error) return notify(approveRejectApi.data, "error");
      console.log(data);

      notify(`Loan Rejection successful`, "success");
      setNarrativemodalbtn((prev) => !prev);
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
    opacity: narrativemodalbtn ? 1 : 0,
    transform: narrativemodalbtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {narrativemodalbtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div narrativemodalbtn={narrativemodalbtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setNarrativemodalbtn((prev) => !prev)}
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
                  rows="6"
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
                  onClick={() => setNarrativemodalbtn((prev) => !prev)}
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
  acceptmodalbtn,
  setAcceptmodalbtn,
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
    setAcceptmodalbtn((prev) => !prev);
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
      setAcceptmodalbtn((prev) => !prev);
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
    opacity: acceptmodalbtn ? 1 : 0,
    transform: acceptmodalbtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {acceptmodalbtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div acceptmodalbtn={acceptmodalbtn}>
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
  disbursemodalbtn,
  setDisbursemodalbtn,
  approvedata,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);

  const history = useHistory();

  const disburse = async () => {
    try {
      const today = new Date();

      const requestData = {
        inputDate: `${today}`,
        customerType: "INDIVIDUAL",
        customerId: `${approvedata.customerId}`,
        loanAction: approvedata.productName.replace(/ /g, ""),
        loanProduct: approvedata.productName.replace(/ /g, ""),
        // productId: approvedata.loanProductId,
        amountRequested: approvedata.approvedAmount,
        currency: "NGN",
        interestRate: approvedata.interestRate,
        termRequested: approvedata.approvedTenure,
        loanPurpose: "1",
        sector: "10",
        guarantorId: approvedata.guarantorId,
        disburseAccount: approvedata.accountNo,
        repayAccount: approvedata.accountNo,
        chargeAccount: approvedata.accountNo,
      };
      console.log(requestData);

      var data = {
        email: approvedata.email,
        firstname: approvedata.firstname,
        lastname: approvedata.lastname,
        productName: approvedata.productName,
        sn: "",
        accountNo: "",
        settlementAccount: "",
        loanID: "",
        customerName: "",
        productCategory: "",
        productType: approvedata.productType,
        customerType: approvedata.customerType,
        sector: approvedata.sector,
        dateGranted: "",
        expiryDate: approvedata.expiryDate,
        tenorInDays: "",
        legacyID: approvedata.legacyID,
        authorizedLimit: "",
        disbursedAmount: "",
        arrangementFee: "",
        outstandingBalance: "",
        interestReceivable: "",
        grossLoans: "",
        riskRating: "",
        pastDueObligationPrincipal: "",
        numberOfPaymentsOutstanding: approvedata.numberOfPaymentsOutstanding,
        daysPastDue: approvedata.daysPastDue,
        pastDueObligationInterest: approvedata.pastDueObligationInterest,
        subStatus: approvedata.subStatus,
        status: approvedata.status,
        contratualIntRate: approvedata.contratualIntRate,
        annualEffectiveInterestRate: approvedata.annualEffectiveInterestRate,
        restructure: approvedata.restructure,
        paymentFrequencyPrincipal: approvedata.paymentFrequencyPrincipal,
        paymentFreqInterest: approvedata.paymentFreqInterest,
        collateralStatus: approvedata.collateralStatus,
        collateralType: approvedata.collateralType,
        otherCollateral: approvedata.otherCollateral,
        collateralvalue: approvedata.collateralvalue,
        daysToRealization: approvedata.daysToRealization,
      };
      // setIsApproveLoading((prev) => !prev);

      const loanAppId = approvedata.loanAppId;

      const loanRequest = await loanRequestBooking(requestData);

      console.log("clicked", loanRequest);

      // if (loanRequest?.data?.error === true) {
      //   setIsApproveLoading((prev) => !prev);
      //   notify(loanRequest?.data?.message, "error");
      //   return;
      // }

      // if (loanRequest?.data?.error === true) {
      //   setIsApproveLoading((prev) => !prev);
      //   notify(loanRequest?.data?.message, "error");
      //   return;
      // }

      // if (loanRequest?.data?.data?.data?.status === true) {
      //   data.loanID = loanRequest.data.ApplicationId;
      //   const loanAccount = approvedata.account_no;

      //   const loanDetails = await getLoanDetails(loanAccount);

      //   console.log(loanDetails);

      //   if (loanDetails?.data?.data?.data?.status === false) {
      //     setIsApproveLoading((prev) => !prev);
      //     notify(loanDetails?.data?.data?.data?.message, "error");
      //     return;
      //   }

      //   if (loanDetails?.data?.data?.data?.status === true) {
      //     data.productCategory = loanDetails.data.loanProduct;
      //     data.dateGranted = loanDetails.data.dateDisbursed;
      //     data.outstandingBalance = loanDetails.data.amountDisbursed;
      //     data.interestReceivable = loanDetails.data.interestReceivable;
      //     data.grossLoans = loanDetails.data.amountDisbursed;
      //     data.pastDueObligationPrincipal = loanDetails.data.overdueBalance;
      //     data.disbursedAmount = loanDetails.data.amountDisbursed;

      //     const disburse = await disburseLoan(data, loanAppId);

      //     if (disburse.error) {
      //       setIsApproveLoading((prev) => !prev);
      //       notify(disburse.data, "error");
      //       return;
      //     }
      //     console.log(data);

      //     notify(`Loan disbursed successfully`, "success");
      //     setDisbursemodalbtn((prev) => !prev);
      //     setIsApproveLoading((prev) => !prev);
      //     history.push("/pages/loanMan");
      //     return;
      //   }
      // }

      // notify(`Something went wrong`, "error");
      // setTimeout(() => {
      //   // setIsApproveLoading((prev) => !prev);
      //   setDisbursemodalbtn((prev) => !prev);
      // }, 6000);
      // return;
    } catch (error) {
      notify(error.data, "error");
      // setIsApproveLoading(false);
      setTimeout(() => {
        setDisbursemodalbtn((prev) => !prev);
      }, 6000);
      return;
    }
  };

  const animateModal = useSpring({
    config: {
      duration: 250,
    },
    opacity: disbursemodalbtn ? 1 : 0,
    transform: disbursemodalbtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {disbursemodalbtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div disbursemodalbtn={disbursemodalbtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setDisbursemodalbtn((prev) => !prev)}
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
                  onClick={() => {
                    setDisbursemodalbtn((prev) => !prev);
                    setIsApproveLoading((prev) => !prev);
                  }}
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
  acceptloanmodalbtn,
  setAcceptloanmodalbtn,
  approvedata,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);

  const acceptLoan = async () => {
    try {
      const data = {
        isWithinLimit: false,
        work_flow_level: 1,
      };
      const loanAppId = approvedata.loanAppId;

      setIsApproveLoading((prev) => !prev);

      const approveRejectApi = await approveOrRejectLoan(data, loanAppId);

      if (approveRejectApi.error) return notify(approveRejectApi.data, "error");

      notify(approveRejectApi.data.text, "success");
      setAcceptloanmodalbtn((prev) => !prev);
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
    opacity: acceptloanmodalbtn ? 1 : 0,
    transform: acceptloanmodalbtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {acceptloanmodalbtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div acceptloanmodalbtn={acceptloanmodalbtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setAcceptloanmodalbtn((prev) => !prev)}
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
                  onClick={() => setAcceptloanmodalbtn((prev) => !prev)}
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

export const CommentModal = ({
  commentmodalbtn,
  setCommentmodalbtn,
  commentdata,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);
  const [count, setCount] = useState(false);
  const [countNum, setCountNum] = useState(120);
  const [isDisabled, setIsDisabled] = useState(true);
  const [staffId, setStaffId] = useState("");
  const [rank, setRank] = useState("");
  const [fullName, setFullName] = useState("");
  const [staffBranch, setStaffBranch] = useState("");
  const [comment, setComment] = useState("");
  const email = getAdminEmail();

  const handleSetCount = () => {
    setCount((prev) => !prev);
  };

  const handleRemoveCount = () => {
    setCount(false);
  };

  const getComment = (e) => setComment(e.target.value);
  const getStaffId = (e) => setStaffId(e.target.value);
  const getRank = (e) => setRank(e.target.value);
  const getFullName = (e) => setFullName(e.target.value);
  const getStaffBranch = (e) => setStaffBranch(e.target.value);

  const textCounter = () => {
    //max charcater is 120
    const maxAmount = 120;
    //check if user is greater than max character
    comment.length > maxAmount
      ? //if input is greater than max character set textarea to only have
        //the amount of max character entered and nothing more
        setComment(comment.substring(0, maxAmount))
      : //set count indicator value
        setCountNum(maxAmount - comment.length);

    //enable button if input is valid and vice verse
    const validText = comment.trim();
    validText.length > 20 &&
    staffId !== "" &&
    rank !== "" &&
    fullName !== "" &&
    staffBranch !== ""
      ? setIsDisabled(false)
      : setIsDisabled(true);
  };

  const countValue =
    countNum > 1
      ? `${countNum} characters remaining`
      : `${countNum} character remaining`;

  const addLoanOfficerComment = async () => {
    try {
      const data = {
        staffId: staffId.trim(),
        comment: comment.trim(),
        rank: rank,
        fullName: fullName,
        staffEmail: email,
        staffBranch: staffBranch,
        loanAppId: commentdata.loanAppId,
      };

      setIsApproveLoading((prev) => !prev);

      const response = await addComment(data);

      if (response.error) return notify(response.data, "error");
      console.log(data);

      notify(`Comment added successfully`, "success");

      setIsApproveLoading((prev) => !prev);
      setTimeout(() => {
        setCommentmodalbtn((prev) => !prev);
        window.location.reload();
      }, 2500);
      return;
    } catch (error) {
      notify(error.message, "error");
      setIsApproveLoading((prev) => !prev);
      return;
    }
  };

  const animateModal = useSpring({
    config: {
      duration: 250,
    },
    opacity: commentmodalbtn ? 1 : 0,
    transform: commentmodalbtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {commentmodalbtn ? (
        <div className="appr-modal">
          <animated.div className="comment-inner" style={animateModal}>
            <div commentmodalbtn={commentmodalbtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setCommentmodalbtn((prev) => !prev)}
              >
                <TimesCircleFill className="modal-cancel-icon" />
              </button>
              <p className="appr-modal-text">Add your comment</p>
              <form>
                <div
                // className={`form-group${
                //   isInputFocused.email ? " input-focused" : ""
                // }`}
                >
                  <label htmlFor="staffID">Staff ID</label>
                  <input
                    type="staffID"
                    name="staffID"
                    id="staffID"
                    className="form-control"
                    required
                    value={staffId}
                    onChange={getStaffId}
                    onKeyUp={textCounter}
                    onKeyDown={textCounter}
                  />
                </div>
                <div
                // className={`form-group${
                //   isInputFocused.email ? " input-focused" : ""
                // }`}
                >
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="name"
                    name="fullName"
                    id="fullName"
                    className="form-control"
                    required
                    value={fullName}
                    onChange={getFullName}
                    onKeyUp={textCounter}
                    onKeyDown={textCounter}
                  />
                </div>
                <div
                // className={`form-group${
                //   isInputFocused.email ? " input-focused" : ""
                // }`}
                >
                  <label htmlFor="rank">Rank</label>
                  <input
                    type="rank"
                    name="rank"
                    id="rank"
                    className="form-control"
                    required
                    value={rank}
                    onChange={getRank}
                    onKeyUp={textCounter}
                    onKeyDown={textCounter}
                  />
                </div>

                <div
                // className={`form-group${
                //   isInputFocused.email ? " input-focused" : ""
                // }`}
                >
                  <label htmlFor="branch">Branch</label>
                  <input
                    type="branch"
                    name="branch"
                    id="branch"
                    className="form-control"
                    required
                    value={staffBranch}
                    onChange={getStaffBranch}
                    onKeyUp={textCounter}
                    onKeyDown={textCounter}
                  />
                </div>

                <div>
                  <label htmlFor="comment">Comment</label>
                  <textarea
                    onFocus={handleSetCount}
                    onBlur={handleRemoveCount}
                    rows="6"
                    className="narrative-text"
                    value={comment}
                    onChange={getComment}
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
              </form>
              <div className="narr-modal-btn">
                <button
                  className="btn approve-loan-btn first-btn"
                  onClick={addLoanOfficerComment}
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
                  onClick={() => setCommentmodalbtn((prev) => !prev)}
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
