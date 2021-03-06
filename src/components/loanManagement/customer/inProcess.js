import React, { Fragment, useCallback, useState, useEffect } from "react";
import face from "../../../assets/img/placeholder-img.png";
import placeholderImg from "../../../assets/img/placeholder-img.png";
import { ReactComponent as ArrowRightCircle } from "../../../assets/icons/arrow-right-circle.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as ArrowRightShort } from "../../../assets/icons/arrow-right-short.svg";
import { ReactComponent as FileEarmarkImage } from "../../../assets/icons/file-earmark-image.svg";
import { ReactComponent as PenFill } from "../../../assets/icons/pen.svg";
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
import jwt_decode from "jwt-decode";
import { useAuth } from "../../utilities";
import errorHandler, { validateToken } from "../../../utils/errorHandler";
import notify from "../../../utils/notification";
import LoanRightOptions from "../loanRightOptions";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import UpdateScore from "./UpdateScore";
import UpdateDoc from "./UpdateDoc";
import { getCustomer } from "../../../services/customerService";
// import { useEffect } from "react/cjs/react.development";
import {
  adminGetLoanScore,
  getCustomerById,
  getFiles,
  getLoanScore,
  getRoles,
} from "../../../services/loanService";
import {
  AcceptLoanModal,
  ApprovalModal,
  NarrativeModal,
  CommentModal,
} from "./approvalModal";

import {
  getLoanRoles,
  getAdminName,
  getAccessToken,
  getRoles as getAdminRoles,
} from "../../../utils/localStorageService";
import numeral from "numeral";
import LoanComments from "../loanComment";

const InProcessCustomer = (props) => {
  const [score, setScore] = useState(false);
  const [scoreDoc, setScoreDoc] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const adminName = getAdminName();
  const roles = getAdminRoles();
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
        fileUpload: [],
        adminLoanScore: [],
        loanScore: [],
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
  const [maritalStatus, setMaritalStatus] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [lengthOfStayAtAddress, setLengthOfStayAtAddress] = useState("");
  const [engagingBusiness, setEngagingBusiness] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [criteriaFiles, setCriteriaFiles] = useState([]);
  const [commentModalBtn, setCommentModalBtn] = useState(false);
  const [commentData, setCommentData] = useState({});

  const searchParams = new URLSearchParams(search);
  const loanCustomerId = searchParams.get("id");
  const token = getAccessToken();

  useEffect(() => {
    validateToken(token, history, jwt_decode, auth, notify);
  }, [auth, history, token]);

  useEffect(() => {
    async function handleFetchSingleLoan(loanCustomerId) {
      try {
        handleChangeLoading("loadPage", true);
        setApproveModalBtn(false);
        setNarrativeModalBtn(false);
        setAcceptLoanModalBtn(false);

        const loanApp = await getCustomerById(loanCustomerId);

        if (loanApp?.error) return notify(loanApp?.data, "error");
        if (loanApp?.data === null) {
          notify("Loan Not Found", "error");
          history.push("/pages/loanMan");
          return;
        }
        const userId = loanApp?.data?.loanApp?.customer_id;
        const loanUser = await getCustomer(userId);
        if (loanUser?.error) return notify(loanUser?.message, "error");
        if (loanUser?.result === null) {
          notify("Customer Not Found", "error");
          history.push("/pages/loanMan");
          return;
        }

        const loanAppId = loanApp?.data?.loanApp?.id;

        const loanScore = await getLoanScore(loanAppId);
        if (loanScore?.error) return notify(loanScore?.message, "error");
        if (loanScore.data === null) {
          notify("LoanScore Not Found", "error");
          return;
        }

        const adminLoanScore = await adminGetLoanScore(loanAppId);

        console.log(adminLoanScore);

        const customerFiles = await getFiles(loanAppId);
        if (customerFiles?.error)
          return notify(customerFiles?.message, "error");
        if (customerFiles?.data === null) {
          notify("Files Not Found", "error");
          return;
        }

        setLoan((prev) => ({
          ...prev,
          ...loanApp.data,
          loanScore: loanScore?.data,
          adminLoanScore: adminLoanScore?.data,
          fileUpload: customerFiles?.data,
        }));

        setCustomer((prev) => ({
          ...prev,
          ...loanUser?.result,
        }));

        const roles = await getRoles();

        const loanRoles = getLoanRoles();

        const testRole = [];

        testRole.push(loanRoles);
        console.log(testRole);

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
  }, [handleError, history]);

  useEffect(() => {
    const loadBaseInfos = () => {
      loan.loanApp.baseInfoValues &&
        loan.loanApp.baseInfoValues.forEach((info) => {
          console.log(info.value);
          if (info.baseInfo.name.includes("maritalStatus")) {
            setMaritalStatus(info.value);
          }

          if (info.baseInfo.name.includes("residentialAddress")) {
            setResidentialAddress(info.value);
          }

          if (info.baseInfo.name.includes("lengthOfStayAtAddress")) {
            setLengthOfStayAtAddress(info.value);
          }

          if (info.baseInfo.name.includes("engagingBusiness")) {
            setEngagingBusiness(info.value);
          }

          if (info.baseInfo.name.includes("yearsInBusiness")) {
            setYearsInBusiness(info.value);
          }

          if (info.baseInfo.name.includes("businessAddress")) {
            setBusinessAddress(info.value);
          }
        });
    };
    loadBaseInfos();
  }, [loan.loanApp.baseInfoValues]);

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

  const totalScore =
    loan.loanApp.loanTotalScore &&
    Array.from(
      new Set(
        loan.loanApp.loanTotalScore.map((item) =>
          item.score_type === "OverAll" ? item.totalScore : 0
        )
      )
    );

  const displayScore = totalScore && totalScore.length > 0 ? totalScore[1] : 0;

  const systemScore =
    loan.loanApp.loanTotalScore &&
    Array.from(
      new Set(
        loan.loanApp.loanTotalScore.map((item) =>
          item.score_type === "System" ? item.totalScore : 0
        )
      )
    );

  const displaySystemScore =
    systemScore && systemScore.length > 0 ? systemScore[0] : 0;

  const adminScore =
    loan.loanApp.loanTotalScore &&
    Array.from(
      new Set(
        loan.loanApp.loanTotalScore.map((item) =>
          item.score_type === "Admin" ? item.totalScore : 0
        )
      )
    );

  const displayAdminScore =
    adminScore && adminScore.length > 0 ? adminScore[1] : 0;

  const displayAppLoanScore = () => {
    return loan.loanScore.map((scx) => {
      const { id, requirement, value, score } = scx;
      return (
        <>
          <div className="row" key={id}>
            <div className="col-6 mb-1">{requirement}:</div>
            <div key={scx.id} className="col">
              {value} &nbsp;&nbsp;
              <span className="color-sec-green">
                Score: {score === null ? "N/A" : `${score}%`}
              </span>
            </div>
          </div>
        </>
      );
    });
  };

  const displayAdminLoanScore = () => {
    return loan.adminLoanScore.map((scx) => {
      const { id, requirement, value, score } = scx;
      return (
        <>
          <div className="row" key={id}>
            <div className="col-6 mb-1">{requirement}:</div>
            <div key={scx.id} className="col">
              {value} &nbsp;&nbsp;
              <span className="color-sec-green">
                Score: {score === null ? "N/A" : `${score}%`}
              </span>
            </div>
          </div>
        </>
      );
    });
  };

  console.log(loan);

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
                  <span className="color-sec-green">Score: No Score</span>
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

  const loadFiles = () => {
    if (loan.loanApp.baseInfoValues && loan.loanApp.baseInfoValues.length > 0) {
    }
    const allCriteriaFiles = [];

    loan.fileUpload &&
      loan.fileUpload.forEach((file) => {
        allCriteriaFiles.push(file.fileName);

        const newFiles = [...new Set(allCriteriaFiles)];
        setCriteriaFiles(newFiles);
        console.log(criteriaFiles);
      });
  };

  const handleCriteriaFiles = () => {
    console.log(criteriaFiles);

    return (
      loan.fileUpload &&
      criteriaFiles.length > 0 &&
      criteriaFiles.map((file, idx) => (
        <div key={idx} className="col-3 document-card">
          <a href={file} target="_blank" rel="noreferrer">
            <img src={file} alt="" />
          </a>
          <div className="document-info">
            <span>
              <FileEarmarkImage />
            </span>
            <b>
              {file.includes("guarantor")
                ? `Guarantor's Form ${idx + 1}`
                : `Criteria File ${idx - 1}`}
            </b>
            <div className="scored-div">
              <CheckCircleFill /> Scored: YES
            </div>
          </div>
        </div>
      ))
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

  const handleCommentModel = () => {
    return (
      <CommentModal
        commentModalBtn={commentModalBtn}
        setCommentModalBtn={setCommentModalBtn}
        commentData={commentData}
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
      work_flow_level: adminWorkFlowLevel - 1,
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

  const checkCommentModal = () => {
    setCommentModalBtn((prev) => !prev);

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

    setCommentData(data);
  };

  console.log(adminWorkFlowLevel, loan.loanApp.workFlowLevel);

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
            {
              <a
                className={
                  showSection === "loan-appraisal-scoring" ? "active" : ""
                }
                onClick={(e) => {
                  setShowSection("loan-appraisal-scoring");
                  loadFiles();
                }}
              >
                Loan appraisal scoring
              </a>
            }
            <a
              className={showSection === "documents" ? "active" : ""}
              onClick={(e) => {
                setShowSection("documents");
                loadFiles();
              }}
            >
              Documents
            </a>
            {/* eslint-enable */}
          </nav>
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            {adminName || `NPF Admin`}
            <i className="arrow down"></i>
          </div>
          <div className="some-container">
            <button
              className={`btn approve-loan-btn ${
                isLoading.approveApplication ? "loading disabled" : ""
              }`}
              onClick={checkCommentModal}
            >
              {isLoading.approveApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <PenFill /> Add Comment
                </>
              )}
            </button>
            {handleCommentModel()}
            {roles !== "AUDIT" && (
              <button
                disabled={
                  adminWorkFlowLevel >= loan.loanApp.workFlowLevel
                    ? false
                    : true
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
            )}
            {handleApprovalModal()}
            {handleAcceptLoanModal()}
            {roles !== "AUDIT" &&
              showSection === "loan-appraisal-scoring" &&
              !displayAdminScore && (
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
                      ? setScoreDoc(false)
                      : setScore(true)
                  }
                >
                  {isLoading.acceptApplication ? (
                    <SpinnerIcon className="rotating" />
                  ) : (
                    <>
                      <CheckCircleFill /> Admin Score
                    </>
                  )}
                </button>
              )}
            {roles !== "AUDIT" && (
              <button
                disabled={
                  adminWorkFlowLevel >= loan.loanApp.workFlowLevel
                    ? false
                    : true
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
            )}
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
                  <div className="col">{loan.loanApp.criteria_purpose}</div>
                </div>
                <div className="row">
                  <div className="col-12 mb-1">Amount Requested:</div>
                  <div className="col">
                    &#8358; {numeral(loan.loanApp.amount).format("0,0")}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mb-1">Amount Offered:</div>
                  <div className="col">
                    &#8358; {numeral(loan.loanApp.approvedAmount).format("0,0")}
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
              <div className="personal-details col">
                <div className="details-header">Personal Details</div>
                <div className="row">
                  <div className="col-5">Customer Name:</div>
                  <div className="col">{loan.name}</div>
                </div>
                <div className="row">
                  <div className="col-5">Customer Email:</div>
                  <div className="col">{loan.email}</div>
                </div>
                <div className="row">
                  <div className="col-5">Customer phone:</div>
                  <div className="col">{loan.phone}</div>
                </div>
                <div className="row">
                  <div className="col-5">Date of birth:</div>
                  <div className="col">
                    {moment(customer.dob).format("DD/MM/YYYY")}
                  </div>
                </div>
                <div className="row">
                  <div className="col-5">Marital Status:</div>
                  <div className="col">{maritalStatus || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-5">Residential Address:</div>
                  <div className="col">{residentialAddress || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-5">Length of Stay in Address:</div>
                  <div className="col">{lengthOfStayAtAddress || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-5">Business Engaged in:</div>
                  <div className="col">{engagingBusiness || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-5">Years in Business:</div>
                  <div className="col">{yearsInBusiness || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-5">Business Address:</div>
                  <div className="col">{businessAddress || "N/A"}</div>
                </div>
              </div>
              <div className="col">
                <div className="text-center total-credit-score-div color-sec-green mt-5">
                  <div className="svg-holder">
                    <CircularProgressbar
                      value={displayScore || 0}
                      text={`${displayScore || 0}%`}
                      styles={buildStyles({
                        textColor:
                          displayScore < 50 || undefined ? "red" : "#2DBE7E",
                        pathColor:
                          displayScore < 50 || undefined ? "red" : "#2DBE7E",
                      })}
                    />
                  </div>
                  <p
                    className="font-weight-bold mb-5"
                    style={{ fontSize: "24px" }}
                  >
                    Total Credit Score
                  </p>
                  <p
                    className="font-weight-bold mb-5"
                    style={{
                      fontSize: "20px",
                      color:
                        displaySystemScore < 50 || undefined
                          ? "red"
                          : "#2DBE7E",
                    }}
                  >
                    {`System Score: ${displaySystemScore || 0}`}
                  </p>
                  <p
                    className="font-weight-bold mb-5"
                    style={{
                      fontSize: "20px",
                      color:
                        Number(displayAdminScore) < 50 || undefined
                          ? "red"
                          : "#2DBE7E",
                    }}
                  >
                    {`Admin Score: ${displayAdminScore || 0}`}
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
                <UpdateScore
                  adminWorkFlowLevel={adminWorkFlowLevel}
                  loan={loan}
                />
              ) : (
                <>
                  <div className="col">
                    <div className="text-center total-credit-score-div color-sec-green mt-5">
                      <div className="svg-holder">
                        <CircularProgressbar
                          value={displayScore || 0}
                          text={`${displayScore || 0}%`}
                          styles={buildStyles({
                            textColor:
                              displayScore < 50 || undefined
                                ? "red"
                                : "#2DBE7E",
                            pathColor:
                              displayScore < 50 || undefined
                                ? "red"
                                : "#2DBE7E",
                          })}
                        />
                      </div>
                      <p
                        className="font-weight-bold mb-5"
                        style={{ fontSize: "24px" }}
                      >
                        Total Credit Score
                      </p>
                      <p
                        className="font-weight-bold mb-5"
                        style={{
                          fontSize: "20px",
                          color:
                            displaySystemScore < 50 || undefined
                              ? "red"
                              : "#2DBE7E",
                        }}
                      >
                        {`System Score: ${displaySystemScore || 0}`}
                      </p>
                      <p
                        className="font-weight-bold mb-5"
                        style={{
                          fontSize: "20px",
                          color:
                            Number(displayAdminScore) < 50 || undefined
                              ? "red"
                              : "#2DBE7E",
                        }}
                      >
                        {`Admin Score: ${displayAdminScore || 0}`}
                      </p>
                      {/* <p className="mb-5">
                        Click the button below to individual scoring details for
                        loan application
                      </p> */}
                      <p>
                        {/* <button
                          className="btn export-ifrs-btn"
                          onClick={(e) =>
                            setShowSection("loan-appraisal-scoring")
                          }
                        >
                          View Score{" "}
                          <span className="pl-2">
                            <ArrowRightCircle />
                          </span>
                        </button> */}
                      </p>
                    </div>
                    <div className="loan-details col">
                      <div className="mb-5">
                        <div className="details-header">
                          Loan Requirement Score Breakdown
                        </div>
                        {displayAppLoanScore()}
                      </div>
                    </div>
                  </div>
                  <div className="loan-details col">
                    <div className="mb-5">
                      <div className="details-header"> Admin Score</div>
                      {loan.adminLoanScore.length > 0
                        ? displayAdminLoanScore()
                        : displayBehLoanScore()}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {!isLoading.userFull && showSection === "documents" && (
            <div className="customer-documents-page animated fadeIn delay-05s">
              {scoreDoc === true ? (
                <UpdateDoc loan={loan} />
              ) : (
                <>
                  <div className="row" style={{ gap: "140px" }}>
                    {handleCriteriaFiles()}
                  </div>
                </>
              )}
            </div>
          )}
          <>
            <LoanComments loanAppId={loan.loan_app_id} />
          </>
        </main>
      )}
    </>
  );
};

const ExportInProcessCustomer = () => {
  return <InProcessCustomer />;
};

export default ExportInProcessCustomer;
