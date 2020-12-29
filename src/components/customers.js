import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import face from '../assets/img/face.jpg';
import placeholderImg from '../assets/img/placeholder-img.png';
import { ReactComponent as TimesIcon} from '../assets/icons/times.svg';
import { ReactComponent as CheckCircleFill} from '../assets/icons/check-circle-fill.svg';
import { ReactComponent as SearchIcon} from '../assets/icons/search.svg';
import { ReactComponent as ExportIcon} from '../assets/icons/export.svg';
import { ReactComponent as Funnel} from '../assets/icons/funnel.svg';
import { ReactComponent as ArrowLeftShortCircleFill} from '../assets/icons/arrow-left-short-circle-fill.svg';
import { ReactComponent as SpinnerIcon} from '../assets/icons/spinner.svg';
import { ReactComponent as NothingFoundIcon} from '../assets/icons/nothing-found.svg';
import Customer from './customer';
import { getCustomers, searchCustomers } from '../services/customerService';
import errorHandler from '../utils/errorHandler';
import notify from '../utils/notification';
import { useAuth } from './utilities';
import ReactPaginate from 'react-paginate';

const Customers = props => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const auth = useAuth();
  // useCallback ensures that handle error function isn't recreated on every render
  const handleError = useCallback(() => errorHandler(auth), [auth]);
  
  const [customers, setCustomers] = useState(() => Array(0).fill("").map((v, idx) => ({
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
    "documentschecked": null,
    "isnewbankcustomer": null,
    "document_issue_date": "",
    "document_expiry_date" : "",
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
  const [values, setValues] = useState({
    search: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showCustomers, setShowCustomers] = useState("all");
  const [isLoading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const isSearching = useRef(false);

  // useCallback ensures that handle error function isn't recreated on every render
  const fetchCustomers = useCallback(async (channel) => {
    setLoading(true);
    try {
      const result = await getCustomers(channel);
      setLoading(false);
      if(result.error) return notify(result.message, "error");
      channel ? setDisplayedCustomers([...result.result]) :
        setCustomers(prev => [...result.result]);
    } catch (error) {
      handleError(error, notify, () => setLoading(false));
    }
  }, [handleError]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setDisplayedCustomers(customers);
  }, [customers]);

  useEffect(() => {
    let tempCustomers;
    setCurrentPage(1);
    if(showCustomers === "all") tempCustomers = customers;

    if(showCustomers === "active" || showCustomers === "restricted"){
      tempCustomers = customers.filter(({enabled}) => (showCustomers === "active" && enabled) || (showCustomers === "restricted" && !enabled));
    };

    // if(showCustomers === "active"){
    //   tempCustomers = customers.filter(({enabled}) => {
    //     if (showCustomers === "active" && enabled) return true;
    //     // if (showCustomers === "pending" && !accountStatus) return true;
    //     return false;
    //   });
    // };

    if(showCustomers === "pending"){
      tempCustomers = customers.filter(({isnewbankcustomer, livelinesschecked, documentschecked}) => {
        if (showCustomers === "pending" &&
          (isnewbankcustomer === null || livelinesschecked === "PENDING" || documentschecked === null )
        ) return true;
        return false;
      });
    };

    setDisplayedCustomers(tempCustomers);
  }, [showCustomers, customers]);

  const handleNavigateToCustomer = e => {
    const element = e.target;
    if(!element.classList.contains("action-btn")) return;
    const userId = element.dataset.userId;
    // const requestedCustomer = customers[customers.findIndex(v => v.id.toString() === userId)];
    // history.push(`${path}/${userId}`, {requestedCustomer: requestedCustomer});
    history.push(`${path}/${userId}`);
  }

  const itemsPerPage = 5;

  const handleChange = e => {
    const { name, value } = e.target;

    setValues(prev => ({
      ...prev,
      [name]: name === "search" ? value.trim() : value
    }));

    if(name === "search") handleSearchCustomers(value);
  };

  const handleSearchCustomers = async (searchPhrase) => {
    setShowCustomers("all");
    setCurrentPage(1);
    setFilter("");
    if(!searchPhrase){
      isSearching.current = false;
      setLoading(false);
      setDisplayedCustomers(customers);
      return;
    };
    isSearching.current = true;
    setLoading(true);
    try {
      const result = await searchCustomers(searchPhrase);
      setLoading(false);
      if(result.error) return notify(result.message, "error");
      isSearching.current && setDisplayedCustomers(result.result);
      isSearching.current = false;
    } catch (error) {
      handleError(error, notify, () => setLoading(false));
    }
  };

  const handleFilterCustomers = param => {
    setFilter(param);
    fetchCustomers(param);
    setCurrentPage(1);
    setShowCustomers("all");
    setValues(prev => ({
      ...prev,
      search: ""
    }));
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
                NPF Admin
                <i className="arrow down"></i>
              </div>
              <div className="some-container">
                <div className="search-div">
                  <label htmlFor="search"><SearchIcon /></label>
                  <input
                    type="search"
                    className="form-control"
                    name="search"
                    id="search"
                    aria-label="Search for customers"
                    value={values.search}
                    onChange={handleChange}
                    />
                </div>
                {/* <button className="btn export-data-btn">
                  <ExportIcon /> Export Data
                </button> */}
                <button className="btn filter-btn dropdown-toggle"type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {filter === "bvn" ? "BVN" :
                    filter === "phone" ? "Phone" :
                      <><Funnel /> Filter</>}
                </button>
                {/* <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown button
                  </button> */}
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <h5 className="dropdown-header">Filter Customers</h5>
                    <div className="dropdown-divider"></div>
                    <h6 className="dropdown-header">By Registration Mode</h6>
                    <button
                      className={`dropdown-item ${filter === "bvn" ? "active" : ""}`}
                      onClick={e => handleFilterCustomers("bvn")}>
                        BVN
                     </button>
                    <button
                      className={`dropdown-item ${filter === "phone" ? "active" : ""}`}
                      onClick={e => handleFilterCustomers("phone")}>
                        Phone number
                    </button>
                    {filter && <>
                      <div className="dropdown-divider"></div>
                      <button
                      className={`dropdown-item`}
                      onClick={e => handleFilterCustomers("")}>
                        Clear
                      </button></>}
                  </div>
                {/* </div> */}
              </div>
            </div>
          </header>
          <main className="customers-page">
            {(isLoading || displayedCustomers.length === 0) && <div className="searching-block">
              <div className={"svg-holder " + (!isLoading ? "not-loading" : "")}>
                {isLoading ? <SpinnerIcon className="rotating" /> : <NothingFoundIcon />}
              </div>
              {!isLoading && <p>NOTHING FOUND!</p>}
            </div>}
            {!isLoading && displayedCustomers.length !== 0 && <><table className="table table-borderless">
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

                  const pseudoAccStatus = !v.PND;

                  return(<Fragment key={`${v.user} + ${idx}`}>
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
                            {/* <div className="acc-number">AC/N: {v.accountNumber || "N/A"}</div> */}
                          </div>
                        </div>
                      </td>
                      <td className="bvn font-weight-light">{v.bvnhash || "N/A"}</td>
                      <td className="phone font-weight-light">(234) {v.phone.replace("234", "0")}</td>
                      <td>
                        <span className={`account-status ${pseudoAccStatus ? "active" : "pending"}`}>
                          {pseudoAccStatus ? "ACTIVE" : "PND"}
                        </span>
                      </td>
                      <td>
                        {/* <span className={`liveliness ${v.liveliness ? "provided" : ""}`}>
                          {v.liveliness ? <CheckCircleFill /> : <TimesIcon />}
                          {v.liveliness ? " P" : "Not p"}rovided
                        </span> */}
                        <span className={`liveliness ${v.video_location ? "provided" : ""}`}>
                          {v.video_location ? <CheckCircleFill /> : <TimesIcon />}
                          {v.video_location ? " P" : "Not p"}rovided
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
              <ReactPaginate
                pageCount={Math.ceil(displayedCustomers.length / itemsPerPage) || 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                forcePage={currentPage - 1}
                onPageChange={selectedItem => setCurrentPage(selectedItem.selected + 1)}
                containerClassName="pagination-btns"
                activeLinkClassName="active"
                pageLinkClassName="btn"
                previousLabel={<ArrowLeftShortCircleFill />}
                previousLinkClassName="btn icon"
                nextLabel={<ArrowLeftShortCircleFill style={{transform: "rotateY(180deg)"}}/>}
                nextLinkClassName="btn icon"
                disabledClassName="disabled"
                />
            </div> </>}
          </main>
        </>
      </Route>
      <Route path={`${path}/:userId`} component={Customer} />
    </Switch>
  );
};

export default Customers;