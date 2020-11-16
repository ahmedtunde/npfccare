import React, { Fragment, useState, useEffect } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import face from '../assets/img/face.jpg';
import placeholderImg from '../assets/img/placeholder-img.png';
import { ReactComponent as TimesIcon} from '../assets/icons/times.svg';
import { ReactComponent as CheckCircleFill} from '../assets/icons/check-circle-fill.svg';
import { ReactComponent as SearchIcon} from '../assets/icons/search.svg';
import { ReactComponent as ExportIcon} from '../assets/icons/export.svg';
import { ReactComponent as Funnel} from '../assets/icons/funnel.svg';
import { ReactComponent as ArrowLeftShortCircleFill} from '../assets/icons/arrow-left-short-circle-fill.svg';
import Customer from './customer';
import { getCustomers } from '../services/customerService';

const Customers = props => {
  const { path } = useRouteMatch();
  const history = useHistory();
  
  const [customers, setCustomers] = useState(() => Array(10).fill("").map((v, idx) => ({
    "id": `40${idx}`,
    "bvnhash": "22237899660",
    "firstname": idx ? "CHIJIOKE" : "CHUKA",
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
    "user": 62,
    accountNumber: "0209525729",
    bvn: "000293829134",
    accountStatus: idx === 0 || idx === 2 ? false : true,
    liveliness: idx === 0 || idx === 2 ? false : true
  })));

  const [displayedCustomers, setDisplayedCustomers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showCustomers, setShowCustomers] = useState("all");

  
  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     try {
  //       const response = await getCustomers();
  //       if(response.error) return;
  //       setCustomers(prev => [...prev, ...response.result]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchCustomers();
  // }, []);

  useEffect(() => {
    setDisplayedCustomers(customers);
  }, [customers]);

  useEffect(() => {
    let tempCustomers;
    setCurrentPage(1);
    if(showCustomers === "all" || showCustomers === "restricted") tempCustomers = customers;

    if(showCustomers === "active" || showCustomers === "pending"){
      tempCustomers = customers.filter(({accountStatus}) => {
        if (showCustomers === "active" && accountStatus) return true;
        if (showCustomers === "pending" && !accountStatus) return true;
        return false;
      });
    };
    setDisplayedCustomers(tempCustomers);
  }, [showCustomers, customers]);

  const handleNavigateToCustomer = e => {
    const element = e.target;
    if(!element.classList.contains("action-btn")) return;
    const userId = element.dataset.userId;
    const requestedCustomer = customers[customers.findIndex(v => v.id === userId)];
    history.push(`${path}/${userId}`, requestedCustomer);

  }

  const itemsPerPage = 5;

  const handleChangeCurrentPage = e => {
    const element = e.target;
    if(element.dataset.operation !== "changePage") return;
    setCurrentPage(parseInt(element.dataset.customersPage));
  };

  
  return(
    <Switch>
      <Route exact path={path}>
        <>
          <header>
            <div>
              <h1>Customer Accounts Management</h1>

              <nav>
                {/* eslint-disable-next-line */}
                <a className={showCustomers === "all" ? "active" : ""} onClick={e => setShowCustomers("all")}>All Customers</a>
                {/* eslint-disable-next-line */}
                <a className={showCustomers === "active" ? "active" : ""} onClick={e => setShowCustomers("active")}>Active</a>
                {/* eslint-disable-next-line */}
                <a className={showCustomers === "pending" ? "active" : ""} onClick={e => setShowCustomers("pending")}>Pending</a>
                {/* eslint-disable-next-line */}
                <a className={showCustomers === "restricted" ? "active" : ""} onClick={e => setShowCustomers("restricted")}>Restricted</a>
              </nav>
            </div>
            <div>
              <div className="small-admin-details">
                <img src={face} alt=""/>
                Chuka I.
                <i className="arrow down"></i>
              </div>
              <div className="some-container">
                <div className="search-div">
                  <label htmlFor="search"><SearchIcon /></label>
                  <input type="search" className="form-control" name="search" id="search" aria-label="Search for customers"/>
                </div>
                <button className="btn export-data-btn">
                  <ExportIcon /> Export Data
                </button>
                <button className="btn filter-btn">
                  <Funnel /> Filter
                </button>
              </div>
            </div>
          </header>
          <main className="customers-page">
            <table className="table table-borderless">
              <thead className="color-dark-text-blue">
                <tr>
                  {/* <th scope="col">
                    <input type="checkbox" />
                  </th> */}
                  <th scope="col">Customer</th>
                  <th scope="col">BVN</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Account Status</th>
                  <th scope="col">Facial Liveliness Check</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody onClick={handleNavigateToCustomer}>
                <tr className="spacer" />
                {displayedCustomers.map((v, idx) => {
                  const initialBoundary = ((currentPage - 1) * itemsPerPage) + 1;
                  const finalBoundary = currentPage * itemsPerPage;
                  const itemNumber = idx + 1;
                  if(itemNumber < initialBoundary || itemNumber > finalBoundary) return null;

                  return(<Fragment key={v.user + idx}>
                    <tr className="customer-card">
                      {/* <th scope="row">
                        <input type="checkbox" />
                      </th> */}
                      <td className="major-details">
                        <div className="row">
                          <div className="customer-img">
                            <img src={v.photo_location || placeholderImg} className="" alt=""/>
                          </div>
                          <div className="col">
                            <div className="name font-weight-bold">{v.firstname} {v.lastname}</div>
                            <div className="email font-weight-light">{v.email}</div>
                            <div className="acc-number">AC/N: {v.accountNumber || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="bvn font-weight-light">{v.bvnhash || "N/A"}</td>
                      <td className="phone font-weight-light">(234) {v.phone.replace("234", "0")}</td>
                      <td>
                        <span className={`account-status ${v.accountStatus ? "active" : "pending"}`}>
                          {v.accountStatus ? "ACTIVE" : "PND"}
                        </span>
                      </td>
                      <td>
                        <span className={`liveliness ${v.liveliness ? "provided" : ""}`}>
                          {v.liveliness ? <CheckCircleFill /> : <TimesIcon />}
                          {v.liveliness ? " P" : "Not p"}rovided
                        </span>
                      </td>
                      <td>
                        <button data-user-id={v.id} className="btn btn-success action-btn">
                          View
                        </button>
                      </td>
                    </tr>
                    {idx !== displayedCustomers.length - 1 && <tr className="spacer" />}
                    </Fragment >
                  )
                })}
              </tbody>
            </table>
            <div className="audit-history-footer">
              <div className="pagination-btns" onClick={handleChangeCurrentPage}>
                <button
                  className={`btn icon ${currentPage === 1 ? "disabled" : ""}`}
                  disabled={currentPage === 1}
                  data-operation="changePage" data-customers-page={currentPage - 1}>
                  <ArrowLeftShortCircleFill />
                </button>
                {Array(Math.ceil(displayedCustomers.length / itemsPerPage) || 1).fill("a").map((v, idx) => (
                  <button data-operation="changePage" data-customers-page={idx + 1} key={idx} className={`btn${currentPage === (idx + 1) ? " active" : ""}`}>
                    {idx + 1}
                  </button>
                ))}
                <button
                  className={`btn icon ${currentPage === (Math.ceil(displayedCustomers.length / itemsPerPage) || 1) ? "disabled" : ""}`}
                  disabled={currentPage === (Math.ceil(displayedCustomers.length / itemsPerPage) || 1)}
                  data-operation="changePage" data-customers-page={currentPage + 1}>
                  <ArrowLeftShortCircleFill style={{transform: "rotateY(180deg)"}}/>
                </button>
              </div>
            </div>
          </main>
        </>
      </Route>
      <Route path={`${path}/:userId`} component={Customer} />
    </Switch>
  );
};

export default Customers;