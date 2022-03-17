import React, { Fragment, useCallback, useState, useEffect } from "react";
import { addMonths } from "date-fns";
import face from "../../../assets/img/face.jpg";
import placeholderImg from "../../../assets/img/placeholder-img.png";
import { ReactComponent as PenFill } from "../../../assets/icons/pen.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as ArrowRightShort } from "../../../assets/icons/arrow-right-short.svg";
import { ReactComponent as FileEarmarkImage } from "../../../assets/icons/file-earmark-image.svg";
import { ReactComponent as CloudDownloadIcon } from "../../../assets/icons/cloud-computing-download.svg";
import { ReactComponent as PrintIcon } from "../../../assets/icons/print-icon.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import moment from "moment";
import numeral from "numeral";
import { useAuth } from "../../utilities";
import errorHandler from "../../../utils/errorHandler";
import notify from "../../../utils/notification";
import LoanRightOptions from "../loanRightOptions";
import {
  disburseLoan,
  getCustomerById,
  getLoanScore,
  getFiles,
  getBranchById,
} from "../../../services/loanService";
import {
  ApprovalModal,
  BookAndAcceptLoanModal,
  CommentModal,
  DisburseModal,
  NarrativeModal,
} from "./approvalModal";
import { getCustomer } from "../../../services/customerService";
import LoanComments from "../loanComment";

const Customer = (props) => {
  const [score, setScore] = useState(false);
  const [scoreDoc, setScoreDoc] = useState(false);
  const history = useHistory();
  const { url, params } = useRouteMatch();
  const location = useLocation();
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
    document_location: "",
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
      },
    },
  });

  const [showSection, setSection] = useState("all");
  // const [showAuditHistory, setShowAuditHistory] = useState("all");
  const [isLoading, setLoading] = useState({
    userFull: false,
    acceptApplication: false,
    rejectApplication: false,
    approveApplication: false,
    printApplication: false,
    loadPage: false,
  });

  const [isScoringActive, setScoringActive] = useState(false);
  const [values, setValues] = useState({});
  const [approveModalBtn, setApproveModalBtn] = useState(false);
  const [approveData, setApproveData] = useState({});
  const [narrativeModalBtn, setNarrativeModalBtn] = useState(false);
  const [acceptModalBtn, setAcceptModalBtn] = useState(false);
  const [disburseModalBtn, setDisburseModalBtn] = useState(false);
  const [guarantorFiles, setGuarantorFiles] = useState([]);
  const [criteriaFiles, setCriteriaFiles] = useState([]);
  const [userBranch, setUserBranch] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [lengthOfStayAtAddress, setLengthOfStayAtAddress] = useState("");
  const [engagingBusiness, setEngagingBusiness] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [commentModalBtn, setCommentModalBtn] = useState(false);
  const [commentData, setCommentData] = useState({});

  const searchParams = new URLSearchParams(search);
  const loanCustomerId = searchParams.get("id");

  useEffect(() => {
    async function handleFetchSingleLoan(loanCustomerId) {
      try {
        handleChangeLoading("loadPage", true);
        setApproveModalBtn(false);
        setNarrativeModalBtn(false);
        setAcceptModalBtn(false);
        setDisburseModalBtn(false);

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

        const customerFiles = await getFiles(loanAppId);
        if (customerFiles.error) return notify(customerFiles.message, "error");
        if (customerFiles.data === null) {
          notify("Files Not Found", "error");
          return;
        }

        setLoan((prev) => ({
          ...prev,
          ...loanApp.data,
          loanScore: loanScore.data,
          fileUpload: customerFiles.data,
        }));

        setCustomer((prev) => ({
          ...prev,
          ...loanUser.result,
        }));

        const allCriteriaFiles = [];

        loan.fileUpload &&
          loan.fileUpload.map((file) => {
            if (!file.fileName.includes("guarantor")) {
              allCriteriaFiles.push(file.fileName);
              const newFiles = [...new Set(allCriteriaFiles)];
              setCriteriaFiles(newFiles);
              // console.log(file);
            }

            if (file.fileName.includes("guarantor")) {
              setGuarantorFiles([file]);
            }
          });

        loan.loanApp.baseInfoValues &&
          loan.loanApp.baseInfoValues.map((info) => {
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

        // if(criteriaFiles.length > 0){

        // }

        console.log(loan);

        if (loan.loanApp.approvalBranch_id > 0) {
          const id = loan.loanApp.approvalBranch_id;
          const branch = await getBranchById(id);
          setUserBranch(branch.data.name);
        }

        handleChangeLoading("loadPage", false);
      } catch (error) {
        handleError(error, notify, () =>
          handleChangeLoading("userFull", false)
        );
      }
    }
    handleFetchSingleLoan(loanCustomerId);
  }, [history, loanCustomerId, handleError, loan.loanApp.approvalBranch_id]);

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

  const handleApprovalModal = () => {
    return (
      <ApprovalModal
        approvemodalbtn={approveModalBtn}
        setApprovemodalbtn={setApproveModalBtn}
        approvedata={approveData}
        setapprovedata={setApproveData}
      />
    );
  };

  const handleRejectModal = () => {
    return (
      <NarrativeModal
        narrativemodalbtn={narrativeModalBtn}
        setNarrativemodalbtn={setNarrativeModalBtn}
        approvedata={approveData}
      />
    );
  };

  const handleDisburseModal = () => {
    return (
      <DisburseModal
        disbursemodalbtn={disburseModalBtn}
        setDisbursemodalbtn={setDisburseModalBtn}
        approvedata={approveData}
      />
    );
  };

  const handleCommentModel = () => {
    return (
      <CommentModal
        commentmodalbtn={commentModalBtn}
        setCommentmodalbtn={setCommentModalBtn}
        commentdata={commentData}
      />
    );
  };

  const name = loan.name.split(" ");

  const checkDisburseModal = async () => {
    setDisburseModalBtn((prev) => !prev);

    const guarantorId = guarantorFiles.map((file, idx) => {
      const ids = [];
      ids.push(file.id);
      return ids;
    });

    const today = new Date();

    const expiryDate = addMonths(
      today,
      Number(loan.loanApp.loanProduct.maxTerm)
    );

    var data = {
      email: loan.email,
      firstname: name[0],
      lastname: name[1],
      customerId: customer.customerNumber,
      productName: loan.loanApp.loanProduct.name,
      productId: loan.loanApp.loanProduct.id,
      loanAppId: loan.loan_app_id,
      approvedAmount: loan.loanApp.approvedAmount,
      approvedTenure: loan.loanApp.approvedTenure,
      interestRate: loan.loanApp.loanProduct.interestRate,
      guarantorId: `${guarantorId[0]}`,
      sn: loan.loan_app_id,
      accountNo: loan.loanApp.account_no,
      settlementAccount: loan.loanApp.account_no,
      customerName: `${name[0]} ${name[1]}`,
      productType: loan.loanApp.loanProduct.loanProductCategory.categoryType,
      customerType: "N/A",
      sector: "N/A",
      expiryDate: `${expiryDate}`,
      tenorInDays: loan.loanApp.approvedTenure * 30,
      legacyID: 0,
      authorizedLimit: loan.loanApp.loanProduct.limit,
      arrangementFee: 0,
      riskRating: "N/A",
      numberOfPaymentsOutstanding: 0,
      daysPastDue: 0,
      pastDueObligationInterest: 0,
      subStatus: "N/A",
      status: loan.loanApp.status,
      contratualIntRate: 0,
      annualEffectiveInterestRate: 0,
      restructure: "N/A",
      paymentFrequencyPrincipal: "N/A",
      paymentFreqInterest: "N/A",
      collateralStatus: "N/A",
      collateralType: "N/A",
      otherCollateral: "N/A",
      collateralvalue: "N/A",
      daysToRealization: 0,
    };
    setApproveData(data);
  };

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

  const checkCommentModal = () => {
    setCommentModalBtn((prev) => !prev);

    var data = {
      loanAppId: loan.loan_app_id,
    };

    setCommentData(data);
  };

  const viewFiles = (path) => {
    window.open(path, "_blank");
  };

  const handleCriteriaFiles = () => {
    return (
      criteriaFiles &&
      criteriaFiles.map((file, idx) => (
        <div
          onClick={() => viewFiles(file)}
          key={file}
          className="col-5 document-card"
        >
          <img src={file} alt="" />
          <div className="document-info">
            <span>
              <FileEarmarkImage />
            </span>
            <b>Document {`${idx + 1}`}</b>
            <div className="file-action-icons">
              <span
                data-toggle="tooltip"
                data-placement="bottom"
                title="Download signature"
              >
                <p
                  // download={`${customer.firstname}-signature`}
                  onClick={() => viewFiles(file)}
                >
                  <CloudDownloadIcon />
                </p>
              </span>
            </div>
          </div>
        </div>
      ))
    );
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
              onClick={(e) => setSection("all")}
            >
              Customer Details
            </a>
            <a
              className={showSection === "loan-details" ? "active" : ""}
              onClick={(e) => setSection("loan-details")}
            >
              Loan Details
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
            {loan.loanApp.status === "APPROVE" && (
              <button
                className={`btn accept-loan-btn ${
                  isLoading.acceptApplication ? "loading disabled" : ""
                }`}
                onClick={checkDisburseModal}
              >
                {isLoading.acceptApplication ? (
                  <SpinnerIcon className="rotating" />
                ) : (
                  <>
                    <CheckCircleFill /> Disburse
                  </>
                )}
              </button>
            )}
            {handleDisburseModal()}

            {loan.loanApp.status === "APPROVE" && (
              <button
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
            {loan.loanApp.status === "REJECT" && (
              <button
                className={`btn approve-loan-btn ${
                  isLoading.approveApplication ? "loading disabled" : ""
                }`}
                onClick={checkApprovalModal}
              >
                {isLoading.approveApplication ? (
                  <SpinnerIcon className="rotating" />
                ) : (
                  <>
                    <CheckCircleFill /> Approve
                  </>
                )}
              </button>
            )}
            {handleApprovalModal()}
            <button
              className={`btn print-loan-btn ${
                isLoading.printApplication ? "loading disabled" : ""
              }`}
            >
              {isLoading.printApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <PrintIcon /> Print
                </>
              )}
            </button>
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
        <main className="customers-page">
          {isLoading.userFull && (
            <div className="searching-block">
              <div className="svg-holder">
                <SpinnerIcon className="rotating" />
              </div>
            </div>
          )}
          {!isLoading.userFull && showSection === "all" && (
            <div className="customer-details row animated fadeIn delay-05s">
              <div className="left-side col-3">
                <div className="img-holder">
                  <img
                    src={customer.photo_location || placeholderImg}
                    alt={customer.firstname}
                  />
                </div>
              </div>
              <div className="right-side col row">
                <div className="personal-details col">
                  <div className="details-header">Personal Details</div>
                  <div className="row">
                    <div className="col-5">Customer Name:</div>
                    <div className="col">
                      {customer.firstname} {customer.lastname}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-5">Customer Email:</div>
                    <div className="col">{customer.email}</div>
                  </div>
                  <div className="row">
                    <div className="col-5">Customer phone:</div>
                    <div className="col">{customer.phone}</div>
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
                <div className="other-details col">
                  <div className="bank-details">
                    <div className="details-header">Bank Details</div>
                    <div className="row">
                      <div className="col-5">Bank Account No:</div>
                      <div className="col">
                        {loan.loanApp.account_no || "N/A"}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-5">BVN Number:</div>
                      <div className="col">{customer.bvnhash || "N/A"}</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Customer branch:</div>
                      <div className="col">{userBranch || "E-channels"}</div>
                    </div>
                  </div>
                  <div className="kin-details">
                    <div className="details-header">Next of Kin Details</div>
                    <div className="row">
                      <div className="col-5">Next of Kin:</div>
                      <div className="col">{customer.kin_name || "N/A"}</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Relationship:</div>
                      <div className="col">
                        {customer.kin_relationship || "N/A"}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-5">Phone Number:</div>
                      <div className="col">{customer.kin_phone || "N/A"}</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Business:</div>
                      <div className="col">
                        {customer.kin_business || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isLoading.userFull && showSection === "loan-details" && (
            <div className="customer-documents-page animated fadeIn delay-05s">
              <div className="row">
                <div className="loan-details-container col-9">
                  <div className="left-side col row">
                    <div className="other-details col">
                      <div className="loan-customer-details">
                        <div className="details-header">Customer</div>
                        <div className="row">
                          <div className="col-5">Customer Type</div>
                          <div className="col">Regular Customer</div>
                        </div>
                        <div className="row">
                          <div className="col-5">Customer ID:</div>
                          <div className="col">{customer.id}</div>
                        </div>
                        <div className="row">
                          <div className="col-5">Customer phone:</div>
                          <div className="col">{customer.phone || "N/A"}</div>
                        </div>
                        <div className="row">
                          <div className="col-5">Group ID Asset Class:</div>
                          <div className="col">{"N/A"}</div>
                        </div>
                        <div className="row">
                          <div className="col-5">Marital Status:</div>
                          <div className="col">{maritalStatus}</div>
                        </div>
                        <div className="row">
                          <div className="col-5">DTI Ratio:</div>
                          <div className="col">
                            <span
                              className={
                                loan.dti < 50 ? "dti negative" : "dti positive"
                              }
                            >
                              {loan.dti}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="repay-details">
                        <div className="details-header">Repayment Details</div>
                        <div className="row">
                          <div className="col-5">Interest Rate:</div>
                          <div className="col">
                            {loan.loanApp.loanProduct.interestRate}%
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-5">Tenor Requested:</div>
                          <div className="col">
                            {loan.loanApp.requested_loan_tenure} Months
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-5">Tenor Offered:</div>
                          <div className="col">
                            {loan.loanApp.approvedTenure} Months
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-5">Payment Frequency:</div>
                          <div className="col">Monthly</div>
                        </div>
                        <div className="row">
                          <div className="col-5">Repayment Start:</div>
                          <div className="col">
                            {moment(loan.loanApp.createdAt).format(
                              "DD/MM/YYYY"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="loan-main-details col">
                      <div className="details-header">Loan Details</div>
                      <div className="row">
                        <div className="col-5">Loan Product:</div>
                        <div className="col">
                          {loan.loanApp.loanProduct.name}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5">Classification:</div>
                        <div className="col">
                          {
                            loan.loanApp.loanProduct.loanProductCategory
                              .categoryType
                          }
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5">Date of Application:</div>
                        <div className="col">
                          {moment(loan.loanApp.createdAt).format("DD/MM/YYYY")}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5">Date of Approval:</div>
                        <div className="col">
                          {moment(loan.loanApp.updatedAt).format("DD/MM/YYYY")}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5">Currency:</div>
                        <div className="col">Nigerian Naira (NGN)</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Amount Requested:</div>
                        <div className="col">
                          &#8358;{" "}
                          {numeral(loan.loanApp.amount).format("0,0") || 0.0}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5">Amount Offered:</div>
                        <div className="col">
                          &#8358;{" "}
                          {numeral(loan.loanApp.approvedAmount).format("0,0") ||
                            0.0}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5">Purpose:</div>
                        <div className="col">{loan.loanApp.loan_purpose}</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Source of funds:</div>
                        <div className="col">
                          {loan.loanApp.loanApp_repayment || "N/A"}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5">Average Salary:</div>
                        <div className="col">
                          &#8358;{" "}
                          {numeral(loan.loanApp.monthlyIncome).format("0,0")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <LoanRightOptions
                  isScoringActive={isScoringActive}
                  setScoringActive={setScoringActive}
                  loan={loan}
                />
              </div>
            </div>
          )}
          {!isLoading.userFull && showSection === "documents" && (
            <div className="customer-documents-page animated fadeIn delay-05s">
              <div className="row">
                <div className="loan-documents-container col-9">
                  <div className="id-document-container">
                    <div className="details-header">Guarantor Details</div>
                    {loan.loanApp.guarantors.map((data, idx) => (
                      <>
                        <div className="scoring-opt-div">
                          {/* <button className={`btn approve-loan-btn first-btn`}>
                            <CheckCircleFill /> Yes
                          </button>
                          <button className={`btn reject-loan-btn`}>
                            <TimesCircleFill /> No
                          </button> */}
                        </div>
                        <div key={data.id} className="row">
                          {guarantorFiles.map((file, idx) => (
                            <div
                              onClick={() => viewFiles(file.fileName)}
                              key={file.id}
                              className="col-5 document-card"
                            >
                              <img src={file.fileName} alt="" />
                              <div className="document-info">
                                <span>
                                  <FileEarmarkImage />
                                </span>
                                <b>Guarantor {idx + 1}</b>
                                <div className="file-action-icons">
                                  <span
                                    data-toggle="tooltip"
                                    data-placement="bottom"
                                    title="Download ID"
                                  >
                                    <p
                                      onClick={() => viewFiles(file.fileName)}

                                      // download={`${customer.firstname}-ID`}
                                    >
                                      <CloudDownloadIcon />
                                    </p>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="col id-document-details">
                            <div className="row">
                              <div className="col-5">Guarantor Name:</div>
                              <div className="col">{data.name}</div>
                            </div>
                            {/* <div className="row">
                            <div className="col-5">Phone Number:</div>
                            <div className="col">08023881233</div>
                          </div> */}
                            <div className="row">
                              <div className="col-5">Guarantor ID:</div>
                              <div className="col">{data.id}</div>
                            </div>
                            <div className="row">
                              <div className="col-5">Account Number:</div>
                              <div className="col">{data.accountNumber}</div>
                            </div>
                            <div className="row">
                              <div className="col-5">Bank Name:</div>
                              <div className="col">
                                {data.bankName || "N/A"}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-5">Status:</div>
                              <div
                                className={`${
                                  data.status === "Verified"
                                    ? "verified"
                                    : "not-verified"
                                } col`}
                              >
                                {data.status || "Not Verified"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                  <div className="other-documents">
                    <div className="details-header">Other Documents</div>
                    <div className="row">{handleCriteriaFiles()}</div>
                  </div>
                </div>
                <LoanRightOptions
                  isScoringActive={isScoringActive}
                  setScoringActive={setScoringActive}
                  loan={loan}
                />
              </div>
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
export default Customer;
