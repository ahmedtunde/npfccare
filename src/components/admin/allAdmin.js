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
import AdminCard from "../loanManagement/adminCard";
import notify from "../../utils/notification";
import {
  createAdminProfile,
  getAdminRoles,
  getAllAdminProfiles,
  searchAdminProfile,
} from "../../services/adminService";
import {
  getBranches,
  getPendingLoans,
  getRoles,
} from "../../services/loanService";
import {
  generatePassword,
  handlePagination,
  limit,
} from "../../utils/constant";

const AllAdmin = () => {
  const history = useHistory();
  const location = useLocation();
  const adminName = getAdminName();
  const auth = useAuth();
  const { path } = useRouteMatch();

  const handleError = useCallback(
    (errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb),
    [auth]
  );

  const [showSection, setShowSection] = useState("all");
  // const [showAuditHistory, setShowAuditHistory] = useState("all");
  const [isLoading, setLoading] = useState({
    userFull: false,
    submit: false,
    rejectApplication: false,
    approveApplication: false,
    printApplication: false,
    loadPage: false,
  });
  const [comments, setComments] = useState([]);
  const [branch, setBranch] = useState([]);
  const [roles, setRoles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loanWorkFlow, setLoanWorkFlow] = useState([]);
  const [adminRole, setAdminRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [branchId, setBranchId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [loanOfficerCode, setLoanOfficerCode] = useState("");
  const [staffId, setStaffId] = useState("");
  const [rank, setRank] = useState("");
  const [password, setPassword] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const token = getAccessToken();

  useEffect(() => {
    validateToken(token, history, jwt_decode, auth, notify);
  }, [auth, history, token]);

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

  useEffect(() => {
    setAdminRole("");
    const getAllAdmin = async () => {
      try {
        handleChangeLoading("loadPage", true);
        const callLoan = await getPendingLoans();

        if (callLoan?.data?.loans) {
          const response = await getAllAdminProfiles(1, limit);
          const result = await getBranches();
          const roles = await getAdminRoles();
          const workFlow = await getRoles();

          if (response && result) {
            if (response.data.status && result.status === "success") {
              setTotalPages(response.data.totalPages - 1);
              setComments(response.data.data);
              setBranch(result.data);
              setRoles(roles.result);
              setLoanWorkFlow(workFlow.data);
              handleChangeLoading("loadPage", false);
              return;
            }
          }
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

    getAllAdmin();
  }, []);

  const handleEventSelect = async (e) => {
    e.preventDefault();
    if (e.target.name === "role") {
      setAdminRole(e.target.value);
    }
    if (e.target.value !== "LOAN OFFICER") {
      setLoanOfficerCode("");
    }

    setRoleName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleChangeLoading("submit", true);
    let getRoleId;
    try {
      roles &&
        roles.forEach((option) => {
          if (roleName === option.name) {
            getRoleId = option.id;
          }
        });

      const getpassword = await generatePassword(15);
      setPassword(getpassword);

      const payload = {
        email,
        password: getpassword,
        firstName,
        lastName,
        phoneNumber,
        branchId,
        roleName,
        roleId: parseInt(getRoleId),
        loanOfficerCode,
        staffId,
        rank,
      };

      console.log(payload);

      const response = await createAdminProfile(payload);

      console.log(response, getpassword);

      if (response.error) {
        notify(response.message, "error");
        handleChangeLoading("submit", false);
        return;
      }
      console.log(e, payload);
      notify(response.message, "success");
      handleChangeLoading("submit", false);
      setTimeout(() => {
        window.location.reload();
      }, 2500);
      return;
    } catch (error) {
      notify("Something went wrong", "success");
      handleChangeLoading("submit", false);
      return;
    }
  };

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      handleChangeLoading("loadPage", true);

      const response = await searchAdminProfile(searchEmail);

      console.log(response.data.data, searchEmail);

      if (response.error) {
        notify(response.message, "error");
        handleChangeLoading("submit", false);
        return;
      }

      if (response.data.status) {
        setComments([response.data.data]);
        handleChangeLoading("loadPage", false);
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
            Admin Management
          </h1>
          <nav>
            {/* eslint-disable jsx-a11y/anchor-is-valid */}
            <a
              className={showSection === "all" ? "active" : ""}
              onClick={(e) => setShowSection("all")}
            >
              Admin Overview
            </a>
            {
              <a
                className={showSection === "create-admin" ? "active" : ""}
                onClick={(e) => {
                  setShowSection("create-admin");
                }}
              >
                Create Admin
              </a>
            }
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
            {showSection === "all" && (
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
            )}
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
              <AdminCard branch={branch} path={path} comments={comments} />
              {comments.length > 0 && (
                <div className="paginate-footer">
                  <ReactPaginate
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    //   forcePage={currentPage - 5}
                    onPageChange={(data) =>
                      handlePagination(data, setComments, getAllAdminProfiles)
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

          {showSection === "create-admin" && (
            <>
              <form
                onSubmit={handleSubmit}
                className="customer-details row animated fadeIn delay-05s"
              >
                <div className="loan-details col">
                  <div className="details-header">Admin</div>
                  <div className="row">
                    <div className="col-12 mb-3">Staff ID:</div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">First Name:</div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">Last Name:</div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">Email:</div>
                  </div>

                  <div className="row">
                    <div className="col-12 mb-3">Rank:</div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">Phone Number:</div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">Branch:</div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">Admin Role:</div>
                  </div>
                  {adminRole === "LOAN OFFICER" && (
                    <div className="row">
                      <div className="col-12 mb-3">Workflow Level:</div>
                    </div>
                  )}
                </div>
                <div className="personal-details col">
                  <div className="details-header">Details</div>
                  <div className="row col-9">
                    <input
                      type="text"
                      name="staffId"
                      id="staffId"
                      className="form-control"
                      required
                      onChange={(e) => {
                        setStaffId(e.target.value);
                      }}
                      value={staffId}
                    />
                  </div>
                  <div className="row col-9">
                    <input
                      type="text"
                      name="firstname"
                      id="firstname"
                      className="form-control"
                      required
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                    />
                  </div>
                  <div className="row col-9">
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      className="form-control"
                      required
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
                    />
                  </div>
                  <div className="row col-9">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      required
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      value={email}
                    />
                  </div>

                  <div className="row col-9">
                    <input
                      type="text"
                      name="rank"
                      id="rank"
                      className="form-control"
                      required
                      onChange={(e) => {
                        setRank(e.target.value);
                      }}
                      value={rank}
                    />
                  </div>
                  <div className="row col-9">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      className="form-control"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      value={phoneNumber}
                    />
                  </div>
                  <div className="row col-9">
                    <select
                      name="branch"
                      class="btn dropdown-toggle"
                      style={{
                        border: "1px solid #ccc",
                        outline: "none",
                        borderRadius: "10px",
                        fontSize: "14px",
                        padding: "0.8em 1em",
                        width: "100%",
                        fontWeight: "600",
                      }}
                      value={branchId}
                      onChange={(e) => {
                        setBranchId(e.target.value);
                      }}
                    >
                      {branch &&
                        branch.map((option, idx) => (
                          <>
                            <option key={idx + option.code} value={option.id}>
                              {option.name}
                            </option>
                          </>
                        ))}
                    </select>
                  </div>
                  <div className="row col-9">
                    <select
                      name="role"
                      class="btn dropdown-toggle"
                      style={{
                        border: "1px solid #ccc",
                        outline: "none",
                        borderRadius: "10px",
                        fontSize: "14px",
                        padding: "0.8em 1em",
                        width: "100%",
                        fontWeight: "600",
                      }}
                      value={roleName}
                      onChange={(e) => {
                        handleEventSelect(e);
                      }}
                    >
                      {roles &&
                        roles.map((option, idx) => {
                          return (
                            <>
                              <option
                                key={idx + option.code}
                                value={option.name}
                              >
                                {option.name !== "SUSPEND ACCOUNT" &&
                                  option.name}
                              </option>
                            </>
                          );
                        })}
                    </select>
                  </div>
                  {adminRole === "LOAN OFFICER" && (
                    <div className="row col-9">
                      <select
                        name="workflowlevel"
                        class="btn dropdown-toggle"
                        style={{
                          border: "1px solid #ccc",
                          outline: "none",
                          borderRadius: "10px",
                          fontSize: "14px",
                          padding: "0.8em 1em",
                          width: "100%",
                          fontWeight: "600",
                        }}
                        value={loanOfficerCode}
                        onChange={(e) => {
                          setLoanOfficerCode(e.target.value);
                        }}
                      >
                        {loanWorkFlow &&
                          loanWorkFlow.map((option, idx) => (
                            <>
                              <option
                                key={idx + option.code}
                                value={option.code}
                              >
                                {option.name !== "devnpfuser" && option.name}
                              </option>
                            </>
                          ))}
                      </select>
                    </div>
                  )}
                  <button
                    className="btn export-ifrs-btn mt-3"
                    disabled={
                      firstName !== "" &&
                      lastName !== "" &&
                      email !== "" &&
                      branchId !== "" &&
                      staffId !== "" &&
                      rank !== "" &&
                      roleName !== ""
                        ? false
                        : true
                    }
                  >
                    Submit
                    <span className="pl-2">
                      {isLoading.submit ? (
                        <SpinnerIcon className="limit-loading rotating" />
                      ) : (
                        <ArrowRightCircle />
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      )}
    </>
  );
};

export default AllAdmin;
