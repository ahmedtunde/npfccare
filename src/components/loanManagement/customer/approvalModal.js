import React, { useEffect } from "react";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import notify from "../../../utils/notification";
import {
  addComment,
  approveOrRejectLoan,
  disburseLoan,
  getBranches,
  getLoanDetails,
  getLoanProducts,
  loanRequestBooking,
} from "../../../services/loanService";
import { useState } from "react/cjs/react.development";
import { useSpring, animated } from "react-spring";
import { useHistory } from "react-router-dom";
import moment from "moment";
import {
  getAdminEmail,
  getRoles as getAdminRoles,
} from "../../../utils/localStorageService";
import {
  deleteAdminAccount,
  searchAdminProfile,
} from "../../../services/adminService";

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
        work_flow_level: approveData.work_flow_level,
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
    validText.length > 20 ? setIsDisabled(false) : setIsDisabled(true);
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

      console.log(data);

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
                <div>
                  <label>Approved Amount</label>
                  <input
                    className="amount-input"
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={getAmount}
                  />
                </div>

                <div>
                  <label>Approved Tenure</label>
                  <input
                    className="month-input"
                    type="number"
                    placeholder="In months"
                    value={tenure}
                    onChange={getTenure}
                  />
                </div>
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
  const [loanProducts, setLoanProducts] = useState([]);

  // useEffect(() => {
  //   handleLoanProducts();
  // }, []);

  // const handleLoanProducts = async () => {
  //   try {
  //     const companyCode = `NG0020001`;
  //     const products = await getLoanProducts(companyCode);

  //     console.log(products);

  //     if (products.error) return notify(products.message, "error");
  //     setLoanProducts(products.data?.result?.data?.products);
  //   } catch (error) {
  //     console.log(error);
  //     notify("Something went wrong", "error");
  //   }
  // };

  // const history = useHistory();

  const disburse = async () => {
    //   try {
    //     const today = new Date();
    //     const requestData = {
    //       inputDate: moment(today).format("YYYYMMDD"),
    //       customerType: "INDIVIDUAL",
    //       customerId: `${approveData.customerId}`,
    //       loanAction: "",
    //       loanProduct: "",
    //       amountRequested: approveData.approvedAmount,
    //       currency: "NGN",
    //       interestRate: approveData.interestRate,
    //       termRequested: approveData.approvedTenure,
    //       loanPurpose: "1",
    //       sector: "10",
    //       guarantorId: approveData.guarantorId,
    //       disburseAccount: approveData.accountNo,
    //       repayAccount: approveData.accountNo,
    //       chargeAccount: approveData.accountNo,
    //     };
    //     console.log(requestData);
    //     loanProducts &&
    //       loanProducts.forEach((product) => {
    //         if (product.productDescription === approveData.productName) {
    //           requestData.loanAction = product.productCode;
    //           requestData.loanProduct = product.productCode;
    //         }
    //       });
    //     var data = {
    //       email: approveData.email,
    //       firstname: approveData.firstname,
    //       lastname: approveData.lastname,
    //       productName: approveData.productName,
    //       sn: "",
    //       accountNo: "",
    //       settlementAccount: "",
    //       loanID: "",
    //       customerName: "",
    //       productCategory: "",
    //       productType: approveData.productType,
    //       customerType: approveData.customerType,
    //       sector: approveData.sector,
    //       dateGranted: "",
    //       expiryDate: approveData.expiryDate,
    //       tenorInDays: "",
    //       legacyID: approveData.legacyID,
    //       authorizedLimit: "",
    //       disbursedAmount: "",
    //       arrangementFee: "",
    //       outstandingBalance: "",
    //       interestReceivable: "",
    //       grossLoans: "",
    //       riskRating: "",
    //       pastDueObligationPrincipal: "",
    //       numberOfPaymentsOutstanding: approveData.numberOfPaymentsOutstanding,
    //       daysPastDue: approveData.daysPastDue,
    //       pastDueObligationInterest: approveData.pastDueObligationInterest,
    //       subStatus: approveData.subStatus,
    //       status: approveData.status,
    //       contratualIntRate: approveData.contratualIntRate,
    //       annualEffectiveInterestRate: approveData.annualEffectiveInterestRate,
    //       restructure: approveData.restructure,
    //       paymentFrequencyPrincipal: approveData.paymentFrequencyPrincipal,
    //       paymentFreqInterest: approveData.paymentFreqInterest,
    //       collateralStatus: approveData.collateralStatus,
    //       collateralType: approveData.collateralType,
    //       otherCollateral: approveData.otherCollateral,
    //       collateralvalue: approveData.collateralvalue,
    //       daysToRealization: approveData.daysToRealization,
    //     };
    //     // setIsApproveLoading((prev) => !prev);
    //     const loanAppId = approveData.loanAppId;
    //     // const loanRequest = await loanRequestBooking(requestData);
    //     console.log("clicked", requestData);
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
    //   const loanAccount = approveData.account_no;
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
    //     setDisburseModalBtn((prev) => !prev);
    //     setIsApproveLoading((prev) => !prev);
    //     history.push("/pages/loanMan");
    //     return;
    //   }
    // }
    // notify(`Something went wrong`, "error");
    // setTimeout(() => {
    //   // setIsApproveLoading((prev) => !prev);
    //   setDisburseModalBtn((prev) => !prev);
    // }, 6000);
    //     // return;
    //   } catch (error) {
    //     notify(error.data, "error");
    //     // setIsApproveLoading(false);
    //     setTimeout(() => {
    //       setDisburseModalBtn((prev) => !prev);
    //     }, 6000);
    //     return;
    //   }
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
                  onClick={() => {
                    setDisburseModalBtn((prev) => !prev);
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
  acceptLoanModalBtn,
  setAcceptLoanModalBtn,
  approveData,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);

  const acceptLoan = async () => {
    try {
      const data = {
        isWithinLimit: false,
        work_flow_level: 1,
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

export const CommentModal = ({
  commentModalBtn,
  setCommentModalBtn,
  commentData,
}) => {
  const [isAprroveLoading, setIsApproveLoading] = useState(false);
  const [count, setCount] = useState(false);
  const [countNum, setCountNum] = useState(1000);
  const [isDisabled, setIsDisabled] = useState(true);
  const [branch, setBranch] = useState([]);
  const [staffBranch, setStaffBranch] = useState("");
  const [comment, setComment] = useState("");
  const [getAdmin, setGetAdmin] = useState({});
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(false);
  const roles = getAdminRoles();

  const email = getAdminEmail();

  useEffect(() => {
    const handleSearchAdmin = async () => {
      setLoading(true);
      try {
        const response = await searchAdminProfile(email);
        const result = await getBranches();

        if (response.data.status) {
          setGetAdmin(response.data.data);
          setBranch(result.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleSearchAdmin();
  }, [email]);

  useEffect(() => {
    setAdminName(`${getAdmin.firstname} ${getAdmin.lastname}`);

    branch &&
      branch.forEach((option) => {
        if (parseInt(getAdmin.branch) === option.id) {
          setStaffBranch(option.name);
        }
      });
  }, [branch, getAdmin.branch, getAdmin.firstname, getAdmin.lastname]);

  const handleSetCount = () => {
    setCount((prev) => !prev);
  };

  const handleRemoveCount = () => {
    setCount(false);
  };

  const getComment = (e) => setComment(e.target.value);

  const textCounter = () => {
    //max charcater is 120
    const maxAmount = 1000;
    //check if user is greater than max character
    comment.length > maxAmount
      ? //if input is greater than max character set textarea to only have
        //the amount of max character entered and nothing more
        setComment(comment.substring(0, maxAmount))
      : //set count indicator value
        setCountNum(maxAmount - comment.length);

    //enable button if input is valid and vice verse
    const validText = comment.trim();
    validText.length > 20 ? setIsDisabled(false) : setIsDisabled(true);
  };

  const countValue =
    countNum > 1
      ? `${countNum} characters remaining`
      : `${countNum} character remaining`;

  const addLoanOfficerComment = async () => {
    try {
      const data = {
        staffId: getAdmin.staff_id,
        comment:
          roles === "AUDIT"
            ? `AUDITOR'S COMMENT: ${comment.trim()}`
            : comment.trim(),
        rank: getAdmin.rank,
        fullName: adminName,
        staffEmail: email,
        staffBranch: staffBranch,
        loanAppId: commentData.loanAppId,
      };

      setIsApproveLoading((prev) => !prev);

      const response = await addComment(data);

      if (response.error) return notify(response.data, "error");

      notify(`Comment added successfully`, "success");

      setIsApproveLoading((prev) => !prev);
      setTimeout(() => {
        setCommentModalBtn((prev) => !prev);
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
    opacity: commentModalBtn ? 1 : 0,
    transform: commentModalBtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  return (
    <>
      {commentModalBtn ? (
        <div className="appr-modal">
          <animated.div className="comment-inner" style={animateModal}>
            <div commentModalBtn={commentModalBtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setCommentModalBtn((prev) => !prev)}
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
                    type="text"
                    name="staff_id"
                    id="staff_id"
                    className="form-control"
                    defaultValue={loading ? "Loading..." : getAdmin.staff_id}
                    readOnly={true}
                  />
                </div>
                <div>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="form-control"
                    readOnly={true}
                    defaultValue={loading ? "Loading..." : adminName}
                  />
                </div>
                <div
                // className={`form-group${
                //   isInputFocused.email ? " input-focused" : ""
                // }`}
                >
                  <label htmlFor="rank">Rank</label>
                  <input
                    type="text"
                    name="rank"
                    id="rank"
                    className="form-control"
                    readOnly={true}
                    defaultValue={loading ? "Loading..." : getAdmin.rank}
                  />
                </div>

                <div>
                  <label htmlFor="branch">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    id="branch"
                    className="form-control"
                    readOnly={true}
                    defaultValue={loading ? "Loading..." : staffBranch}
                  />
                </div>

                <div>
                  <label htmlFor="comment">Comment</label>
                  <textarea
                    onFocus={handleSetCount}
                    onBlur={handleRemoveCount}
                    rows="10"
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
                  onClick={() => setCommentModalBtn((prev) => !prev)}
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

export const DeleteModal = ({
  deleteModalBtn,
  setDeleteModalBtn,
  deleteData,
}) => {
  const history = useHistory();
  const [isAprroveLoading, setIsApproveLoading] = useState(false);
  const animateModal = useSpring({
    config: {
      duration: 250,
    },
    opacity: deleteModalBtn ? 1 : 0,
    transform: deleteModalBtn ? `translateY(0%)` : `translateY(-100%)`,
  });

  const handleDeleteProfile = async () => {
    setIsApproveLoading(true);
    try {
      const id = deleteData.id;

      const response = await deleteAdminAccount(id);

      if (response.error) {
        notify(response.message, "error");
        setIsApproveLoading(false);
        return;
      }
      notify(response.message, "success");
      setIsApproveLoading(false);
      history.push("/pages/superAdmin");
      return;
    } catch (error) {
      notify("Something went wrong", "success");
      setIsApproveLoading(false);
      return;
    }
  };

  return (
    <>
      {deleteModalBtn ? (
        <div className="appr-modal">
          <animated.div className="appr-inner" style={animateModal}>
            <div deleteModalBtn={deleteModalBtn}>
              <button
                className="btn appr-close-btn"
                onClick={() => setDeleteModalBtn((prev) => !prev)}
              >
                <TimesCircleFill className="modal-cancel-icon" />
              </button>
              <p className="appr-modal-text">
                {`Are you sure you want to delete ${deleteData.adminName}'s ${
                  deleteData.adminRole ? deleteData.adminRole : ""
                } profile?`}
              </p>

              <div className="narr-modal-btn">
                <button
                  className="btn approve-loan-btn first-btn"
                  onClick={handleDeleteProfile}
                  disabled={isAprroveLoading ? true : false}
                >
                  <CheckCircleFill />
                  &nbsp; &nbsp;
                  {isAprroveLoading ? (
                    <SpinnerIcon className="limit-loading rotating" />
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  className="btn reject-loan-btn"
                  onClick={() => setDeleteModalBtn((prev) => !prev)}
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
