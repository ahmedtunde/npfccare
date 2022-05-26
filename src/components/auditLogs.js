import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import jwt_decode from "jwt-decode";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import face from "../assets/img/placeholder-img.png";
import { getAccessToken, getAdminName } from "../utils/localStorageService";
import { handleHideModal, handleOpenModal, useAuth } from "./utilities";
import errorHandler, { validateToken } from "../utils/errorHandler";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";
import notify from "../utils/notification";
import { ReactComponent as SpinnerIcon } from "../assets/icons/spinner.svg";
import { ReactComponent as ExportIcon } from "../assets/icons/export.svg";
import { ReactComponent as NothingFoundIcon } from "../assets/icons/nothing-found.svg";
import CustomerAuditHistory from "../components/customerAuditHistory";
import LoanAuditHistory from "./loanAuditHistory";

const AuditLogs = () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const auth = useAuth();
  const adminName = getAdminName();
  // useCallback ensures that handle error function isn't recreated on every render
  const handleError = useCallback(
    (errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb),
    [auth]
  );

  const [showSection, setShowSection] = useState("all");
  const [isLoading, setLoading] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isDataExporting, setDataExporting] = useState(false);
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const isSearching = useRef(false);
  const token = getAccessToken();

  useEffect(() => {
    validateToken(token, history, jwt_decode, auth, notify);
  }, [auth, history, token]);
  return (
    <>
      <header>
        <div>
          <h1>Audit Logs</h1>

          <nav>
            {/* eslint-disable-next-line */}
            <a
              className={showSection === "all" ? "active" : ""}
              onClick={(e) => setShowSection("all")}
            >
              CBA Logs
            </a>
            {/* eslint-disable-next-line */}
            <a
              className={showSection === "loan" ? "active" : ""}
              onClick={(e) => setShowSection("loan")}
            >
              Loan Logs
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
            {showSection === "all" && (
              <form className="search-div">
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
                  //   value={searchEmail}
                  //   onChange={(e) => setSearchEmail(e.target.value)}
                />
              </form>
            )}
          </div>
        </div>
      </header>
      {!isLoading && showSection === "all" && <CustomerAuditHistory />}
      {!isLoading && showSection === "loan" && <LoanAuditHistory />}
    </>
  );
};

export default AuditLogs;
