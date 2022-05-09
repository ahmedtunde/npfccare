import React, { useCallback, useState, useEffect } from "react";
import {
  useHistory,
  useLocation,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ReactComponent as ArrowRightCircle } from "../../assets/icons/arrow-right-circle.svg";
import { ReactComponent as ArrowRightShort } from "../../assets/icons/arrow-right-short.svg";
import { ReactComponent as TimesCircleFill } from "../../assets/icons/times-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../../assets/icons/spinner.svg";
import { getAccessToken, getAdminName } from "../../utils/localStorageService";
import { useAuth } from "../../components/utilities";
import errorHandler, { validateToken } from "../../utils/errorHandler";
import face from "../../assets/img/face.jpg";
import notify from "../../utils/notification";
import {
  getAdminProfileDetails,
  getAdminRoles,
  updateAdminProfile,
} from "../../services/adminService";
import { getBranches, getRoles } from "../../services/loanService";
import { DeleteModal } from "../../components/loanManagement/customer/approvalModal";

const AdminDetails = () => {
  const history = useHistory();
  const location = useLocation();
  const auth = useAuth();
  const { search } = location;
  const adminName = getAdminName();
  const [isLoading, setLoading] = useState({
    userFull: false,
    submit: false,
    rejectApplication: false,
    approveApplication: false,
    printApplication: false,
    loadPage: false,
  });
  const [adminDetails, setAdminDetails] = useState({});
  const [branch, setBranch] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState(null);
  const [loanWorkFlow, setLoanWorkFlow] = useState([]);
  const [workFlow, setWorkFlow] = useState("");
  const [hideBranch, setHideBranch] = useState(false);
  const [hideWorkFlow, setHideWorkFlow] = useState(false);
  const [loanOfficerCode, setLoanOfficerCode] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [hideAdminRole, setHideAdminRole] = useState(false);
  const [deleteModalBtn, setDeleteModalBtn] = useState(false);
  const [staffId, setStaffId] = useState(null);
  const [rank, setRank] = useState(null);
  const [adminRole, setAdminRole] = useState("");
  const [deleteData, setDeleteData] = useState({});
  const searchParams = new URLSearchParams(search);
  const id = searchParams.get("id");

  const token = getAccessToken();

  useEffect(() => {
    validateToken(token, history, jwt_decode, auth, notify);
  }, [auth, history, token]);

  useEffect(() => {
    setHideBranch(false);
    setHideAdminRole(false);
    setDeleteModalBtn(false);

    const handleGetAdminProfileDetails = async () => {
      try {
        handleChangeLoading("loadPage", true);
        const response = await getAdminProfileDetails(id);
        const result = await getBranches();
        const roles = await getAdminRoles();
        const workFlow = await getRoles();

        if (response.data && response.data.status) {
          console.log(response.data);
          setAdminDetails(response.data.data);
          setBranch(result.data);
          setRoles(roles.result);
          setLoanWorkFlow(workFlow.data);
          handleChangeLoading("loadPage", false);
          return;
        }
      } catch (error) {
        console.log(error);
        handleChangeLoading("loadPage", false);
        return;
      }
      handleChangeLoading("loadPage", false);
    };
    handleGetAdminProfileDetails();
  }, []);

  useEffect(() => {
    branch &&
      branch.forEach((option) => {
        if (parseInt(adminDetails.branch) === option.id) {
          setBranchName(option.name);
        }
      });

    adminDetails.AdminUserRoles &&
      adminDetails.AdminUserRoles.forEach((option) => {
        setRoleName(option.name);

        loanWorkFlow &&
          loanWorkFlow.forEach((data) => {
            if (option.code === data.code) {
              setWorkFlow(data.name);
            }
          });
      });
  }, [adminDetails.AdminUserRoles, adminDetails.branch, branch, loanWorkFlow]);

  const editHideBranch = () => {
    setHideBranch(true);
  };

  const editHideAdminRole = () => {
    setHideAdminRole(true);
  };

  const editHideWorkFlow = () => {
    setHideWorkFlow(true);
  };

  const handleEventSelect = async (e) => {
    e.preventDefault();

    if (e.target.name === "role") {
      setWorkFlow(e.target.value);
    }

    if (e.target.value !== "LOAN OFFICER") {
      setLoanOfficerCode("");
    }

    setRoleName(e.target.value);
  };

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleChangeLoading("submit", true);
    let getRoleId = null;
    try {
      roles &&
        roles.forEach((option) => {
          if (roleName === option.name) {
            getRoleId = option.id;
          }
        });

      const payload = {
        email,
        firstName,
        lastName,
        phoneNumber,
        branchId: branchId,
        roleName,
        roleId: !isNaN(getRoleId) ? parseInt(getRoleId) : null,
        loanOfficerCode,
        staffId,
        rank,
      };

      const response = await updateAdminProfile(id, payload);

      if (response.error) {
        notify(response.message, "error");
        handleChangeLoading("submit", false);
        return;
      }
      console.log(e, payload);
      notify(response.message, "success");
      handleChangeLoading("submit", false);
      setTimeout(() => {
        history.push("/pages/superAdmin");
      }, 2500);
      return;
    } catch (error) {
      notify("Something went wrong", "success");
      handleChangeLoading("submit", false);
      return;
    }
  };

  const handleDeleteModal = () => {
    return (
      <DeleteModal
        deleteModalBtn={deleteModalBtn}
        setDeleteModalBtn={setDeleteModalBtn}
        deleteData={deleteData}
      />
    );
  };

  const checkDeleteModal = () => {
    setDeleteModalBtn((prev) => !prev);

    const data = {
      id: id,
      adminName: adminDetails.firstname,
      adminRole: roleName,
    };

    setDeleteData(data);
  };

  console.log(adminDetails);

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
            Admin Details
          </h1>
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            {adminName || `NPF Admin`}
            <i className="arrow down"></i>
          </div>
          <div className="some-container">
            <button
              // disabled={
              //   adminWorkFlowLevel >= loan.loanApp.workFlowLevel ? false : true
              // }
              className={`btn reject-loan-btn ${
                isLoading.rejectApplication ? "loading disabled" : ""
              }`}
              onClick={checkDeleteModal}
            >
              {isLoading.rejectApplication ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <>
                  <TimesCircleFill /> Delete Profile
                </>
              )}
            </button>
            {handleDeleteModal()}
          </div>
        </div>
      </header>

      {isLoading.loadPage ? (
        <div className="searching-block">
          <div className="svg-holder">
            <SpinnerIcon className="rotating" />
          </div>
        </div>
      ) : (
        <main className="loan-inprocess-page">
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
              {workFlow !== "" && workFlow === "LOAN OFFICER" && (
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
                  defaultValue={adminDetails.staff_id}
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
                  defaultValue={adminDetails.firstname}
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
                  defaultValue={adminDetails.lastname}
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
                  defaultValue={adminDetails.username}
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
                  defaultValue={adminDetails.rank}
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
                  defaultValue={adminDetails.phone}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phoneNumber}
                />
              </div>

              <div className="row col-9">
                {!hideBranch ? (
                  <input
                    type="text"
                    name="branch"
                    id="branch"
                    className="form-control"
                    defaultValue={branchName}
                    onFocus={editHideBranch}
                  />
                ) : (
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
                )}
              </div>

              <div className="row col-9">
                {!hideAdminRole ? (
                  <input
                    type="text"
                    name="role"
                    id="role"
                    className="form-control"
                    defaultValue={roleName}
                    onFocus={editHideAdminRole}
                  />
                ) : (
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
                            <option key={idx + option.code} value={option.name}>
                              {option.name}
                            </option>
                          </>
                        );
                      })}
                  </select>
                )}
              </div>

              {workFlow !== "" && workFlow === "LOAN OFFICER" && (
                <div className="row col-9">
                  {!hideWorkFlow ? (
                    <input
                      type="text"
                      name="workflowlevel"
                      id="workflowlevel"
                      className="form-control"
                      defaultValue={workFlow}
                      onFocus={editHideWorkFlow}
                    />
                  ) : (
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
                            <option key={idx + option.code} value={option.code}>
                              {option.name !== "devnpfuser" && option.name}
                            </option>
                          </>
                        ))}
                    </select>
                  )}
                </div>
              )}
              <button className="btn export-ifrs-btn mt-3">
                Save Changes
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
        </main>
      )}
    </>
  );
};

export default AdminDetails;
