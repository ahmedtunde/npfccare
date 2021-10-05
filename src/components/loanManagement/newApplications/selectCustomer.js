import React, { Fragment, useState, useRef, useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import face from "../../../assets/img/face.jpg";
import placeholderImg from "../../../assets/img/placeholder-img.png";
import { ReactComponent as TimesIcon } from "../../../assets/icons/times.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as ArrowRightShort } from "../../../assets/icons/arrow-right-short.svg";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";
import { ReactComponent as ArrowLeftShortCircleFill } from "../../../assets/icons/arrow-left-short-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../../../assets/icons/spinner.svg";
import { ReactComponent as NothingFoundIcon } from "../../../assets/icons/nothing-found.svg";
import { searchCustomers } from "../../../services/customerService";
import errorHandler from "../../../utils/errorHandler";
import notify from "../../../utils/notification";
import { useAuth } from "../../utilities";
import ReactPaginate from "react-paginate";

const SelectCustomer = (props) => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const auth = useAuth();
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
        createdAt: "2020-11-04T15:11:59.904Z",
        updatedAt: "2020-11-06T09:11:40.700Z",
        user: 62,
        accountNumber: "0209525729",
        bvn: "",
        accountStatus: idx === 0 || idx === 2 ? false : true,
        liveliness: idx === 0 || idx === 2 ? false : true,
        PND: true,
        signup_incomplete: false,
      }))
  );

  const [values, setValues] = useState({
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const isSearching = useRef(false);

  const handleNavigateToCustomer = (e) => {
    const element = e.target;
    if (!element.classList.contains("action-btn")) return;
    const userId = element.dataset.userId;
    history.push(
      `${path.replace("/selectCustomer", "")}?customer_id=${userId}`
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: name === "search" ? value.trim() : value,
    }));

    if (name === "search") handleSearchCustomers(value);
  };

  const handleSearchCustomers = async (searchPhrase) => {
    setCurrentPage(1);
    // setFilter("");
    if (!searchPhrase) {
      isSearching.current = false;
      setLoading(false);
      setCustomers([]);
      return;
    }
    isSearching.current = true;
    setLoading(true);
    try {
      const result = await searchCustomers(searchPhrase);
      setLoading(false);
      if (result.error) return notify(result.message, "error");
      isSearching.current && setCustomers(result.result);
      isSearching.current = false;
    } catch (error) {
      handleError(error, notify, () => setLoading(false));
    }
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
            Select Customer for New Loan
          </h1>
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            NPF Admin
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
          </div>
        </div>
      </header>
      <main className="customers-page">
        {(isLoading || customers.length === 0) && (
          <div className="searching-block">
            <div className={"svg-holder " + (!isLoading ? "not-loading" : "")}>
              {isLoading ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <NothingFoundIcon />
              )}
            </div>
            {!isLoading && (
              <p>
                {values.search
                  ? "NOTHING FOUND!"
                  : "You can search for the customer with the top right search bar"}
              </p>
            )}
          </div>
        )}
        {!isLoading && customers.length !== 0 && (
          <>
            <div className="color-dark-text-blue">
              Customers per page:{" "}
              <div className="form-group" style={{ display: "inline-block" }}>
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
                {customers.map((v, idx) => {
                  const initialBoundary = (currentPage - 1) * itemsPerPage + 1;
                  const finalBoundary = currentPage * itemsPerPage;
                  const itemNumber = idx + 1;
                  if (
                    itemNumber < initialBoundary ||
                    itemNumber > finalBoundary
                  )
                    return null;

                  const pseudoAccStatus = !v.PND;
                  const showIncompleteBadge = v.signup_incomplete;

                  return (
                    <Fragment key={`${v.user} + ${idx}`}>
                      <tr className="customer-card">
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
                            {pseudoAccStatus ? "ACTIVE" : "PND"}
                          </span>
                        </td>
                        <td>
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
                          <button
                            data-user-id={v.id}
                            className="btn btn-success action-btn"
                          >
                            Continue
                          </button>
                        </td>
                      </tr>
                      {idx !== customers.length - 1 && (
                        <tr className="spacer" />
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            <div className="audit-history-footer">
              <ReactPaginate
                pageCount={Math.ceil(customers.length / itemsPerPage) || 1}
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
    </>
  );
};

export default SelectCustomer;
