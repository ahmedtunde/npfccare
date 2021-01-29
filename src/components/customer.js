import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import face from '../assets/img/face.jpg';
import placeholderImg from '../assets/img/placeholder-img.png';
import { ReactComponent as ArrowRightCircle} from '../assets/icons/arrow-right-circle.svg';
import { ReactComponent as CheckCircleFill} from '../assets/icons/check-circle-fill.svg';
import { ReactComponent as TimesCircleFill} from '../assets/icons/times-circle-fill.svg';
import { ReactComponent as ArrowRightShort} from '../assets/icons/arrow-right-short.svg';
import { ReactComponent as AdobeAcrobatFile} from '../assets/icons/adobe-acrobat-file.svg';
import { ReactComponent as CloudDownloadIcon} from '../assets/icons/cloud-computing-download.svg';
import { ReactComponent as CloudUploadIcon} from '../assets/icons/cloud-computing-upload.svg';
import { ReactComponent as SpinnerIcon} from '../assets/icons/spinner.svg';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import moment from 'moment';
import Modal from './modal';
import CustomerAuditHistory from './customerAuditHistory';
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
  getCustomerBankAcc,
  resetCustomerPassword,
  resetCustomerTxnPIN,
  unlockCustomerAccount,
  getDocTypes,
  unlinkCustomerDevice,
  syncCustomerInfo,
  uploadCustomerSignature,
  uploadCustomerIdDocument,
  uploadCustomerLivelinessVideo,
  uploadCustomerPhoto,
  completeCustomerSignup
} from '../services/customerService';
import { handleOpenModal, useAuth, handleHideModal, isAlphaNumeric } from './utilities';
import errorHandler from '../utils/errorHandler';
import notify from '../utils/notification';

const Customer = props => {
  const history = useHistory();
  const { url, params } = useRouteMatch();
  const location = useLocation();
  const { state: locationState, pathname} = location;
  const auth = useAuth();
  // useCallback ensures that handle error function isn't recreated on every render
  const handleError = useCallback((errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb), [auth]);
  
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
    document_type_id: 1,
    email: "",
    enabled: true,
    firstname: "",
    force_number: "",
    has_pin: false,
    id: 19,
    ippis_number: "",
    "documentschecked": null,
    "isnewbankcustomer": null,
    "document_issue_date": "",
    "document_expiry_date" : "",
    isotpverified: true,
    lastname: "Orji",
    livelinesschecked: true,
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
    user: 21,
    video_key: "",
    video_location: "",
    signup_incomplete: true,
    accounts: []
  });

  const [docTypes, setDocTypes] = useState([{
    id: 0,
    name: "Unknown Type"
  }]);

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
    userFull: false,
    resetTxnPIN: false,
    unlockAccount: false,
    unlinkDevice: false,
    syncInfo: false,
    uploadSignature: false,
    uploadIdDocument: false,
    uploadUserPhoto: false,
    uploadLivelinessVideo: false,
    completeCustomerSignup: false
  });

  const [values, setValues] = useState({
    document_type_id: 0,
    document_number: "",
    document_issue_date: "",
    document_expiry_date: ""
  });

  const [showInputErrors, setShowInputErrors] = useState(false);
  
  const [filesToUpload, setFilesToUpload] = useState(() => ({
    signature: "",
    idDocument: "",
    livelinessVideo: "",
    userPhoto: ""
  }));

  const [filesToUploadError, setFilesToUploadError] = useState(() => ({
    signature: "",
    idDocument: "",
    livelinessVideo: "",
    userPhoto: ""
  }));

  const [filesToUploadDataString, setFilesToUploadDataString] = useState(() => ({
    signature: "",
    idDocument: "",
    livelinessVideo: "",
    userPhoto: ""
  }));

  const videoElem = useRef(null);

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
        handleError(error, notify, () => handleChangeLoading("userFull", false));
      }
    }

    async function handleFetchSingleUser(userId, cb = _ => {}) {
      handleChangeLoading("userFull", true);
      try {
        const result = await getCustomer(userId);
        const doc_types = await getDocTypes();
        handleChangeLoading("userFull", false);
        if (result.error) return notify(result.message, "error");
        if (result.result === null) {
          notify("Customer Not Found", "error");
          history.push("/pages/customers");
          return;
        };
        if (!doc_types?.error && doc_types?.result?.length > 0) {
          setDocTypes(prev => ([...prev, ...doc_types.result]));
        };
        setCustomer(prev => ({
          ...prev,
          ...result.result
        }));
        cb(params.userId);
      } catch (error) {
        handleError(error, notify, () => handleChangeLoading("userFull", false));
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
  }, [locationState, params.userId, history, handleError]);

  const handleChangeLoading = (name, value) => setLoading(prev => ({
    ...prev,
    [name]: value
  }));

  const handleResetPassword = async e => {
    handleChangeLoading("resetPassword", true);
    // setTimeout(_ => setResetPasswordLoading(false), 2500);
    try {
      const result = await resetCustomerPassword(customer.id);
      handleChangeLoading("resetPassword", false);
      if(result.error) return notify(result.message, "error");
      handleOpenModal("#resetPasswordModal");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("resetPassword", false));
    }
  };

  const handleResetTxnPIN = async e => {
    handleChangeLoading("resetTxnPIN", true);
    try {
      const result = await resetCustomerTxnPIN(customer.id);
      handleChangeLoading("resetTxnPIN", false);
      if(result.error) return notify(result.message, "error");
      handleOpenModal("#resetTxnPINModal");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("resetTxnPIN", false));
    }
  };

  const handleUnlockAccount = async e => {
    handleChangeLoading("unlockAccount", true);
    try {
      const result = await unlockCustomerAccount(customer.id);
      handleChangeLoading("unlockAccount", false);
      if(result.error) return notify(result.message, "error");
      handleOpenModal("#unlockAccountModal");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("unlockAccount", false));
    }
  };

  const handleUnlinkDevice = async e => {
    handleChangeLoading("unlinkDevice", true);
    try {
      const result = await unlinkCustomerDevice(customer.id);
      handleChangeLoading("unlinkDevice", false);
      if(result.error) return notify(result.message, "error");
      handleOpenModal("#unlinkDeviceModal");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("unlinkDevice", false));
    }
  };

  const handleSyncInfo = async e => {
    handleChangeLoading("syncInfo", true);
    try {
      const result = await syncCustomerInfo(customer.id);
      handleChangeLoading("syncInfo", false);
      if(result.error) return notify(result.message, "error");
      handleOpenModal("#syncInfoModal");
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("syncInfo", false));
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
      handleOpenModal("#confirmModal", _ => {
        history.push('/pages/customers');
      });;
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("confirmCustomer", false));
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
      handleOpenModal("#rejectModal", _ => {
        history.push('/pages/customers');
      });;
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("restrictCustomer", false));
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
      handleError(error, notify, () => handleChangeLoading("enforcePND", false));
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
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("removePND", false));
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
      handleError(error, notify, () => handleChangeLoading("confirmDocuments", false));
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
      handleError(error, notify, () => handleChangeLoading("rejectDocuments", false));
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
      handleError(error, notify, () => handleChangeLoading("confirmLiveliness", false));
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
      handleError(error, notify, () => handleChangeLoading("rejectLiveliness", false));
    }
  };

  const showDocumentType = _id => {
    const idx = docTypes.findIndex(({id}) => id === _id);
    return docTypes[idx]?.name || "Unknown Type";
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setValues(prev => ({
      ...prev,
      [name]: name === "document_number" ? value.trim() : value
    }));
  };

  const handleChangeFile = e => {
    const {name, files} = e.target;
    const fileType = files[0].type;

    // const documentFileTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    const photoFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    const isFileTypeInvalid = ((name === "signature" || name === "idDocument" || name === "userPhoto") && !photoFileTypes.includes(fileType)) ||
      (name === "livelinessVideo" && fileType !== "video/mp4");
    const errorMessage = (name === "signature" || name === "idDocument" || name === "userPhoto") ? "Supported file types: .jpg, .png, .jpeg" :
      (name === "livelinessVideo" ? "Supported file types: .mp4" : "");

      setFilesToUploadError(prev => ({
      ...prev,
      [name]: isFileTypeInvalid ? errorMessage : ""
    }));

    setFilesToUpload(prev => ({
      ...prev,
      [name]: isFileTypeInvalid ? "" : files[0]
    }));

    handleProcessItem(name, files[0], isFileTypeInvalid)
    
    // if((name === "signature" || name === "idDocument") && !documentFileTypes.includes(fileType)) return setFilesToUploadError(prev => ({
    //   ...prev,
    //   [name]: "Supported file types: .jpg, .png, .jpeg, .pdf"
    // }));

    // if(name === "livelinessVideo" && fileType !== "video/mp4") return setFilesToUploadError(prev => ({
    //   ...prev,
    //   [name]: "Supported file types: .mp4"
    // }));

    // if(name === "userPhoto" && !photoFileTypes.includes(fileType)) return setFilesToUploadError(prev => ({
    //   ...prev,
    //   [name]: "Supported file types: .jpg, .png, .jpeg"
    // }));
  };

  const handleRemoveFile = name => {
    setFilesToUploadError(prev => ({
      ...prev,
      [name]: ""
    }));

    setFilesToUpload(prev => ({
      ...prev,
      [name]: ""
    }));

    setFilesToUploadDataString(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  // livevideo.mp4 livelinesscheck.png IdentityDoc.png signature.png

  const handleUploadItem = async (name) => {
    if(name === "idDocument"){
      const areInputsInvalid = !values.document_number || (values.document_number && values.document_number.length < 5) || (values.document_number && values.document_number.length > 15) || (values.document_number && !isAlphaNumeric(values.document_number)) || !values.document_type_id || !values.document_issue_date || !values.document_expiry_date;
      if(areInputsInvalid) return setShowInputErrors(true);
      setShowInputErrors(false);
    };
    const identifier = name === "signature" ? "uploadSignature" :
        (name === "idDocument" ? "uploadIdDocument" :
          (name === "userPhoto" ? "uploadUserPhoto" :
            (name === "livelinessVideo" ? "uploadLivelinessVideo" : "")));
    handleChangeLoading(identifier, true);
    try {
      const itemType = name === "signature" ? name :
        (name === "idDocument" ? "document" :
          (name === "userPhoto" ? "photo" :
            (name === "livelinessVideo" ? "video" : "")));
      
      const filename = name === "signature" ? "signature.png" :
        (name === "idDocument" ? "IdentityDoc.png" :
          (name === "userPhoto" ? "livelinesscheck.png" :
            (name === "livelinessVideo" ? "livevideo.mp4" : "")));

      const functionToCall = name === "signature" ? uploadCustomerSignature :
        (name === "idDocument" ? uploadCustomerIdDocument :
          (name === "userPhoto" ? uploadCustomerPhoto :
            (name === "livelinessVideo" ? uploadCustomerLivelinessVideo : () => {})));

      const propertyToUpdate = name === "signature" ? "signature_location" :
        (name === "idDocument" ? "document_location" :
          (name === "userPhoto" ? "photo_location" :
            (name === "livelinessVideo" ? "video_location" : "")));
      
      const fileToUpload = dataURLtoFile(filesToUploadDataString[name], filename);
      const formData = new FormData();
      formData.append(itemType, fileToUpload);
      formData.append("customer_id", customer.id);
      if(name === "idDocument"){
        formData.append("document_number", values.document_number);
        formData.append("document_type_id", values.document_type_id);
        formData.append("document_issue_date", values.document_issue_date);
        formData.append("document_expiry_date", values.document_expiry_date);
      }
      const result = await functionToCall(formData);
      handleChangeLoading(identifier, false);
      notify(result.message, result.error ? "error" : "success");
      if(!result.error){
        setCustomer(prev => ({
          ...prev,
          [propertyToUpdate]: filesToUploadDataString[name],
          document_number : name === "idDocument" ? values.document_number : prev.document_number,
          document_type_id: name === "idDocument" ? parseInt(values.document_type_id) : prev.document_type_id,
          document_issue_date: name === "idDocument"  ? values.document_issue_date : prev.document_issue_date,
          document_expiry_date: name === "idDocument" ? values.document_expiry_date : prev.document_expiry_date
        }));
       if(name === "livelinessVideo") setTimeout(() => videoElem.current.load(), 2000);
       return handleHideModal(`#${identifier}Modal`);
      }
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading(identifier, false));
    }
  };

  const handleProcessItem = (name, file, isFileTypeInvalid) => {
    if(isFileTypeInvalid) return setFilesToUploadDataString(prev => ({
      ...prev,
      [name]: ""
    }));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e){
      setFilesToUploadDataString(prev => ({
        ...prev,
        [name]: reader.result
      }));
    };
  }

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  const handleCompleteSignup = async (e) => {
    handleChangeLoading("completeCustomerSignup", true);
    try {
      const result = await completeCustomerSignup(customer.id);
      handleChangeLoading("completeCustomerSignup", false);
      if(result.error) return notify(result.message, "error");
      handleOpenModal("#completeSignupModal", _ => {
        history.go(0);
      });;
    } catch (error) {
      handleError(error, notify, () => handleChangeLoading("completeCustomerSignup", false));
    }
  };
  
  // const showDocumentType = id => {
  //   switch (id) {
  //     case 1:
  //       return "Driver's License"
  //     case 2:
  //       return "International Passport"
  //     case 3:
  //       return "National ID"
  //     default:
  //       return "Unknown Type"
  //   }
  // };
  
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
            <button
              onClick={handleResetTxnPIN}
              className={`btn btn-outline-danger reset-password-btn d-block ${isLoading.resetTxnPIN ?
                "loading disabled" : ""}`}
            >
              {isLoading.resetTxnPIN ?
                <SpinnerIcon className="rotating" /> : 
                "Reset Txn PIN"}
            </button>
            <button
              onClick={handleUnlockAccount}
              className={`btn btn-outline-danger reset-password-btn d-block ${isLoading.unlockAccount ?
                "loading disabled" : ""}`}
            >
              {isLoading.unlockAccount ?
                <SpinnerIcon className="rotating" /> : 
                "Unlock Account"}
            </button>
            <button
              onClick={handleUnlinkDevice}
              className={`btn btn-outline-danger reset-password-btn d-block ${isLoading.unlinkDevice ?
                "loading disabled" : ""}`}
            >
              {isLoading.unlinkDevice ?
                <SpinnerIcon className="rotating" /> : 
                "Unlink Device"}
            </button>
            <button
              onClick={handleSyncInfo}
              className={`btn btn-outline-danger reset-password-btn d-block ${isLoading.syncInfo ?
                "loading disabled" : ""}`}
            >
              {isLoading.syncInfo ?
                <SpinnerIcon className="rotating" /> : 
                "Sync Info"}
            </button>
            <div className="divider" style={{borderBottom: "1px solid #c1c1c1", width: "100%"}}>&nbsp;</div>
            <div className={`mt-3 mb-3 ${customer.signup_incomplete ? "color-red" : "color-green"}`}>SignUp {customer.signup_incomplete ? "Incomplete" : "Completed"}</div>
            <button
              onClick={handleCompleteSignup}
              className={`btn btn-outline-danger reset-password-btn d-block ${isLoading.completeCustomerSignup ?
                "loading disabled" : ""}`}
              disabled={!customer.signup_incomplete}
            >
              {isLoading.completeCustomerSignup ?
                <SpinnerIcon className="rotating" /> : 
                "Complete Signup"}
            </button>
            <div className="pnd-div mt-5">
              <p className="color-dark-text-blue"><b>Post No Debit</b></p>
              <p className={`color-${customer.PND ? "red" : "green"}`}>Status: {customer.PND ? "Active" : "Inactive"}</p>
              <div className="btn-group" role="group" aria-label="Post No Debit">
                {(isLoading.enforcePND || isLoading.removePND) ?
                  <button type="button" className={`btn disabled loading ${isLoading.removePND && "reject"}`}>
                    <SpinnerIcon className="rotating" />
                  </button> :
                  <><button type="button" disabled={customer.PND} className="btn btn-primary" onClick={handleEnforcePND}>Enforce</button>
                <button type="button" disabled={!customer.PND} className="btn btn-danger" onClick={handleRemovePND}>Remove</button></>}
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
              {customer.video_location ? <video width="783" ref={videoElem} controls>
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
            <p className="color-dark-text-blue">Verification Status:{' '}
              <span className={`col color-${customer.livelinesschecked === "APPROVED" ? "green" :
                customer.livelinesschecked === "DISAPPROVED" ? "red" : "yellow"}`}>
                  {customer.livelinesschecked}
                </span>
            </p>
              <div className="btn-group" role="group" aria-label="Liveliness Check Options">
              {(isLoading.confirmLiveliness || isLoading.rejectLiveliness) ?
                  <button type="button" className={`btn disabled loading ${isLoading.rejectLiveliness && "reject"}`}>
                    <SpinnerIcon className="rotating" />
                  </button> :
                  <><button type="button" className="btn btn-primary" onClick={handleConfirmLiveliness} disabled={customer.livelinesschecked === "APPROVED"}>Confirm</button>
                <button type="button" className="btn btn-danger" onClick={handleRejectLiveliness}  disabled={customer.livelinesschecked === "DISAPPROVED"}>Reject</button></>}
              </div>
              <div className="btn-group mt-2" role="group" aria-label="Liveliness Check Upload Options">
                <button type="button" className="btn btn-primary mr-2" onClick={e => handleOpenModal("#uploadLivelinessVideoModal", () => handleRemoveFile("livelinessVideo"))}>Upload Video</button>
                <button type="button" className="btn btn-primary" onClick={e => handleOpenModal("#uploadUserPhotoModal", () => handleRemoveFile("userPhoto"))}>Upload Photo</button>
              </div>
            </div>
          </div>
        </div>}
        {!isLoading.userFull && !pathname.includes("auditHistory") && showCustomers === "documents" && <div className="customer-documents-page animated fadeIn delay-05s">
          <div className="id-document-container">
            <div className="details-header">Identification (ID)</div>
            <div className="row">
              <div className="col-4 document-card">
                <img src={customer.document_location} alt="" onClick={ e => handleOpenModal("#idDocModal")} />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>{showDocumentType(customer.document_type_id)}</b>
                  <div className="file-action-icons">
                    <span data-toggle="tooltip" data-placement="bottom" title="Upload ID" onClick={e => handleOpenModal("#uploadIdDocumentModal", () => {
                      setShowInputErrors(false);
                      setValues(prev => ({
                        ...prev,
                        document_type_id: 0,
                        document_expiry_date: "",
                        document_issue_date: "",
                        document_number: ""
                      }))
                      handleRemoveFile("idDocument");
                    })}>
                      <a>
                        <CloudUploadIcon />
                      </a>
                    </span>
                    <span data-toggle="tooltip" data-placement="bottom" title="Download ID">
                      <a href={customer.document_location} download={`${customer.firstname}-ID`}>
                        <CloudDownloadIcon />
                      </a>
                    </span>
                  </div>
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
                <div className="row">
                  <div className="col-3">Verification Status:</div>
                  <div className={`col color-${customer.documentschecked === true ? "green" :
                      customer.documentschecked === false ? "red" : "yellow"}`}>
                    {customer.documentschecked === true ? "APPROVED" :
                      customer.documentschecked === false ? "REJECTED" : "PENDING"}
                  </div>
                </div>
                <div className="doc-opt-div">
                  <div className="btn-group" role="group" aria-label="Document operations">
                    {(isLoading.confirmDocuments || isLoading.rejectDocuments) ?
                    <button type="button" className={`btn disabled loading ${isLoading.rejectDocuments && "reject"}`}>
                      <SpinnerIcon className="rotating" />
                    </button> :
                    <><button type="button" className="btn btn-primary" onClick={handleConfirmDocuments} disabled={customer.documentschecked}>Confirm Documents</button>
                    <button type="button" className="btn btn-danger" disabled={customer.documentschecked === false} onClick={handleRejectDocuments}>Reject Documents</button></>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="other-documents">
            <div className="details-header">Other Documents</div>
            <div className="row">
              <div className="col-4 document-card">
                <img src={customer.signature_location} alt="" onClick={ e => handleOpenModal("#signatureModal")} />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>Signature</b>
                  <div className="file-action-icons">
                    <span data-toggle="tooltip" data-placement="bottom" title="Upload signature" onClick={e => handleOpenModal("#uploadSignatureModal", () => handleRemoveFile("signature"))}>
                      <a>
                        <CloudUploadIcon />
                      </a>
                    </span>
                    <span data-toggle="tooltip" data-placement="bottom" title="Download signature">
                      <a href={customer.signature_location} download={`${customer.firstname}-signature`}>
                        <CloudDownloadIcon />
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="col-4 document-card">
                <img src={face} alt="" />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>Another required document</b>
                  <div className="file-action-icons">
                    <span>
                      <a>
                        <CloudUploadIcon />
                      </a>
                    </span>
                    <span>
                      <a href={customer.document_location} download={`${customer.firstname}-ID`}>
                        <CloudDownloadIcon />
                      </a>
                    </span>
                  </div>
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
        title="Transaction PIN reset successful"
        id="resetTxnPINModal"
        modalText="You have successfully reset this customer's transaction PIN. The customer has been duly notified of this action."
      />
      <Modal
        title="Account Unlocked Successfully"
        id="unlockAccountModal"
        modalText="You have successfully unlocked this account. The customer has been duly notified of this action."
      />

      <Modal
        title="Device Unlinked Successfully"
        id="unlinkDeviceModal"
        modalText="You have successfully unlinked the device tied to this account. The customer has been duly notified of this action."
      />

      <Modal
        title="Info Synced Successfully"
        id="syncInfoModal"
        modalText="You have successfully synchronized this customer's info from the core banking to our platform."
      />

      <Modal
        title="Completed Process Successfully"
        id="completeSignupModal"
        modalText="You have successfully completed the signup process unbehalf of this customer. The customer has been duly notified of this action."
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
        showCloseX
        closeWithBackDrop
        replaceButton
        imgSrc={customer.document_location}
      />
      <Modal
        title="Signature"
        id="signatureModal"
        showCloseX
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

      <Modal
        id="uploadSignatureModal"
        closeWithBackDrop
        showCloseX>
        <div className="modal-body">
          <h5 className="modal-title" id={`uploadSignatureModalLabel`}>Upload Signature</h5>
          <div className="input-group mt-5">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile01"
                name="signature"
                onChange={handleChangeFile}
                accept="image/jpeg,image/jpg,image/png,.jpg,.png,.jpeg"/>
                {/* /> */}
              <label className="custom-file-label" htmlFor="inputGroupFile01">{filesToUpload.signature.name || "Choose file"}</label>
            </div>
          </div>
          <div className="text-small mb-5 text-danger">{filesToUploadError.signature}</div>
          <div>
            <button type="button" className="btn btn-primary" onClick={e => handleUploadItem("signature")} disabled={!filesToUpload.signature || filesToUploadError.signature || !filesToUploadDataString.signature || isLoading.uploadSignature}>
              {isLoading.uploadSignature ? <SpinnerIcon className="rotating" /> : "Confirm Upload"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        id="uploadIdDocumentModal"
        closeWithBackDrop
        showCloseX>
        <div className="modal-body">
          <h5 className="modal-title" id={`uploadIdDocumentModalLabel`}>Upload ID Document</h5>
          <div className="form-row mt-5 mb-3">
            <div className="form-group col">
              <label htmlFor="exampleFormControlInput1">ID Number</label>
              <input
                type="text"
                name="document_number"
                onChange={handleChange} value={values.document_number}
                className={`form-control ${showInputErrors && (!values.document_number || (values.document_number && values.document_number.length < 5) || (values.document_number && values.document_number.length > 15) || (values.document_number && !isAlphaNumeric(values.document_number))) ? "is-invalid" : ""}`}
                aria-describedby="validationFeedback01" id="exampleFormControlInput1"/>
              <div id="validationFeedback01" className="invalid-feedback">
                {!values.document_number && "Required"}
                {values.document_number && values.document_number.length < 5 && "ID number must not be below 5 characters."}
                {values.document_number && values.document_number.length > 15 && "ID number must not exceed 15 characters."}
                {values.document_number && values.document_number.length > 4 && values.document_number.length < 16 && !isAlphaNumeric(values.document_number) && "ID must consist of alphanumeric characters."}
              </div>
            </div>

            <div className="form-group col">
              <label htmlFor="exampleFormControlSelect2">Document Type</label>
              <select className={`form-control ${showInputErrors && !values.document_type_id ? "is-invalid" : ""}`} name="document_type_id" onChange={handleChange} value={values.document_type_id} id="exampleFormControlSelect2" aria-describedby="validationFeedback02">
                {docTypes.map(({id, name}, idx) => (<option className={parseInt(id) === 0 ? "d-none" : ""} key={idx} value={id}>{parseInt(id) === 0 ? "Select Type" : name}</option>))}
              </select>
              <div id="validationFeedback02" className="invalid-feedback">
                {!values.document_type_id && "Select a valid type."}
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group col">
              <label htmlFor="exampleFormControlInput3">Issue Date</label>
              <input
                type="date"
                value={values.document_issue_date}
                name="document_issue_date"
                onChange={handleChange}
                className={`form-control ${showInputErrors && !values.document_issue_date ? "is-invalid" : ""}`}
                id="exampleFormControlInput3"
                aria-describedby="validationFeedback03"/>
              <div id="validationFeedback03" className="invalid-feedback">
                {!values.document_issue_date && "Required"}
              </div>
            </div>
            <div className="form-group col">
              <label htmlFor="exampleFormControlInput4">Expiry Date</label>
              <input
                type="date"
                value={values.document_expiry_date}
                className={`form-control ${showInputErrors && !values.document_expiry_date ? "is-invalid" : ""}`}
                id="exampleFormControlInput4"
                name="document_expiry_date"
                onChange={handleChange}
                aria-describedby="validationFeedback04"/>
              <div id="validationFeedback03" className="invalid-feedback">
                {!values.document_expiry_date && "Required"}
              </div>
            </div>
          </div>
          
          <div className="input-group mt-5">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile02"
                name="idDocument"
                onChange={handleChangeFile}
                accept="image/jpeg,image/jpg,image/png,.jpg,.png,.jpeg"/>
                {/* /> */}
              <label className="custom-file-label" htmlFor="inputGroupFile02">{filesToUpload.idDocument.name || "Choose file"}</label>
            </div>
          </div>
          <div className="text-small mb-5 text-danger">{filesToUploadError.idDocument}</div>
          <div>
            <button type="button" className="btn btn-primary" onClick={e => handleUploadItem("idDocument")} disabled={!filesToUpload.idDocument || filesToUploadError.idDocument || !filesToUploadDataString.idDocument || isLoading.uploadIdDocument}>
              {isLoading.uploadIdDocument ? <SpinnerIcon className="rotating" /> : "Confirm Upload"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        id="uploadUserPhotoModal"
        closeWithBackDrop
        showCloseX>
        <div className="modal-body">
          <h5 className="modal-title" id={`uploadUserPhotoModalLabel`}>Upload Photo</h5>
          <div className="input-group mt-5">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile03"
                name="userPhoto"
                onChange={handleChangeFile}
                accept="image/jpeg,image/jpg,image/png,.jpg,.png,.jpeg"/>
                {/* /> */}
              <label className="custom-file-label" htmlFor="inputGroupFile03">{filesToUpload.userPhoto.name || "Choose file"}</label>
            </div>
          </div>
          <div className="text-small mb-5 text-danger">{filesToUploadError.userPhoto}</div>
          <div>
            <button type="button" className="btn btn-primary" onClick={e => handleUploadItem("userPhoto")} disabled={!filesToUpload.userPhoto || filesToUploadError.userPhoto || !filesToUploadDataString.userPhoto || isLoading.uploadUserPhoto}>
              {isLoading.uploadUserPhoto ? <SpinnerIcon className="rotating" /> : "Confirm Upload"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        id="uploadLivelinessVideoModal"
        closeWithBackDrop
        showCloseX>
        <div className="modal-body">
          <h5 className="modal-title" id={`uploadLivelinessVideoModalLabel`}>Upload Liveliness Check Video</h5>
          <div className="input-group mt-5">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile04"
                name="livelinessVideo"
                onChange={handleChangeFile}
                accept="video/mp4,.mp4"/>
                {/* /> */}
              <label className="custom-file-label" htmlFor="inputGroupFile04">{filesToUpload.livelinessVideo.name || "Choose file"}</label>
            </div>
          </div>
          <div className="text-small mb-5 text-danger">{filesToUploadError.livelinessVideo}</div>
          <div>
            <button type="button" className="btn btn-primary" onClick={e => handleUploadItem("livelinessVideo")} disabled={!filesToUpload.livelinessVideo || filesToUploadError.livelinessVideo || !filesToUploadDataString.livelinessVideo || isLoading.uploadLivelinessVideo}>
              {isLoading.uploadLivelinessVideo ? <SpinnerIcon className="rotating" /> : "Confirm Upload"}
            </button>
          </div>
        </div>
      </Modal>
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