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
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../utilities";
import errorHandler from "../../../utils/errorHandler";
import notify from "../../../utils/notification";
import LoanRightOptions from "../loanRightOptions";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const InProcessCustomer = (props) => {
  const history = useHistory();
  const location = useLocation();
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

  const [showSection, setSection] = useState("all");
  // const [showAuditHistory, setShowAuditHistory] = useState("all");
  const [isLoading, setLoading] = useState({
    userFull: false,
    acceptApplication: false,
    rejectApplication: false,
    approveApplication: false,
    printApplication: false,
  });

  const [isScoringActive, setScoringActive] = useState(false);

  const [values, setValues] = useState({});

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

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
              onClick={(e) => setSection("all")}
            >
              Overview
            </a>
            <a
              className={
                showSection === "loan-appraisal-scoring" ? "active" : ""
              }
              onClick={(e) => setSection("loan-appraisal-scoring")}
            >
              Loan appraisal scoring
            </a>
            <a
              className={showSection === "documents" ? "active" : ""}
              onClick={(e) => setSection("documents")}
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
              className={`btn approve-loan-btn ${
                isLoading.approveApplication ? "loading disabled" : ""
              }`}
            >
              {isLoading.approveApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <CheckCircleFill /> Approve
                </>
              )}
            </button>
            {(showSection === "documents" ||
              showSection === "loan-appraisal-scoring") && (
              <button
                className={`btn accept-loan-btn ${
                  isLoading.acceptApplication ? "loading disabled" : ""
                }`}
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
              className={`btn reject-loan-btn ${
                isLoading.rejectApplication ? "loading disabled" : ""
              }`}
            >
              {isLoading.rejectApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <TimesCircleFill /> Decline
                </>
              )}
            </button>
          </div>
        </div>
      </header>
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
                <div className="col">Janet Maria Martomeu</div>
              </div>
              <div className="row">
                <div className="col-12 mb-1">Loan Type:</div>
                <div className="col">Salary Based Lending</div>
              </div>
              <div className="row">
                <div className="col-12 mb-1">Amount Requested:</div>
                <div className="col">&#8358; 500,000</div>
              </div>
              <div className="row">
                <div className="col-12 mb-1">Amount Offered:</div>
                <div className="col">&#8358; 500,000</div>
              </div>
              <div className="row">
                <div className="col-12 mb-1">Tenor Requested:</div>
                <div className="col">12 Months</div>
              </div>
              <div className="row">
                <div className="col-12 mb-1">Tenor Offered:</div>
                <div className="col">6 Months</div>
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
                    value={60}
                    text={`${60}%`}
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
                  Click the button below to individual scoring details for loan
                  application
                </p>
                <p>
                  <button
                    className="btn export-ifrs-btn"
                    onClick={(e) => setSection("loan-appraisal-scoring")}
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
            <div className="col">
              <div className="text-center total-credit-score-div color-sec-green mt-5">
                <div className="svg-holder">
                  <CircularProgressbar
                    value={60}
                    text={`${60}%`}
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
                  Click the button below to individual scoring details for loan
                  application
                </p>
                <p>
                  <button
                    className="btn export-ifrs-btn"
                    onClick={(e) => setSection("loan-appraisal-scoring")}
                  >
                    View Score{" "}
                    <span className="pl-2">
                      <ArrowRightCircle />
                    </span>
                  </button>
                </p>
              </div>
            </div>
            <div className="loan-details col">
              <div className="mb-5">
                <div className="details-header">Admin / Actor Details</div>
                <div className="row">
                  <div className="col mb-1">Scored by:</div>
                  <div className="col">Emeka Oladapo Waziri</div>
                </div>
                <div className="row">
                  <div className="col mb-1">Scored Date:</div>
                  <div className="col">12/02/2019</div>
                </div>
                <div className="row">
                  <div className="col mb-1">Time:</div>
                  <div className="col">12:23pm</div>
                </div>
              </div>
              <div className="mb-5">
                <div className="details-header">Score Breakdown</div>
                <div className="row">
                  <div className="col-6 mb-1">Customer Age:</div>
                  <div className="col">
                    48 &nbsp;&nbsp;
                    <span className="color-sec-green">Score: 3%</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-1">Customer BVN:</div>
                  <div className="col">
                    7489393020 &nbsp;&nbsp;
                    <span className="color-sec-green">Score: YES (5%)</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-1">
                    Loan repayment as a % of salary:
                  </div>
                  <div className="col">
                    50% &nbsp;&nbsp;
                    <span className="color-sec-green">Score: 10%</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-1">Existing loan exposure:</div>
                  <div className="col">
                    50% &nbsp;&nbsp;
                    <span className="color-sec-green">Score: 20%</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-1">Date of Enlistment:</div>
                  <div className="col">
                    12/12/2020 &nbsp;&nbsp;
                    <span className="color-sec-green">Score: 5%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="loan-details col">
              <div className="details-header">Score Breakdown Contd.</div>
              <div className="row">
                <div className="col-6 mb-1">Employer type:</div>
                <div className="col">
                  Federal &nbsp;&nbsp;
                  <span className="color-sec-green">Score: 3%</span>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-1">Default:</div>
                <div className="col">
                  13days &nbsp;&nbsp;
                  <span className="color-sec-green">Score: YES (1%)</span>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-1">
                  Significant change in interest rate because of changes in
                  credit risk since initial recongnition
                </div>
                <div className="col">
                  YES &nbsp;&nbsp;
                  <span className="color-sec-green">Score: YES (1%)</span>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-1">
                  Actual or expected increase in the risk of default on another
                  facility with the same obligor
                </div>
                <div className="col">
                  NO &nbsp;&nbsp;
                  <span className="color-sec-green">Score: NO (0%)</span>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-1">
                  An actual or expected significant change in the operating
                  results of a borrower
                </div>
                <div className="col">
                  NO &nbsp;&nbsp;
                  <span className="color-sec-green">Score: NO (0%)</span>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-1">
                  Actual or expected restructuring due to financial difficulties
                </div>
                <div className="col">
                  YES &nbsp;&nbsp;
                  <span className="color-sec-green">Score: YES (1%)</span>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-1">
                  Evidence that full repayment of interest and principal without
                  realization of collateral is unlikely, regardless of the
                  number of days past due
                </div>
                <div className="col">
                  YES &nbsp;&nbsp;
                  <span className="color-sec-green">Score: YES (1%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {!isLoading.userFull && showSection === "documents" && (
          <div className="customer-documents-page animated fadeIn delay-05s">
            <div className="row" style={{gap: "140px"}}>
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
            <div className="row mt-5" style={{gap: "140px"}}>
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
          </div>
        )}
      </main>
    </>
  );
};
export default InProcessCustomer;
