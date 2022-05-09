import React, { useCallback, useState, useEffect } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import ReactPaginate from "react-paginate";
import { ReactComponent as ArrowRightCircle } from "../../assets/icons/arrow-right-circle.svg";
import { ReactComponent as ArrowLeftShortCircleFill } from "../../assets/icons/arrow-left-short-circle-fill.svg";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as SpinnerIcon } from "../../assets/icons/spinner.svg";
import { getAccessToken, getAdminName } from "../../utils/localStorageService";
import { useAuth } from "../../components/utilities";
import errorHandler, { validateToken } from "../../utils/errorHandler";
import face from "../../assets/img/face.jpg";
import CustomerCard from "./customerCard";
import notify from "../../utils/notification";
import { handlePagination, limit } from "../../utils/constant";
import {
  getCustomersInfo,
  searchCustomerDetails,
} from "../../services/adminService";

const AllCustomers = () => {
  const history = useHistory();
  const location = useLocation();
  const adminName = getAdminName();
  const auth = useAuth();
  const { path } = useRouteMatch();
  const token = getAccessToken();

  const handleError = useCallback(
    (errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb),
    [auth]
  );

  const [showSection, setShowSection] = useState("all");
  const [customersInfo, setCustomersInfo] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchEmail, setSearchEmail] = useState("");
  const [isLoading, setLoading] = useState({
    userFull: false,
    submit: false,
    rejectApplication: false,
    approveApplication: false,
    printApplication: false,
    loadPage: false,
  });

  useEffect(() => {
    validateToken(token, history, jwt_decode, auth, notify);
  }, [auth, history, token]);

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

  useEffect(() => {
    const getCustomers = async () => {
      try {
        handleChangeLoading("loadPage", true);

        const response = await getCustomersInfo(1, limit);

        console.log(response);

        if (response.data.status) {
          setTotalPages(response.data.totalPages - 1);
          setCustomersInfo(response.data.data);
          handleChangeLoading("loadPage", false);
          return;
        }
        handleChangeLoading("loadPage", false);
        notify("Something went wrong", "error");
        return;
      } catch (error) {
        console.log(error);
        handleChangeLoading("loadPage", false);
        return;
      }
    };
    getCustomers();
  }, []);

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      handleChangeLoading("loadPage", true);

      const response = await searchCustomerDetails(searchEmail);

      console.log(response.data.data, searchEmail);

      if (response.error) {
        notify(response.message, "error");
        handleChangeLoading("loadPage", false);
        return;
      }

      if (response.data.status) {
        setCustomersInfo([response.data.data]);
        handleChangeLoading("loadPage", false);
        return;
      } else {
        handleChangeLoading("loadPage", false);
        notify("Something went wrong", "error");
        return;
      }
    } catch (error) {
      notify("Invalid email address", "success");
      handleChangeLoading("loadPage", false);
      return;
    }
  };

  return (
    <>
      <header>
        <div>
          <h1>
            {/* <button
              onClick={(e) => history.goBack()}
              className="btn btn-primary back-btn"
            >
              <ArrowRightShort />
            </button> */}
            Customer Management
          </h1>
          <nav>
            {/* eslint-disable jsx-a11y/anchor-is-valid */}
            <a
              className={showSection === "all" ? "active" : ""}
              onClick={(e) => setShowSection("all")}
            >
              Customer Overview
            </a>
            {/* {
              <a
                className={showSection === "create-admin" ? "active" : ""}
                onClick={(e) => {
                  setShowSection("create-admin");
                }}
              >
                Create Admin
              </a>
            } */}
            {/* <a
              className={showSection === "documents" ? "active" : ""}
              onClick={(e) => {
                setShowSection("documents");
              }}
            >
              Documents
            </a> */}
            {/* eslint-enable */}
          </nav>
        </div>

        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            {adminName || `NPF Admin`}
            <i className="arrow down"></i>
          </div>
          <div className="some-container">
            <form onSubmit={handleSearch} className="search-div">
              <label htmlFor="search">
                <SearchIcon />
              </label>
              <input
                type="search"
                className="form-control"
                name="search"
                id="search"
                aria-label="Search by email"
                placeholder="Search by email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </form>
          </div>
        </div>
      </header>

      {isLoading.loadPage === true ? (
        <div className="searching-block">
          <div className="svg-holder">
            <SpinnerIcon className="rotating" />
          </div>
        </div>
      ) : (
        <main className="loan-inprocess-page">
          {showSection === "all" && (
            <>
              <CustomerCard path={path} customersInfo={customersInfo} />
              {customersInfo.length > 0 && (
                <div className="paginate-footer">
                  <ReactPaginate
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    //   forcePage={currentPage - 5}
                    onPageChange={(data) =>
                      handlePagination(data, setCustomersInfo, getCustomersInfo)
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
                </div>
              )}
            </>
          )}
        </main>
      )}
    </>
  );
};

export default AllCustomers;
