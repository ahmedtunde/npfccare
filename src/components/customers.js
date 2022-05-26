// Checkboxes beside customers are commented out to until feature to export data of selected customers is needed
// -----------------------------------------------
import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import jwt_decode from "jwt-decode";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import moment from "moment";
import face from "../assets/img/placeholder-img.png";
import placeholderImg from "../assets/img/placeholder-img.png";
import { ReactComponent as TimesIcon } from "../assets/icons/times.svg";
import { ReactComponent as CheckCircleFill } from "../assets/icons/check-circle-fill.svg";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";
import { ReactComponent as ExportIcon } from "../assets/icons/export.svg";
import { ReactComponent as Funnel } from "../assets/icons/funnel.svg";
import { ReactComponent as ArrowLeftShortCircleFill } from "../assets/icons/arrow-left-short-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../assets/icons/spinner.svg";
import { ReactComponent as NothingFoundIcon } from "../assets/icons/nothing-found.svg";
import Customer from "./customer";
import {
  getCustomers,
  getExportCustomersData,
  searchCustomers,
} from "../services/customerService";
import errorHandler, { validateToken } from "../utils/errorHandler";
import notify from "../utils/notification";
import { handleHideModal, handleOpenModal, useAuth } from "./utilities";
import ReactPaginate from "react-paginate";
import Modal from "./modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAccessToken, getAdminName } from "../utils/localStorageService";

const Customers = (props) => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const auth = useAuth();
  const adminName = getAdminName();
  // useCallback ensures that handle error function isn't recreated on every render
  const handleError = useCallback(
    (errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb),
    [auth]
  );

  const [customers, setCustomers] = useState(() =>
    Array(0)
      .fill("")
      .map((v, idx) => ({
        id: `40${idx}`,
        bvnhash: "",
        firstname: "",
        lastname: "",
        middlename: null,
        phone: "",
        simswapstatus: null,
        otpstatus: null,
        email: "",
        dob: "1999-06-30T00:00:00.000Z",
        pob: null,
        bucket: "npf-mfb",
        photo_location: "",
        photo_key: "40/photo/livelinesscheck.png",
        photo_number: null,
        video_location: "",
        video_key: "",
        signature_location: "",
        signature_key: "",
        document_location: "",
        document_key: "",
        document_number: "",
        document_type_id: 2,
        documentschecked: null,
        isnewbankcustomer: null,
        document_issue_date: "",
        document_expiry_date: "",
        isotpverified: true,
        livelinesschecked: null,
        salary_officer: false,
        force_number: "N/A",
        ippis_number: "N/A",
        address: "N/A",
        has_pin: true,
        transfer_limit: "",
        createdAt: "2020-11-04T15:11:59.904Z",
        updatedAt: "2020-11-06T09:11:40.700Z",
        user: 62,
        accountNumber: "0209525729",
        bvn: "",
        accountStatus: idx === 0 || idx === 2 ? false : true,
        liveliness: idx === 0 || idx === 2 ? false : true,
        PND: v.accountStatus === 1 ? true : false,
        signup_incomplete: false,
      }))
  );

  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [values, setValues] = useState({
    search: "",
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showCustomers, setShowCustomers] = useState("all");
  const [isLoading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    method: "",
    param: "",
  });
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isDataExporting, setDataExporting] = useState(false);
  const isSearching = useRef(false);
  const token = getAccessToken();

  useEffect(() => {
    validateToken(token, history, jwt_decode, auth, notify);
  }, [auth, history, token]);

  // useCallback ensures that handle error function isn't recreated on every render
  const fetchCustomers = useCallback(
    async (method, param) => {
      setLoading(true);
      const data = [
        method === "channel" ? param : "",
        method === "reg_complete" ? param : "",
      ];
      try {
        const result = await getCustomers(...data);
        setLoading(false);
        if (result.error) return notify(result.message, "error");
        // channel ? setDisplayedCustomers([...result.result]) :
        setCustomers((prev) => [...result?.result]);
      } catch (error) {
        handleError(error, notify, () => setLoading(false));
      }
    },
    [handleError]
  );

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setDisplayedCustomers(customers);
  }, [customers]);

  useEffect(() => {
    let tempCustomers;
    setCurrentPage(1);
    if (showCustomers === "all") tempCustomers = customers;

    // for now enabled refers to PND inactive while restricted refers to active PND
    // if(showCustomers === "active" || showCustomers === "restricted"){
    //   tempCustomers = customers.filter(({enabled}) => (showCustomers === "active" && enabled) || (showCustomers === "restricted" && !enabled));
    // };

    if (showCustomers === "active" || showCustomers === "restricted") {
      tempCustomers = customers.filter(
        ({ PND }) =>
          (showCustomers === "active" && !PND) ||
          (showCustomers === "restricted" && PND)
      );
    }

    // if(showCustomers === "active"){
    //   tempCustomers = customers.filter(({enabled}) => {
    //     if (showCustomers === "active" && enabled) return true;
    //     // if (showCustomers === "pending" && !accountStatus) return true;
    //     return false;
    //   });
    // };

    if (showCustomers === "pending") {
      tempCustomers = customers.filter(
        ({ isnewbankcustomer, livelinesschecked, documentschecked }) => {
          if (
            showCustomers === "pending" &&
            (isnewbankcustomer === null ||
              livelinesschecked === "PENDING" ||
              documentschecked === null)
          )
            return true;
          return false;
        }
      );
    }

    setDisplayedCustomers(tempCustomers);
  }, [showCustomers, customers]);

  const handleNavigateToCustomer = (e) => {
    const element = e.target;
    if (!element.classList.contains("action-btn")) return;
    const userId = element.dataset.userId;
    // const requestedCustomer = customers[customers.findIndex(v => v.id.toString() === userId)];
    // history.push(`${path}/${userId}`, {requestedCustomer: requestedCustomer});
    history.push(`${path}/${userId}`);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name.includes("selCustomer")) {
      let id = name.replace("selCustomer-", "");
      id = id === "all" ? id : parseInt(id);
      let newSelectedCustomers;
      if (checked) {
        newSelectedCustomers =
          id === "all" ? ["all"] : [...selectedCustomers, id];
      } else {
        newSelectedCustomers =
          selectedCustomers.includes("all") && id !== "all"
            ? [...displayedCustomers.map(({ id }) => id)]
            : [...selectedCustomers];
        const idx = newSelectedCustomers.findIndex((v) => v === id);
        newSelectedCustomers.splice(idx, 1);
      }
      setSelectedCustomers(newSelectedCustomers);
      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: name === "search" ? value.trim() : value,
    }));

    if (name === "search") handleSearchCustomers(value);
  };

  const handleSearchCustomers = async (searchPhrase) => {
    setShowCustomers("all");
    setCurrentPage(1);
    // setFilter("");
    if (!searchPhrase) {
      isSearching.current = false;
      setLoading(false);
      setDisplayedCustomers(customers);
      return;
    }
    isSearching.current = true;
    setLoading(true);
    try {
      const result = await searchCustomers(searchPhrase);
      setLoading(false);
      if (result.error) return notify(result.message, "error");
      isSearching.current && setDisplayedCustomers(result.result);
      isSearching.current = false;
    } catch (error) {
      handleError(error, notify, () => setLoading(false));
    }
  };

  const handleFilterCustomers = (method, param) => {
    setFilter({ method, param });
    fetchCustomers(method, param);
    setCurrentPage(1);
    setShowCustomers("all");
    setValues((prev) => ({
      ...prev,
      search: "",
    }));
  };

  const handleExportData = async () => {
    setDataExporting(true);
    handleHideModal("#exportCustomersDataModal");
    try {
      const customer_ids = selectedCustomers.includes("all")
        ? []
        : selectedCustomers;
      const start_date = values.start_date
        ? values.start_date.toISOString()
        : "";
      const end_date = values.end_date ? values.end_date.toISOString() : "";
      const requestTime = moment().format("DD-MM-YY");
      // fetch result
      const result = await getExportCustomersData({
        customer_ids,
        start_date,
        end_date,
      });
      setDataExporting(false);
      // handle download
      const url = window.URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Customers ${requestTime}.xlsx`); //or any other extension
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setValues((prev) => ({
          ...prev,
          start_date: null,
          end_date: null,
        }));
      }, 500);
    } catch (error) {
      handleError(error, notify, () => setDataExporting(false));
    }
  };

  return (
    <Switch>
      <Route exact path={path}>
        <>
          <header>
            <div>
              <h1>Customer Accounts Management</h1>

              <nav>
                {/* eslint-disable-next-line */}
                <a
                  className={showCustomers === "all" ? "active" : ""}
                  onClick={(e) => setShowCustomers("all")}
                >
                  All Customers
                </a>
                {/* eslint-disable-next-line */}
                <a
                  className={showCustomers === "active" ? "active" : ""}
                  onClick={(e) => setShowCustomers("active")}
                >
                  Active
                </a>
                {/* eslint-disable-next-line */}
                <a
                  className={showCustomers === "pending" ? "active" : ""}
                  onClick={(e) => setShowCustomers("pending")}
                >
                  Pending
                </a>
                {/* eslint-disable-next-line */}
                <a
                  className={showCustomers === "restricted" ? "active" : ""}
                  onClick={(e) => setShowCustomers("restricted")}
                >
                  Restricted
                </a>
              </nav>
            </div>
            <div>
              <div className="small-admin-details">
                <img src={face} alt="" />
                {adminName || `NPF Admin`}
                <i className="arrow down"></i>
              </div>
              <div className="some-container">
                <div className="search-div">
                  <label htmlFor="search">
                    <SearchIcon />
                  </label>
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
                <button
                  onClick={(e) => handleOpenModal("#exportCustomersDataModal")}
                  id="exportCustomersData"
                  className={`btn export-data-btn d-block ${
                    isDataExporting ? "loading disabled" : ""
                  }`}
                >
                  {isDataExporting ? (
                    <SpinnerIcon className="rotating" />
                  ) : (
                    <>
                      <ExportIcon /> Export Data
                    </>
                  )}
                </button>
                <button
                  className="btn filter-btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {filter.param === "bvn" ? (
                    "BVN"
                  ) : filter.param === "phone" ? (
                    "Phone"
                  ) : filter.param === "bank" ? (
                    "Bank"
                  ) : filter.param === "true" ? (
                    "Completed"
                  ) : filter.param === "false" ? (
                    "InComplete"
                  ) : (
                    <>
                      <Funnel /> Filter
                    </>
                  )}
                </button>
                {/* <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown button
                  </button> */}
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <h5 className="dropdown-header">Filter Customers</h5>
                  <div className="dropdown-divider"></div>
                  <h6 className="dropdown-header">By Registration Mode</h6>
                  <button
                    className={`dropdown-item ${
                      filter.param === "bvn" ? "active" : ""
                    }`}
                    onClick={(e) => handleFilterCustomers("channel", "bvn")}
                  >
                    BVN
                  </button>
                  <button
                    className={`dropdown-item ${
                      filter.param === "phone" ? "active" : ""
                    }`}
                    onClick={(e) => handleFilterCustomers("channel", "phone")}
                  >
                    Phone number
                  </button>
                  <button
                    className={`dropdown-item ${
                      filter.param === "bank" ? "active" : ""
                    }`}
                    onClick={(e) => handleFilterCustomers("channel", "bank")}
                  >
                    Bank
                  </button>
                  <div className="dropdown-divider"></div>
                  <h6 className="dropdown-header">
                    By Registration Completion
                  </h6>
                  <button
                    className={`dropdown-item ${
                      filter.param === "true" ? "active" : ""
                    }`}
                    onClick={(e) =>
                      handleFilterCustomers("reg_complete", "true")
                    }
                  >
                    Completed
                  </button>
                  <button
                    className={`dropdown-item ${
                      filter.param === "false" ? "active" : ""
                    }`}
                    onClick={(e) =>
                      handleFilterCustomers("reg_complete", "false")
                    }
                  >
                    Incomplete
                  </button>
                  {filter.param && (
                    <>
                      <div className="dropdown-divider"></div>
                      <button
                        className={`dropdown-item`}
                        onClick={(e) => handleFilterCustomers("", "")}
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
                {/* </div> */}
              </div>
            </div>
          </header>
          <main className="customers-page">
            {(isLoading || displayedCustomers.length === 0) && (
              <div className="searching-block">
                <div
                  className={"svg-holder " + (!isLoading ? "not-loading" : "")}
                >
                  {isLoading ? (
                    <SpinnerIcon className="rotating" />
                  ) : (
                    <NothingFoundIcon />
                  )}
                </div>
                {!isLoading && <p>NOTHING FOUND!</p>}
              </div>
            )}
            {!isLoading && displayedCustomers.length !== 0 && (
              <>
                <div className="color-dark-text-blue">
                  Customers per page:{" "}
                  <div
                    className="form-group"
                    style={{ display: "inline-block" }}
                  >
                    <select
                      className="form-control"
                      onChange={(e) => {
                        setItemsPerPage(e.target.value);
                        setCurrentPage(1);
                      }}
                      value={itemsPerPage}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={150}>150</option>
                      <option value={200}>200</option>
                    </select>
                  </div>
                </div>
                <table className="table table-borderless table-hover">
                  <thead className="color-dark-text-blue">
                    <tr>
                      {/* <th scope="col">
                    <input type="checkbox" name="selCustomer-all" onChange={handleChange} checked={selectedCustomers.includes("all")} />
                  </th> */}
                      <th scope="col">Customer</th>
                      <th scope="col">BVN</th>
                      <th scope="col">Phone</th>
                      <th scope="col">PND Status</th>
                      <th scope="col">Facial Liveliness Check</th>
                      <th scope="col">Registration Date</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody onClick={handleNavigateToCustomer}>
                    <tr className="spacer" />
                    {displayedCustomers.map((v, idx) => {
                      const initialBoundary =
                        (currentPage - 1) * itemsPerPage + 1;
                      const finalBoundary = currentPage * itemsPerPage;
                      const itemNumber = idx + 1;
                      if (
                        itemNumber < initialBoundary ||
                        itemNumber > finalBoundary
                      )
                        return null;

                      const pseudoAccStatus = !v.PND;
                      const showIncompleteBadge =
                        v.signup_incomplete &&
                        (filter.method !== "reg_complete" ||
                          filter.param !== "false");

                      return (
                        <Fragment key={`${v.user} + ${idx}`}>
                          <tr className="customer-card">
                            {/* <th scope="row" style={{verticalAlign: "middle"}}>
                        <input
                          type="checkbox"
                          name={`selCustomer-${v.id}`}
                          checked={selectedCustomers.includes(v.id) || selectedCustomers.includes("all")}
                          onChange={handleChange}/>
                      </th> */}
                            <td className="major-details">
                              <div className="row">
                                <div className="customer-img">
                                  <img
                                    src={v.photo_location || placeholderImg}
                                    className=""
                                    alt=""
                                  />
                                </div>
                                <div className="col">
                                  <div className="name font-weight-bold">
                                    {v.firstname} {v.lastname}
                                    {showIncompleteBadge && " (Incomplete)"}
                                  </div>
                                  <div className="email font-weight-light">
                                    {v.email}
                                  </div>
                                  {/* <div className="acc-number">AC/N: {v.accountNumber || "N/A"}</div> */}
                                </div>
                              </div>
                            </td>
                            <td className="bvn font-weight-light">
                              {v.bvnhash || "N/A"}
                            </td>
                            <td className="phone font-weight-light">
                              (234) {v.phone.replace("234", "0")}
                            </td>
                            <td>
                              <span
                                className={`account-status ${
                                  pseudoAccStatus ? "active" : "pending"
                                }`}
                              >
                                {pseudoAccStatus ? "INACTIVE" : "ACTIVE"}
                              </span>
                            </td>
                            <td>
                              {/* <span className={`liveliness ${v.liveliness ? "provided" : ""}`}>
                          {v.liveliness ? <CheckCircleFill /> : <TimesIcon />}
                          {v.liveliness ? " P" : "Not p"}rovided
                        </span> */}
                              <span
                                className={`liveliness ${
                                  v.video_location ? "provided" : ""
                                }`}
                              >
                                {v.video_location ? (
                                  <CheckCircleFill />
                                ) : (
                                  <TimesIcon />
                                )}
                                {v.video_location ? " P" : "Not p"}rovided
                              </span>
                            </td>
                            <td>
                              {moment(v.createdAt).format("Do MMMM YYYY")}
                            </td>
                            <td>
                              <button
                                data-user-id={v.id}
                                className="btn btn-success action-btn"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                          {idx !== displayedCustomers.length - 1 && (
                            <tr className="spacer" />
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
                <div className="audit-history-footer">
                  <ReactPaginate
                    pageCount={
                      Math.ceil(displayedCustomers.length / itemsPerPage) || 1
                    }
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    forcePage={currentPage - 1}
                    onPageChange={(selectedItem) =>
                      setCurrentPage(selectedItem.selected + 1)
                    }
                    containerClassName="pagination-btns"
                    activeLinkClassName="active"
                    pageLinkClassName="btn"
                    previousLabel={<ArrowLeftShortCircleFill />}
                    previousLinkClassName="btn icon"
                    nextLabel={
                      <ArrowLeftShortCircleFill
                        style={{ transform: "rotateY(180deg)" }}
                      />
                    }
                    nextLinkClassName="btn icon"
                    disabledClassName="disabled"
                  />
                </div>{" "}
              </>
            )}
          </main>
          <Modal id="exportCustomersDataModal" showCloseX>
            <div className="modal-body">
              <h5
                className="modal-title color-dark-text-blue"
                id={`exportCustomersDataModalLabel`}
              >
                Export Customers Data
              </h5>
              <div className="">
                <p className="color-dark-text-blue">Select date range</p>
                <div className="date-range-container row my-5">
                  <div className="col-6">
                    <DatePicker
                      selected={values.start_date}
                      value={values.start_date}
                      onChange={(date) =>
                        setValues((prev) => ({
                          ...prev,
                          start_date: date,
                        }))
                      }
                      name="start_date"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start Date"
                      className="start_date form-control"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      locale="en-GB"
                      isClearable
                    />
                  </div>

                  <div className="col-6">
                    <DatePicker
                      selected={values.end_date}
                      value={values.end_date}
                      onChange={(date) =>
                        setValues((prev) => ({
                          ...prev,
                          end_date: date,
                        }))
                      }
                      name="end_date"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="End date"
                      className="end_date form-control"
                      minDate={values.start_date}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      locale="en-GB"
                      isClearable
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleExportData}
                    disabled={
                      !values.start_date ||
                      !values.end_date ||
                      (values.start_date &&
                        values.end_date &&
                        moment(values.start_date).isAfter(values.end_date))
                    }
                  >
                    Continue
                  </button>
                  <small className="text-danger d-block">
                    {values.start_date &&
                      values.end_date &&
                      moment(values.start_date).isAfter(values.end_date) &&
                      "Please select an end date that comes after the start date."}
                  </small>
                </div>
              </div>
            </div>
          </Modal>
        </>
      </Route>
      <Route path={`${path}/:userId`} component={Customer} />
    </Switch>
  );
};

export default Customers;
