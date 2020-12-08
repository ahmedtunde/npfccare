import React, { Fragment, useEffect, useState } from 'react';
import face from '../assets/img/face.jpg';
import placeholderImg from '../assets/img/placeholder-img.png';
import { ReactComponent as ArrowRightCircle} from '../assets/icons/arrow-right-circle.svg';
import { ReactComponent as CheckCircleFill} from '../assets/icons/check-circle-fill.svg';
import { ReactComponent as TimesCircleFill} from '../assets/icons/times-circle-fill.svg';
import { ReactComponent as ArrowRightShort} from '../assets/icons/arrow-right-short.svg';
import { ReactComponent as AdobeAcrobatFile} from '../assets/icons/adobe-acrobat-file.svg';
import { ReactComponent as CloudDownloadIcon} from '../assets/icons/cloud-computing.svg';
import { ReactComponent as SpinnerIcon} from '../assets/icons/spinner.svg';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import moment from 'moment';
import Modal from './modal';
import CustomerAuditHistory from './customerAuditHistory';
import { resetCustomerPassword } from '../services/authService';
import {
  confirmCustomerLiveliness,
  disableCustomer,
  enableCustomer,
  enforcePND,
  removePND,
  confirmCustomerDocuments,
  rejectCustomerDocuments,
  rejectCustomerLiveliness,
  getCustomer,
  getCustomerBankAcc
} from '../services/customerService';
import { useAuth } from './utilities';
import handleError from '../utils/handleError';
import notify from '../utils/notification';

const Customer = props => {
  const history = useHistory();
  const { url, params } = useRouteMatch();
  const location = useLocation();
  const { state: locationState, pathname} = location;
  const auth = useAuth();
  
  const [customer, setCustomer] = useState({
    PND: false,
    account_status: null,
    address: "N/A",
    bucket: "npf-mfb",
    bvnhash: "22298911143",
    companyCode: null,
    createdAt: "2020-11-21T18:34:03.210Z",
    customerNumber: "100218465",
    dob: "1988-07-21T00:00:00.000Z",
    document_key: "19/signature/IdentityDoc.png",
    document_location: "https://npf-mfb.s3.amazonaws.com/19/signature/IdentityDoc.png",
    document_number: "2EFR45",
    document_type_id: 1,
    email: "frankorji161@gmail.com",
    enabled: true,
    firstname: "Frank",
    force_number: "FT4566",
    has_pin: false,
    id: 19,
    ippis_number: "FBG6666",
    "documentschecked": null,
    "isnewbankcustomer": null,
    "document_issue_date": "",
    "document_expiry_date" : "",
    isotpverified: true,
    lastname: "Orji",
    livelinesschecked: true,
    middlename: "N/A",
    otpstatus: null,
    phone: "2348067465112",
    photo_key: "19/photo/livelinesscheck.png",
    photo_location: "https://npf-mfb.s3.amazonaws.com/19/photo/livelinesscheck.png",
    photo_number: null,
    pob: null,
    registration_channel: "bvn",
    salary_officer: true,
    signature_key: "19/signature/signature.png",
    signature_location: "https://npf-mfb.s3.amazonaws.com/19/signature/signature.png",
    simswapstatus: null,
    updatedAt: "2020-11-21T18:56:14.825Z",
    user: 21,
    video_key: "19/video/livevideo.mp4",
    video_location: "https://npf-mfb.s3.amazonaws.com/19/video/livevideo.mp4",
    accounts: []
  });

  const [showCustomers, setShowCustomers] = useState("all");
  // const [showAuditHistory, setShowAuditHistory] = useState("all");
  const [isLoading, setLoading] = useState({
    resetPassword: false,
    confirmCustomer: false,
    restrictCustomer: false,
    enforcePND: false,
    removePND: false,
    confirmDocuments: false,
    rejectDocuments: false,
    confirmLiveliness: false,
    rejectLiveliness: false,
    userFull: false
  });

  useEffect(() => {
    async function handleFetchCustomerBankAcc(customer_id) {
      handleChangeLoading("userFull", true);
      try {
        const result = await getCustomerBankAcc(customer_id);
        handleChangeLoading("userFull", false);
        if (result.error) {
          notify(result.message, "error");
          if(result.message.toLowerCase().includes("not found"))history.push("/pages/customers");
          return;
        };
        const accounts = result.result.map(v => v.accountnumber);
        setCustomer(prev => ({
          ...prev,
          accounts
        }));
      } catch (error) {
        handleError(error, notify, () => handleChangeLoading("userFull", false), auth);
      }
    }

    async function handleFetchSingleUser(userId, cb = _ => {}) {
      handleChangeLoading("userFull", true);
      try {
        const result = await getCustomer(userId);
        handleChangeLoading("userFull", false);
        if (result.error) return notify(result.message, "error");
        if (result.result === null) {
          notify("Customer Not Found", "error");
          history.push("/pages/customers");
          return;
        };
        setCustomer(prev => ({
          ...prev,
          ...result.result
        }));
        cb(params.userId);
      } catch (error) {
        handleError(error, notify, () => handleChangeLoading("userFull", false), auth);
      }
    }

    if(locationState?.requestedCustomer?.id.toString() === params.userId){
      setCustomer(prev => ({
        ...prev,
        ...locationState.requestedCustomer
      }));
      handleFetchCustomerBankAcc(params.userId);
    } else {
      handleFetchSingleUser(params.userId, handleFetchCustomerBankAcc);
    }
  }, [locationState, params.userId, history]);

  const handleChangeLoading = (name, value) => setLoading(prev => ({
    ...prev,
    [name]: value
  }));

  const handleResetPassword = async e => {
    handleChangeLoading("resetPassword", true);
    // setTimeout(_ => setResetPasswordLoading(false), 2500);
    try {
      const result = await resetCustomerPassword(customer.phone);
      handleChangeLoading("resetPassword", false);
      if(result.error) return notify(result.message, "error");
      document.$("#resetPasswordModal").modal("show")
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("resetPassword", false), auth);
    }
  };

  const handleEnableCustomer = async (e) => {
    handleChangeLoading("confirmCustomer", true);
    try {
      const result = await enableCustomer(customer.id);
      handleChangeLoading("confirmCustomer", false);
      if(result.error) return notify(result.message, "error");
      console.log(result);
      setCustomer(prev => ({
        ...prev,
        enabled: true
      }));
      document.$("#confirmModal").modal("show").on("hidden.bs.modal", _ => {
        history.push('/pages/customers');
      });
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("confirmCustomer", false), auth);
    }
  };

  const handleDisableCustomer = async (e) => {
    handleChangeLoading("restrictCustomer", true);
    try {
      const result = await disableCustomer(customer.id);
      handleChangeLoading("restrictCustomer", false);
      if(result.error) return notify(result.message, "error");
      console.log(result);
      setCustomer(prev => ({
        ...prev,
        enabled: false
      }));
      document.$("#rejectModal").modal("show").on("hidden.bs.modal", _ => {
        history.push('/pages/customers');
      });
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("restrictCustomer", false), auth);
    }
  };

  const handleEnforcePND = async (e) => {
    handleChangeLoading("enforcePND", true);
    try {
      const result = await enforcePND(customer.id);
      handleChangeLoading("enforcePND", false);
      if(result.error) return notify(result.message, "error");
      console.log(result);
      setCustomer(prev => ({
        ...prev,
        PND: true
      }));
      notify(result.message, "success");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("enforcePND", false), auth);
    }
  };

  const handleRemovePND = async (e) => {
    handleChangeLoading("removePND", true);
    try {
      const result = await removePND(customer.id);
      handleChangeLoading("removePND", false);
      if(result.error) return notify(result.message, "error");
      console.log(result);
      setCustomer(prev => ({
        ...prev,
        PND: false
      }));
      notify(result.message, "success");
      // document.$("#rejectModal").modal("show").on("hidden.bs.modal", _ => {
      //   history.go(pathname.includes("auditHistory") ? -2 : -1);
      // });
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("removePND", false), auth);
    }
  };

  const handleConfirmDocuments = async (e) => {
    handleChangeLoading("confirmDocuments", true);
    try {
      const result = await confirmCustomerDocuments(customer.id);
      handleChangeLoading("confirmDocuments", false);
      if(result.error) return notify(result.message, "error");
      console.log(result);
      setCustomer(prev => ({
        ...prev,
        documentschecked: true
      }));
      notify(result.message, "success");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("confirmDocuments", false), auth);
    }
  };

  const handleRejectDocuments = async (e) => {
    handleChangeLoading("rejectDocuments", true);
    try {
      const result = await rejectCustomerDocuments(customer.id);
      handleChangeLoading("rejectDocuments", false);
      if(result.error) return notify(result.message, "error");
      console.log(result);
      setCustomer(prev => ({
        ...prev,
        documentschecked: false
      }));
      notify(result.message, "success");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("rejectDocuments", false), auth);
    }
  };

  const handleConfirmLiveliness = async (e) => {
    handleChangeLoading("confirmLiveliness", true);
    try {
      const result = await confirmCustomerLiveliness(customer.id);
      handleChangeLoading("confirmLiveliness", false);
      if(result.error) return notify(result.message, "error");
      console.log(result);
      setCustomer(prev => ({
        ...prev,
        livelinesschecked: "APPROVED"
      }));
      notify(result.message, "success");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("confirmLiveliness", false), auth);
    }
  };

  const handleRejectLiveliness = async (e) => {
    handleChangeLoading("rejectLiveliness", true);
    try {
      const result = await rejectCustomerLiveliness(customer.id);
      handleChangeLoading("rejectLiveliness", false);
      if(result.error) return notify(result.message, "error");
      console.log(result);
      setCustomer(prev => ({
        ...prev,
        livelinesschecked: "DISAPPROVED"
      }));
      notify(result.message, "success");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("rejectLiveliness", false), auth);
    }
  };

  const showDocumentType = id => {
    switch (id) {
      case 1:
        return "Driver's License"
      case 2:
        return "International Passport"
      case 3:
        return "National ID"
      default:
        return "Unknown Type"
    }
  };
  
  return(
    <>
      <header>
        <div>
          <h1>
            <button onClick={e => history.goBack()} className="btn btn-primary back-btn">
              <ArrowRightShort />
            </button>Customer {pathname.includes("auditHistory") ? "Audit History" : "Profile"}
          </h1>

          {!pathname.includes("auditHistory") ? (
            <nav>
              {/* eslint-disable-next-line */}
              <a className={showCustomers === "all" ? "active" : ""} onClick={e => setShowCustomers("all")}>Customer Details</a>
              {/* eslint-disable-next-line */}
              <a className={showCustomers === "documents" ? "active" : ""} onClick={e => setShowCustomers("documents")}>Customer Documents</a>
              {/* eslint-disable-next-line */}
              <a className={showCustomers === "liveliness" ? "active" : ""} onClick={e => setShowCustomers("liveliness")}>Facial Liveliness Check</a>
            </nav>) : null
            // <nav>
            //   {/* eslint-disable-next-line */}
            //   <a className={showAuditHistory === "all" ? "active" : ""} onClick={e => setShowAuditHistory("all")}>All</a>
            //   {/* eslint-disable-next-line */}
            //   <a className={showAuditHistory === "transactions" ? "active" : ""} onClick={e => setShowAuditHistory("transactions")}>Transactions</a>
            //   {/* eslint-disable-next-line */}
            //   <a className={showAuditHistory === "interactions" ? "active" : ""} onClick={e => setShowAuditHistory("interactions")}>Interactions</a>
            // </nav>
            }
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            Admin M.
        <i className="arrow down"></i>
          </div>
          <div className="some-container">
            <button
              onClick={handleEnableCustomer}
              disabled={customer.livelinesschecked !== "APPROVED" || !customer.documentschecked}
              className={`btn confirm-user-btn ${isLoading.confirmCustomer ? "loading disabled" : ""}`}>
              {isLoading.confirmCustomer ?
                <SpinnerIcon className="rotating" /> :
                <><CheckCircleFill /> Enable</>}
            </button>
            <button
              onClick={handleDisableCustomer}
              className={`btn restrict-user-btn ${isLoading.restrictCustomer ? "loading disabled" : ""}`}>
              {isLoading.restrictCustomer ?
                <SpinnerIcon className="rotating" /> :
                <><TimesCircleFill /> Restrict</>}
            </button>
          </div>
        </div>
      </header>
      <main className="customers-page">
        {isLoading.userFull && <div className="searching-block">
          <div className="svg-holder">
            <SpinnerIcon className="rotating" />
          </div>
        </div>}
        {!isLoading.userFull && !pathname.includes("auditHistory") && showCustomers === "all" && <div className="customer-details row animated fadeIn delay-05s">
          <div className="left-side col-3">
            <div className="img-holder">
              <img src={customer.photo_location|| placeholderImg} alt={customer.firstname} />
            </div>
            <button className="audit-history-btn btn" onClick={e => history.push(`${url}/auditHistory`, locationState)} type="button">
              Audit History
              <span><ArrowRightCircle /></span>
              <div className="overlay-div"></div>
            </button>
            <button
              onClick={handleResetPassword}
              className={`btn btn-outline-danger reset-password-btn d-block ${isLoading.resetPassword ?
                "loading disabled" : ""}`}
            >
              {isLoading.resetPassword ?
                <SpinnerIcon className="rotating" /> : 
                "Reset Password"}
            </button>
            <div className="pnd-div mt-5">
              <p className="color-dark-text-blue"><b>Post-No-Debit</b></p>
              <div className="btn-group" role="group" aria-label="Post No Debit">
                {(isLoading.enforcePND || isLoading.removePND) ?
                  <button type="button" className={`btn disabled loading ${isLoading.removePND && "reject"}`}>
                    <SpinnerIcon className="rotating" />
                  </button> :
                  <><button type="button" className="btn btn-primary" onClick={handleEnforcePND}>Enforce</button>
                <button type="button" className="btn btn-danger" onClick={handleRemovePND}>Remove</button></>}
              </div>
            </div>
          </div>
          <div className="right-side col row">
            <div className="personal-details col">
              <div className="details-header">Personal Details</div>
              <div className="row">
                <div className="col-5">Customer Name:</div>
                <div className="col">{customer.firstname} {customer.lastname}</div>
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
                <div className="col">{moment(customer.dob).format("DD/MM/YYYY")}</div>
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
                  {customer.accounts.map( (v, idx) => (<Fragment key={idx}>
                    <div className="col-5">Bank Account No{idx + 1}:</div>
                    <div className="col">{v || "N/A"}</div>
                  </Fragment>))}
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
                  <div className="col">{customer.kin_relationship || "N/A"}</div>
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
        </div>}
        {!isLoading.userFull && !pathname.includes("auditHistory") && showCustomers === "liveliness" && <div className="liveliness-check-page row animated fadeIn delay-05s">
          <div className="left-side col">
            <div className="details-header">Verification Video</div>
            <div className="verification-vid-holder">
              {/* <video width="783" controls>
                <source src="https://file-examples-com.github.io/uploads/2020/03/file_example_WEBM_480_900KB.webm" type="video/webm" />
                <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" />
                <source src="https://file-examples-com.github.io/uploads/2020/03/file_example_WEBM_480_900KB.webm" type="video/ogg" />
                Your browser does not support the video tag.
              </video> */}
              {customer.video_location ? <video width="783" controls>
                <source src={customer.video_location} />
                {/* <source src={customer.video_location} type="video/ogg" /> */}
                Your browser does not support the video tag.
              </video> : <img src="https://via.placeholder.com/728x427.png?text=Not+Provided" alt="Not Provided" />}
            </div>
          </div>
          <div className="right-side col">
            <div className="details-header">Verification Photo</div>
            <div className="verification-photo-holder">
              <img src={customer.photo_location|| placeholderImg} alt={`${customer.firstname} ${customer.lastname}`} />
            </div>
            <div className="liveliness-opt-div">
              <div className="btn-group" role="group" aria-label="Liveliness Check Options">
              {(isLoading.confirmLiveliness || isLoading.rejectLiveliness) ?
                  <button type="button" className={`btn disabled loading ${isLoading.rejectLiveliness && "reject"}`}>
                    <SpinnerIcon className="rotating" />
                  </button> :
                  <><button type="button" className="btn btn-primary" onClick={handleConfirmLiveliness}>Confirm</button>
                <button type="button" className="btn btn-danger" onClick={handleRejectLiveliness}>Reject</button></>}
              </div>
            </div>

            {/* <button onClick={handleConfirmLiveliness} className="btn confirm-liveliness-btn">
              <CheckCircleFill /> Confirm Liveliness Check
            </button> */}
          </div>
        </div>}
        {!isLoading.userFull && !pathname.includes("auditHistory") && showCustomers === "documents" && <div className="customer-documents-page animated fadeIn delay-05s">
          <div className="id-document-container">
            <div className="details-header">Identification (ID)</div>
            <div className="row">
              <div className="col-4 document-card">
                <img src={customer.document_location} alt="" onClick={ e => document.$("#idDocModal").modal("show")} />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>{showDocumentType(customer.document_type_id)}</b>
                  <span>
                    <a href={customer.document_location} download={`${customer.firstname}-ID`}>
                      <CloudDownloadIcon />
                    </a>
                  </span>
                </div>
              </div>
              <div className="col id-document-details">
                <div className="row">
                  <div className="col-3">Id Type:</div>
                  <div className="col">{showDocumentType(customer.document_type_id)}</div>
                </div>
                <div className="row">
                  <div className="col-3">Id Number:</div>
                  <div className="col">{customer.document_number}</div>
                </div>
                <div className="row">
                  <div className="col-3">Issue Date:</div>
                  <div className="col">
                    {customer.document_issue_date ? moment(customer.document_issue_date).format("DD/MM/YYYY") : "N/A"}
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">Expiry Date:</div>
                  <div className="col">
                    {customer.document_expiry_date ? moment(customer.document_expiry_date).format("DD/MM/YYYY") : "N/A"}
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">Issuing Country:</div>
                  <div className="col">{customer.document_issue_country || "N/A"}</div>
                </div>
                <div className="doc-opt-div">
                  <div className="btn-group" role="group" aria-label="Document operations">
                    {(isLoading.confirmDocuments || isLoading.rejectDocuments) ?
                    <button type="button" className={`btn disabled loading ${isLoading.rejectDocuments && "reject"}`}>
                      <SpinnerIcon className="rotating" />
                    </button> :
                    <><button type="button" className="btn btn-primary" onClick={handleConfirmDocuments}>Confirm Documents</button>
                    <button type="button" className="btn btn-danger" onClick={handleRejectDocuments}>Reject Documents</button></>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="other-documents">
            <div className="details-header">Other Documents</div>
            <div className="row">
              <div className="col-4 document-card">
                <img src={customer.signature_location} alt="" onClick={ e => document.$("#signatureModal").modal("show")} />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>Signature</b>
                  <span>
                    <a href={customer.signature_location} download={`${customer.firstname}-signature`}>
                      <CloudDownloadIcon />
                    </a>
                  </span>
                </div>
              </div>
              {/* <div className="col-4 document-card">
                <img src={face} alt="" />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>Another required document</b>
                  <span><CloudDownloadIcon /></span>
                </div>
              </div> */}
            </div>
          </div>
        </div>}
        {!isLoading.userFull && pathname.includes("auditHistory") && <CustomerAuditHistory userId={params.userId} />}
      </main>
      <Modal
        title="Confirmed Successfully"
        id="confirmModal"
        modalText="You have successfully confirmed this customer’s account."
      />
      <Modal
        title="Restricted Successfully"
        id="rejectModal"
        modalText="You have successfully placed this customer on restriction. The customer Has been duly notified of this action."
      />
      <Modal
        title="Password reset successful"
        id="resetPasswordModal"
        modalText="Temporary password generated and sent to customer's mailbox."
        showCloseX
        // replaceButton
        // newButton={<NewPasswordView password="84ewui9120qw" />}
      />
      <Modal
        title="ID Document"
        id="idDocModal"
        closeWithBackDrop
        replaceButton
        imgSrc={customer.document_location}
      />
      <Modal
        title="Signature"
        id="signatureModal"
        closeWithBackDrop
        replaceButton
        imgSrc={customer.signature_location}
      />
      <Modal
        title="Response Body"
        id="resBodyModal"
        closeWithBackDrop
        showCloseX
        replaceButton
        resBodyText
      />
    </>
    );
};

// const NewPasswordView = props => (
//   <>
//     <div className="new-pwd">
//       {props.password}
//     </div>
//     <p className="font-weight-light">Expires in 5 minutes</p>
//   </>
// );

export default Customer;