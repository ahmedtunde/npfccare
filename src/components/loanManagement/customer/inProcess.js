import React, { Fragment, useCallback, useState } from "react";
import face from "../../../assets/img/face.jpg";
import placeholderImg from "../../../assets/img/placeholder-img.png";
import { ReactComponent as ArrowRightCircle } from "../../../assets/icons/arrow-right-circle.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as ArrowRightShort } from "../../../assets/icons/arrow-right-short.svg";
import { ReactComponent as FileEarmarkImage } from "../../../assets/icons/file-earmark-image.svg";
import { ReactComponent as FileEarmarkTextFill } from "../../../assets/icons/file-earmark-text-fill.svg";
import { ReactComponent as CloudDownloadIcon } from "../../../assets/icons/cloud-computing-download.svg";
import { ReactComponent as PrintIcon } from "../../../assets/icons/print-icon.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import {
  useHistory,
  useLocation,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../utilities";
import errorHandler from "../../../utils/errorHandler";
import notify from "../../../utils/notification";
import LoanRightOptions from "../loanRightOptions";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import UpdateScore from "./UpdateScore";
import UpdateDoc from "./UpdateDoc";
import { getCustomer } from "../../../services/customerService";
import { useEffect } from "react/cjs/react.development";
import {
  getCustomerById,
  getLoanScore,
  getRoles,
} from "../../../services/loanService";
import {
  AcceptLoanModal,
  ApprovalModal,
  NarrativeModal,
} from "./approvalModal";

import { getLoanRoles } from "../../../utils/localStorageService";

const InProcessCustomer = (props) => {
  const [score, setScore] = useState(false);
  const [scoreDoc, setScoreDoc] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const { url, params } = useLocation();
  const { state: locationState, pathname, search } = location;
  const auth = useAuth();
  // useCallback ensures that handle error function isn't recreated on every render
  const handleError = useCallback(
    (errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb),
    [auth]
  );

  const [customer, setCustomer] = useState({
    PND: false,
    account_status: null,
    address: "N/A",
    bucket: "npf-mfb",
    bvnhash: "",
    companyCode: null,
    createdAt: "",
    customerNumber: "",
    dob: "",
    document_key: "",
    document_location: face,
    document_number: "",
    document_type_id: 0,
    email: "thatguy@everyone.me",
    enabled: true,
    firstname: "Janet",
    force_number: "",
    has_pin: false,
    id: 0,
    ippis_number: "",
    isnewbankcustomer: null,
    document_issue_date: "",
    document_expiry_date: "",
    photostatus: "PENDING",
    documentstatus: "PENDING",
    signaturestatus: "PENDING",
    livelinesschecked: "PENDING",
    isotpverified: true,
    lastname: "Montoya",
    middlename: "N/A",
    otpstatus: null,
    phone: "",
    photo_key: "",
    photo_location: "",
    photo_number: null,
    pob: null,
    registration_channel: "",
    salary_officer: true,
    signature_key: "",
    signature_location: "",
    simswapstatus: null,
    updatedAt: "",
    user: 0,
    video_key: "",
    video_location: "",
    signup_incomplete: true,
    accounts: [],
  });

  const [loan, setLoan] = useState({
    name: "",
    email: "",
    photo_location: "",
    bvn: null,
    phone: "",
    profilecomplete: "",
    livelinesschecked: "",
    dti: 0,
    loan_app_id: 0,
    createdBy: 0,
    createdAt: "",
    updatedAt: "",
    loanApp: {
      name: "",
      loan_product_id: 0,
      amount: 0,
      workFlowLevel: 1,
      approvalBranch_id: 0,
      monthlyIncome: 0,
      approvedAmount: 0,
      approvedTenure: 0,
      loan_purpose: "",
      creditRptRequested: false,
      status: "",
      narrative: "",
      date_completed: null,
      customer_id: 0,
      requested_loan_tenure: 0,
      createdAt: "",
      updatedAt: "",
      loanProduct: {
        name: "",
        productType: "",
        creditScoringType: "",
        interestRate: 0,
        maxTerm: 0,
        maxTermUnit: "",
        limit: 0,
        repaymentReqmt: "",
        guarantorsCnt: 0,
        createdAt: "",
        updatedAt: "",

        loanProductCategory: {
          name: "",
          description: "",
          categoryType: "",
          createdAt: "",
          updatedAt: "",
        },
      },
    },
  });

  const [showSection, setShowSection] = useState("all");
  // const [showAuditHistory, setShowAuditHistory] = useState("all");
  const [isLoading, setLoading] = useState({
    userFull: false,
    acceptApplication: false,
    rejectApplication: false,
    approveApplication: false,
    printApplication: false,
    loadPage: false,
  });

  const [isScoringActive, setIsScoringActive] = useState(false);
  const [values, setValues] = useState({});
  const [approveModalBtn, setApproveModalBtn] = useState(false);
  const [approveData, setApproveData] = useState({});
  const [narrativeModalBtn, setNarrativeModalBtn] = useState(false);
  const [acceptLoanModalBtn, setAcceptLoanModalBtn] = useState(false);
  const [adminWorkFlowLevel, setAdminWorkFlowLevel] = useState(0);

  const searchParams = new URLSearchParams(search);
  const loanCustomerId = searchParams.get("id");

  useEffect(() => {
    async function handleFetchSingleLoan(loanCustomerId) {
      try {
        handleChangeLoading("loadPage", true);
        setApproveModalBtn(false);
        setNarrativeModalBtn(false);

        const loanApp = await getCustomerById(loanCustomerId);

        if (loanApp.error) return notify(loanApp.data, "error");
        if (loanApp.data === null) {
          notify("Loan Not Found", "error");
          history.push("/pages/loanMan");
          return;
        }
        const userId = loanApp.data.loanApp.customer_id;
        const loanUser = await getCustomer(userId);
        if (loanUser.error) return notify(loanUser.message, "error");
        if (loanUser.result === null) {
          notify("Customer Not Found", "error");
          history.push("/pages/loanMan");
          return;
        }

        const loanAppId = loanApp.data.loanApp.id;

        const loanScore = await getLoanScore(loanAppId);
        if (loanScore.error) return notify(loanScore.message, "error");
        if (loanScore.data === null) {
          notify("LoanScore Not Found", "error");
          return;
        }

        setLoan((prev) => ({
          ...prev,
          ...loanApp.data,
          loanScore: loanScore.data,
        }));

        // setCustomer((prev) => ({
        //   ...prev,
        //   ...loanUser.result,
        // }));

        const roles = await getRoles();

        const loanRoles = getLoanRoles();
        const formatLoanRoles = loanRoles.replace(/,/g, "");
        roles.data.forEach((role) => {
          if (role.code === formatLoanRoles) {
            setAdminWorkFlowLevel(role.workFlowLevel);
          }
        });

        handleChangeLoading("loadPage", false);
      } catch (error) {
        handleError(error, notify, () =>
          handleChangeLoading("userFull", false)
        );
      }
    }
    handleFetchSingleLoan(loanCustomerId);

    // console.log(loan.loanApp.workFlowLevel);
  }, [history, loanCustomerId, handleError]);

  console.log(adminWorkFlowLevel);

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

  const totalScore =
    loan.loanApp.loanTotalScore &&
    loan.loanApp.loanTotalScore.map((item) => item.totalScore);

  const displayScore = totalScore && totalScore.length > 0 ? totalScore[0] : 0;

  // console.log(customer);
  // console.log(loan);

  // const displayLoanScore = () => {
  //   return loan.loanScore.map((scx) => (
  //     <>
  //       {scoreType === "App" ? (
  //         <div className="row" key={id}>
  //           <div className="col-6 mb-1">{requirements}:</div>
  //           <div key={scx.id} className="col">
  //             48 &nbsp;&nbsp;
  //             <span className="color-sec-green">Score: {scx.id}%</span>
  //           </div>
  //         </div>
  //       ) : (
  //         ""
  //       )}
  //     </>
  //   ));
  // };

  const displayAppLoanScore = () => {
    return loan.loanScore.map((scx) => {
      const { id, requirement, value, score } = scx;
      return (
        <>
          <div className="row" key={id}>
            <div className="col-6 mb-1">{requirement}:</div>
            <div key={scx.id} className="col">
              {value} &nbsp;&nbsp;
              <span className="color-sec-green">Score: {score}%</span>
            </div>
          </div>
        </>
      );
    });
  };

  const displayBehLoanScore = () => {
    return loan.loanApp.loanProduct.loanProductCategory.criterias.map(
      (criteria) => {
        const { id, requirements, scoreType } = criteria;
        return (
          <>
            {scoreType === "Behavioural" ? (
              <div className="row" key={id}>
                <div className="col-6 mb-1">{requirements}:</div>
                <div className="col">
                  &nbsp;&nbsp;
                  <span className="color-sec-green">Score: N/A</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        );
      }
    );
  };

  const handleApprovalModal = () => {
    return (
      <ApprovalModal
        approveModalBtn={approveModalBtn}
        setApproveModalBtn={setApproveModalBtn}
        approveData={approveData}
        setApproveData={setApproveData}
      />
    );
  };

  const handleRejectModal = () => {
    return (
      <NarrativeModal
        narrativeModalBtn={narrativeModalBtn}
        setNarrativeModalBtn={setNarrativeModalBtn}
        approveData={approveData}
      />
    );
  };

  const handleAcceptLoanModal = () => {
    return (
      <AcceptLoanModal
        acceptLoanModalBtn={acceptLoanModalBtn}
        setAcceptLoanModalBtn={setAcceptLoanModalBtn}
        approveData={approveData}
      />
    );
  };

  const name = loan.name.split(" ");

  const checkApprovalModal = () => {
    setApproveModalBtn((prev) => !prev);

    var data = {
      status: "APPROVE",
      narrative: "",
      isWithinLimit: true,
      email: loan.email,
      firstname: name[0],
      lastname: name[1],
      productName: loan.loanApp.loanProduct.name,
      loanAppId: loan.loan_app_id,
      limit: loan.loanApp.loanProduct.limit,
      maxTerm: loan.loanApp.loanProduct.maxTerm,
      applicationDate: loan.loanApp.createdAt,
      customerId: customer.id,
    };

    setApproveData(data);

    console.log(approveData);
  };

  const checkRejectModal = () => {
    setNarrativeModalBtn((prev) => !prev);

    var data = {
      status: "REJECT",
      narrative: "",
      isWithinLimit: true,
      email: loan.email,
      firstname: name[0],
      lastname: name[1],
      productName: loan.loanApp.loanProduct.name,
      loanAppId: loan.loan_app_id,
    };

    setApproveData(data);
  };

  const checkAcceptModal = () => {
    setAcceptLoanModalBtn((prev) => !prev);

    var data = {
      loanAppId: loan.loan_app_id,
    };

    setApproveData(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "document_number" ? value.trim() : value,
    }));
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
              <ArrowRightShort />
            </button>
            Loan Application Details
          </h1>
          <nav>
            {/* eslint-disable jsx-a11y/anchor-is-valid */}
            <a
              className={showSection === "all" ? "active" : ""}
              onClick={(e) => setShowSection("all")}
            >
              Overview
            </a>
            <a
              className={
                showSection === "loan-appraisal-scoring" ? "active" : ""
              }
              onClick={(e) => setShowSection("loan-appraisal-scoring")}
            >
              Loan appraisal scoring
            </a>
            <a
              className={showSection === "documents" ? "active" : ""}
              onClick={(e) => setShowSection("documents")}
            >
              Documents
            </a>
            {/* eslint-enable */}
          </nav>
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            Admin M.
            <i className="arrow down"></i>
          </div>
          <div className="some-container">
            <button
              disabled={
                adminWorkFlowLevel >= loan.loanApp.workFlowLevel ? false : true
              }
              className={`btn approve-loan-btn ${
                isLoading.approveApplication ? "loading disabled" : ""
              }`}
              onClick={
                loan.loanApp.workFlowLevel > 1
                  ? checkApprovalModal
                  : checkAcceptModal
              }
            >
              {isLoading.approveApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <CheckCircleFill />{" "}
                  {loan.loanApp.workFlowLevel > 1 ? "Approve" : "Accept"}
                </>
              )}
            </button>
            {handleApprovalModal()}
            {handleAcceptLoanModal()}
            {(showSection === "documents" ||
              showSection === "loan-appraisal-scoring") && (
              <button
                disabled={
                  adminWorkFlowLevel >= loan.loanApp.workFlowLevel
                    ? false
                    : true
                }
                className={`btn accept-loan-btn ${
                  isLoading.acceptApplication ? "loading disabled" : ""
                }`}
                onClick={() =>
                  showSection === "documents"
                    ? setScoreDoc(true)
                    : setScore(true)
                }
              >
                {isLoading.acceptApplication ? (
                  <SpinnerIcon className="rotating" />
                ) : (
                  <>
                    <CheckCircleFill /> Rescore
                  </>
                )}
              </button>
            )}
            <button
              disabled={
                adminWorkFlowLevel >= loan.loanApp.workFlowLevel ? false : true
              }
              className={`btn reject-loan-btn ${
                isLoading.rejectApplication ? "loading disabled" : ""
              }`}
              onClick={checkRejectModal}
            >
              {isLoading.rejectApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <TimesCircleFill /> Decline
                </>
              )}
            </button>
            {handleRejectModal()}
          </div>
        </div>
      </header>

      {isLoading.loadPage ? (
        <div className="searching-block">
          <div className="svg-holder">
            <SpinnerIcon className="rotating" />
          </div>
        </div>
      ) : (
        <main className="loan-inprocess-page">
          {isLoading.userFull && (
            <div className="searching-block">
              <div className="svg-holder">
                <SpinnerIcon className="rotating" />
              </div>
            </div>
          )}
          {!isLoading.userFull && showSection === "all" && (
            <div className="customer-details row animated fadeIn delay-05s">
              <div className="loan-details col">
                <div className="details-header">Loan Details</div>
                <div className="row">
                  <div className="col-12 mb-1">Requested by:</div>
                  <div className="col">{loan.name}</div>
                </div>
                <div className="row">
                  <div className="col-12 mb-1">Loan Type:</div>
                  <div className="col">
                    {loan.loanApp.loanProduct.loanProductCategory.name}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mb-1">Amount Requested:</div>
                  <div className="col">&#8358; {loan.loanApp.amount}</div>
                </div>
                <div className="row">
                  <div className="col-12 mb-1">Amount Offered:</div>
                  <div className="col">
                    &#8358; {loan.loanApp.approvedAmount}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mb-1">Tenor Requested:</div>
                  <div className="col">
                    {loan.loanApp.requested_loan_tenure} Months
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mb-1">Tenor Offered:</div>
                  <div className="col">
                    {loan.loanApp.approvedTenure} Months
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="text-center color-dark-text-blue mt-5">
                  <div className="svg-holder">
                    <span>
                      <FileEarmarkTextFill />
                    </span>
                  </div>
                  <p
                    className="font-weight-bold mb-5"
                    style={{ fontSize: "24px" }}
                  >
                    Customer acceptance letter
                  </p>
                  <p className="mb-5">
                    Click the button below to download signed customer loan
                    acceptance letter
                  </p>
                  <p>
                    <button className="btn btn-primary export-ifrs-btn">
                      Download{" "}
                      <span className="pl-2">
                        <ArrowRightCircle className="rotate-90" />
                      </span>
                    </button>
                  </p>
                </div>
              </div>
              <div className="col">
                <div className="text-center total-credit-score-div color-sec-green mt-5">
                  <div className="svg-holder">
                    <CircularProgressbar
                      value={displayScore}
                      text={`${displayScore}%`}
                      styles={buildStyles({
                        textColor: "#2DBE7E",
                        pathColor: "#2DBE7E",
                      })}
                    />
                  </div>
                  <p
                    className="font-weight-bold mb-5"
                    style={{ fontSize: "24px" }}
                  >
                    Total Credit Score
                  </p>
                  <p className="mb-5">
                    Click the button below to individual scoring details for
                    loan application
                  </p>
                  <p>
                    <button
                      className="btn export-ifrs-btn"
                      onClick={(e) => setShowSection("loan-appraisal-scoring")}
                    >
                      View Score{" "}
                      <span className="pl-2">
                        <ArrowRightCircle />
                      </span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
          {!isLoading.userFull && showSection === "loan-appraisal-scoring" && (
            <div className="appraisal-scoring-page row animated fadeIn delay-05s">
              {score === true ? (
                <UpdateScore />
              ) : (
                <>
                  <div className="col">
                    <div className="text-center total-credit-score-div color-sec-green mt-5">
                      <div className="svg-holder">
                        <CircularProgressbar
                          value={displayScore}
                          text={`${displayScore}%`}
                          styles={buildStyles({
                            textColor: "#2DBE7E",
                            pathColor: "#2DBE7E",
                          })}
                        />
                      </div>
                      <p
                        className="font-weight-bold mb-5"
                        style={{ fontSize: "24px" }}
                      >
                        Total Credit Score
                      </p>
                      <p className="mb-5">
                        Click the button below to individual scoring details for
                        loan application
                      </p>
                      <p>
                        <button
                          className="btn export-ifrs-btn"
                          onClick={(e) =>
                            setShowSection("loan-appraisal-scoring")
                          }
                        >
                          View Score{" "}
                          <span className="pl-2">
                            <ArrowRightCircle />
                          </span>
                        </button>
                      </p>
                    </div>
                    <div className="loan-details col">
                      <div className="mb-5">
                        <div className="details-header">Score Breakdown</div>
                        {displayAppLoanScore()}
                      </div>
                    </div>
                  </div>
                  <div className="loan-details col">
                    <div className="mb-5">
                      <div className="details-header">
                        {" "}
                        Contd. Score Breakdown
                      </div>
                      {displayBehLoanScore()}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {!isLoading.userFull && showSection === "documents" && (
            <div className="customer-documents-page animated fadeIn delay-05s">
              {scoreDoc === true ? (
                <UpdateDoc />
              ) : (
                <>
                  <div className="row" style={{ gap: "140px" }}>
                    <div className="col-3 document-card">
                      <img src={customer.document_location} alt="" />
                      <div className="document-info">
                        <span>
                          <FileEarmarkImage />
                        </span>
                        <b>Guarantor one - Ebube</b>
                        <div className="scored-div">
                          <CheckCircleFill /> Score: YES (5%)
                        </div>
                      </div>
                    </div>
                    <div className="col-3 document-card">
                      <img src={customer.document_location} alt="" />
                      <div className="document-info">
                        <span>
                          <FileEarmarkImage />
                        </span>
                        <b>Guarantor one - Ebube</b>
                        <div className="scored-div">
                          <CheckCircleFill /> Score: YES (5%)
                        </div>
                      </div>
                    </div>
                    <div className="col-3 document-card">
                      <img src={customer.document_location} alt="" />
                      <div className="document-info">
                        <span>
                          <FileEarmarkImage />
                        </span>
                        <b>Guarantor one - Ebube</b>
                        <div className="scored-div">
                          <CheckCircleFill /> Score: YES (5%)
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-5" style={{ gap: "140px" }}>
                    <div className="col-3 document-card">
                      <img src={customer.document_location} alt="" />
                      <div className="document-info">
                        <span>
                          <FileEarmarkImage />
                        </span>
                        <b>Guarantor one - Ebube</b>
                        <div className="scored-div">
                          <CheckCircleFill /> Score: YES (5%)
                        </div>
                      </div>
                    </div>
                    <div className="col-3 document-card">
                      <img src={customer.document_location} alt="" />
                      <div className="document-info">
                        <span>
                          <FileEarmarkImage />
                        </span>
                        <b>Guarantor one - Ebube</b>
                        <div className="scored-div">
                          <CheckCircleFill /> Score: YES (5%)
                        </div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="document-card for-guarantor">
                        <div className="document-info">
                          <b>Guarantor one - Ebube</b>
                          <div className="scored-div mt-2">
                            <CheckCircleFill /> Score: YES (5%)
                          </div>
                        </div>
                      </div>
                      <div className="document-card for-guarantor mt-3">
                        <div className="document-info">
                          <b>Guarantor one - Ebube</b>
                          <div className="scored-div mt-2">
                            <CheckCircleFill /> Score: YES (5%)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      )}
    </>
  );
};
export default InProcessCustomer;
