import React, { Fragment, useState } from 'react';
import face from '../assets/img/face.jpg';
import { ReactComponent as ArrowRightCircle} from '../assets/icons/arrow-right-circle.svg';
import { ReactComponent as CheckCircleFill} from '../assets/icons/check-circle-fill.svg';
import { ReactComponent as TimesCircleFill} from '../assets/icons/times-circle-fill.svg';
import { ReactComponent as ArrowRightShort} from '../assets/icons/arrow-right-short.svg';
import { ReactComponent as AdobeAcrobatFile} from '../assets/icons/adobe-acrobat-file.svg';
import { ReactComponent as CloudDownloadIcon} from '../assets/icons/cloud-computing.svg';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import moment from 'moment';
import Modal from './modal';
import CustomerAuditHistory from './customerAuditHistory';

const Customer = props => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const location = useLocation();
  const { state: locationState, pathname} = location;
  
  const customer = locationState || {
    "id": 40,
    "bvnhash": "22237899660",
    "firstname": "CHIJIOKE",
    "lastname": "UGWUANYI",
    "middlename": null,
    "phone": "2348103350884",
    "simswapstatus": null,
    "otpstatus": null,
    "email": "cjugwu@gmail.com",
    "dob": "1996-06-30T00:00:00.000Z",
    "pob": null,
    "bucket": "npf-mfb",
    "photo_location": "https://npf-mfb.s3.amazonaws.com/40/photo/livelinesscheck.png",
    "photo_key": "40/photo/livelinesscheck.png",
    "photo_number": null,
    "video_location": "https://npf-mfb.s3.amazonaws.com/40/video/livevideo.webm",
    "video_key": "40/video/livevideo.webm",
    "signature_location": "https://npf-mfb.s3.amazonaws.com/40/signature/signature.png",
    "signature_key": "40/signature/signature.png",
    "document_location": "https://npf-mfb.s3.amazonaws.com/40/signature/IdentityDoc.png",
    "document_key": "40/signature/IdentityDoc.png",
    "document_number": "4584344",
    "document_type_id": 2,
    "isnewbankcustomer": null,
    "isotpverified": true,
    "livelinesschecked": null,
    "salary_officer": false,
    "force_number": "N/A",
    "ippis_number": "N/A",
    "address": "N/A",
    "has_pin": true,
    "createdAt": "2020-11-04T15:11:59.904Z",
    "updatedAt": "2020-11-06T09:11:40.700Z",
    "user": 62
  };

  const [showCustomers, setShowCustomers] = useState("all");
  
  return(
    <>
      <header>
        <div>
          <h1>
            <button onClick={e => history.goBack()} className="btn btn-primary back-btn">
              <ArrowRightShort />
            </button>Customer {pathname.includes("auditHistory") ? "Audit History" : "Profile"}
          </h1>

          {!pathname.includes("auditHistory") && <nav>
            {/* eslint-disable-next-line */}
            <a className={showCustomers === "all" ? "active" : ""} onClick={e => setShowCustomers("all")}>Customer Details</a>
            {/* eslint-disable-next-line */}
            <a className={showCustomers === "documents" ? "active" : ""} onClick={e => setShowCustomers("documents")}>Customer Documents</a>
            {/* eslint-disable-next-line */}
            <a className={showCustomers === "liveliness" ? "active" : ""} onClick={e => setShowCustomers("liveliness")}>Facial Liveliness Check</a>
          </nav>}
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
        Chuka I.
        <i className="arrow down"></i>
          </div>
          <div className="some-container">
            <button onClick={e => {
              document.$("#confirmModal").modal("show").on("hidden.bs.modal", _ => {
                history.go(pathname.includes("auditHistory") ? -2 : -1);
              });
            }} className="btn confirm-user-btn">
              <CheckCircleFill /> Confirm
        </button>
            <button onClick={e => {
              document.$("#rejectModal").modal("show").on("hidden.bs.modal", _ => {
                history.go(pathname.includes("auditHistory") ? -2 : -1);
              });
            }} className="btn restrict-user-btn">
              <TimesCircleFill /> Restrict
        </button>
          </div>
        </div>
      </header>
      <main className="customers-page">
        {!pathname.includes("auditHistory") && showCustomers === "all" && <div className="customer-details row">
          <div className="left-side col-3">
            <div className="img-holder">
              <img src={face} alt="" />
            </div>
            <button className="audit-history-btn btn" onClick={e => history.push(`${url}/auditHistory`, customer)} type="button">
              Audit History
              <span><ArrowRightCircle /></span>
              <div className="overlay-div"></div>
            </button>
            <button onClick={e => {
              document.$("#resetPasswordModal").modal("show");
            }} className="btn btn-outline-danger reset-password-btn d-block" href="#!">Reset Password</button>
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
                <div className="col">Single</div>
              </div>
              <div className="row">
                <div className="col-5">Residential Addr:</div>
                <div className="col">C6, Gold Estate, Ayobo, Ipaja Lagos, Nigeria</div>
              </div>
              <div className="row">
                <div className="col-5">Length of Stay in Address:</div>
                <div className="col">4 years</div>
              </div>
              <div className="row">
                <div className="col-5">State of Origin:</div>
                <div className="col">Umuahia, Abia</div>
              </div>
            </div>
            <div className="other-details col">
              <div className="bank-details">
                <div className="details-header">Bank Details</div>
                <div className="row">
                  <div className="col-5">Bank Account No:</div>
                  <div className="col">0209525729</div>
                </div>
                <div className="row">
                  <div className="col-5">BVN Number:</div>
                  <div className="col">{customer.bvnhash}</div>
                </div>
                <div className="row">
                  <div className="col-5">Customer branch:</div>
                  <div className="col">NPF MFB ISOLO Branch</div>
                </div>
              </div>
              <div className="kin-details">
                <div className="details-header">Next of Kin Details</div>
                <div className="row">
                  <div className="col-5">Next of Kin:</div>
                  <div className="col">Jane Doe</div>
                </div>
                <div className="row">
                  <div className="col-5">Relationship:</div>
                  <div className="col">Wife</div>
                </div>
                <div className="row">
                  <div className="col-5">Phone Number:</div>
                  <div className="col">090983928932</div>
                </div>
                <div className="row">
                  <div className="col-5">Business:</div>
                  <div className="col">Entrpreneur</div>
                </div>
              </div>
            </div>
          </div>
        </div>}
        {!pathname.includes("auditHistory") && showCustomers === "liveliness" && <div className="liveliness-check-page row">
          <div className="left-side col">
            <div className="details-header">Verification Video</div>
            <div className="verification-vid-holder">
              <video width="783" controls>
                {/* <source src="https://file-examples-com.github.io/uploads/2020/03/file_example_WEBM_480_900KB.webm" type="video/webm" /> */}
                <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" />
                <source src="https://file-examples-com.github.io/uploads/2020/03/file_example_WEBM_480_900KB.webm" type="video/ogg" />
            Your browser does not support the video tag.
          </video>
            </div>
          </div>
          <div className="right-side col">
            <div className="details-header">Verification Photo</div>
            <div className="verification-photo-holder">
              <img src={customer.photo_location} alt={`${customer.firstname} ${customer.lastname}`} />
            </div>
          </div>
        </div>}
        {!pathname.includes("auditHistory") && showCustomers === "documents" && <div className="customer-documents-page">
          <div className="id-document-container">
            <div className="details-header">Identification (ID)</div>
            <div className="row">
              <div className="col-4 document-card">
                <img src={face} alt="" />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>Driver's License</b>
                  <span><CloudDownloadIcon /></span>
                </div>
              </div>
              <div className="col id-document-details">
                <div className="row">
                  <div className="col-3">Id Type:</div>
                  <div className="col">Driver's License</div>
                </div>
                <div className="row">
                  <div className="col-3">Id Number:</div>
                  <div className="col">A930283428</div>
                </div>
                <div className="row">
                  <div className="col-3">Issue Date:</div>
                  <div className="col">10-20-1998</div>
                </div>
                <div className="row">
                  <div className="col-3">Expiry Date:</div>
                  <div className="col">10-20-2020</div>
                </div>
                <div className="row">
                  <div className="col-3">Issuing Country:</div>
                  <div className="col">Nigeria</div>
                </div>
              </div>
            </div>
          </div>
          <div className="other-documents">
            <div className="details-header">Other Documents</div>
            <div className="row">
              <div className="col-4 document-card">
                <img src={face} alt="" />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>Required document one</b>
                  <span><CloudDownloadIcon /></span>
                </div>
              </div>
              <div className="col-4 document-card">
                <img src={face} alt="" />
                <div className="document-info">
                  <span><AdobeAcrobatFile /></span>
                  <b>Another required document</b>
                  <span><CloudDownloadIcon /></span>
                </div>
              </div>
            </div>
          </div>
        </div>}
        {pathname.includes("auditHistory") && <CustomerAuditHistory />}
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
        modalText="Temporary password generated for customer"
        showCloseX
        replaceButton
        newButton={<NewPasswordView password="84ewui9120qw" />}
      />
    </>
    );
};

const NewPasswordView = props => (
  <>
    <div className="new-pwd">
      {props.password}
    </div>
    <p className="font-weight-light">Expires in 5 minutes</p>
  </>
);

export default Customer;