import React, { Fragment, useCallback, useState } from "react";
import face from "../../../assets/img/face.jpg";
import placeholderImg from "../../../assets/img/placeholder-img.png";
import { ReactComponent as ArrowRightCircle } from "../../../assets/icons/arrow-right-circle.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as ArrowRightShort } from "../../../assets/icons/arrow-right-short.svg";
import { ReactComponent as FileEarmarkImage } from "../../../assets/icons/file-earmark-image.svg";
import { ReactComponent as CloudDownloadIcon } from "../../../assets/icons/cloud-computing-download.svg";
import { ReactComponent as PrintIcon } from "../../../assets/icons/print-icon.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../utilities";
import errorHandler from "../../../utils/errorHandler";
import notify from "../../../utils/notification";
import LoanRightOptions from "../loanRightOptions";

const Customer = (props) => {
  const history = useHistory();
  const { url, params } = useRouteMatch();
  const location = useLocation();
  const { state: locationState, pathname } = location;
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
              className={`btn accept-loan-btn ${
                isLoading.acceptApplication ? "loading disabled" : ""
              }`}
            >
              {isLoading.acceptApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <CheckCircleFill /> Accept
                </>
              )}
            </button>
            <button
              className={`btn reject-loan-btn ${
                isLoading.rejectApplication ? "loading disabled" : ""
              }`}
            >
              {isLoading.rejectApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <TimesCircleFill /> Reject
                </>
              )}
            </button>
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
                  <div className="col">{customer.marital_status || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-5">Residential Addr:</div>
                  <div className="col">{customer.address || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-5">Length of Stay in Address:</div>
                  <div className="col">{customer.length_of_stay || "N/A"}</div>
                </div>
                <div className="row">
                  <div className="col-5">State of Origin:</div>
                  <div className="col">{customer.state || "N/A"}</div>
                </div>
              </div>
              <div className="other-details col">
                <div className="bank-details">
                  <div className="details-header">Bank Details</div>
                  <div className="row">
                    <div className="col-5">Bank Account No:</div>
                    <div className="col">8080432476</div>
                  </div>
                  <div className="row">
                    <div className="col-5">BVN Number:</div>
                    <div className="col">{customer.bvnhash || "N/A"}</div>
                  </div>
                  <div className="row">
                    <div className="col-5">Customer branch:</div>
                    <div className="col">{customer.branch || "E-channels"}</div>
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
                    <div className="col">{customer.kin_business || "N/A"}</div>
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
                        <div className="col">2992029302</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Customer phone:</div>
                        <div className="col">09034606606</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Group ID Asset Class:</div>
                        <div className="col">Standard</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Marital Status:</div>
                        <div className="col">Single</div>
                      </div>
                      <div className="row">
                        <div className="col-5">DTI Ratio:</div>
                        <div className="col">
                          <span className="dti negative">34%</span>
                        </div>
                      </div>
                    </div>
                    <div className="repay-details">
                      <div className="details-header">Repayment Details</div>
                      <div className="row">
                        <div className="col-5">Interest Rate:</div>
                        <div className="col">23%</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Term Requested:</div>
                        <div className="col">5 Months</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Payment Frequency:</div>
                        <div className="col">090983928932</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Repayment Start:</div>
                        <div className="col">12/12/2020</div>
                      </div>
                    </div>
                  </div>

                  <div className="loan-main-details col">
                    <div className="details-header">Loan Details</div>
                    <div className="row">
                      <div className="col-5">Loan Product:</div>
                      <div className="col">Housing Loan</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Classification:</div>
                      <div className="col">Standard</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Date of Application:</div>
                      <div className="col">12/12/2020</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Input Date:</div>
                      <div className="col">12/12/2020</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Currency:</div>
                      <div className="col">Nigerian Naira (NGN)</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Amount Requested:</div>
                      <div className="col">&#8358; 500,000</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Purpose:</div>
                      <div className="col">Rent a house</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Source of funds:</div>
                      <div className="col">Bank Account</div>
                    </div>
                    <div className="row">
                      <div className="col-5">Average Salary:</div>
                      <div className="col">&#8358;500,000</div>
                    </div>
                  </div>
                </div>
              </div>
              <LoanRightOptions
                isScoringActive={isScoringActive}
                setScoringActive={setScoringActive}
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
                  <div className="scoring-opt-div">
                    <button
                      className={`btn approve-loan-btn`}
                    >
                      <CheckCircleFill /> Yes
                    </button>
                    <button
                      className={`btn reject-loan-btn`}
                    >
                      <TimesCircleFill /> No
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-5 document-card">
                      <img src={customer.document_location} alt="" />
                      <div className="document-info">
                        <span>
                          <FileEarmarkImage />
                        </span>
                        <b>Guarantor one - Ebube</b>
                        <div className="file-action-icons">
                          <span
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Download ID"
                          >
                            <a
                              href={customer.document_location}
                              download={`${customer.firstname}-ID`}
                            >
                              <CloudDownloadIcon />
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col id-document-details">
                      <div className="row">
                        <div className="col-5">Guarantor Name:</div>
                        <div className="col">Emeka Chibuike</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Phone Number:</div>
                        <div className="col">08023881233</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Guarantor ID:</div>
                        <div className="col">9430200</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Account:</div>
                        <div className="col">02094839020</div>
                      </div>
                      <div className="row">
                        <div className="col-5">Amount:</div>
                        <div className="col">N900,000</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="other-documents">
                  <div className="details-header">Other Documents</div>
                  <div className="row">
                    <div className="col-5 document-card">
                      <img src={customer.signature_location} alt="" />
                      <div className="document-info">
                        <span>
                          <FileEarmarkImage />
                        </span>
                        <b>Signature</b>
                        <div className="file-action-icons">
                          <span
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Download signature"
                          >
                            <a
                              href={customer.signature_location}
                              download={`${customer.firstname}-signature`}
                            >
                              <CloudDownloadIcon />
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-5 document-card">
                      <img src={customer.signature_location} alt="" />
                      <div className="document-info">
                        <span>
                          <FileEarmarkImage />
                        </span>
                        <b>Signature</b>
                        <div className="file-action-icons">
                          <span
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Download signature"
                          >
                            <a
                              href={customer.signature_location}
                              download={`${customer.firstname}-signature`}
                            >
                              <CloudDownloadIcon />
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <LoanRightOptions
                isScoringActive={isScoringActive}
                setScoringActive={setScoringActive}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};
export default Customer;
