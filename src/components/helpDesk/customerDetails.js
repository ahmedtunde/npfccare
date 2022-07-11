import React, { useCallback, useState, useEffect } from "react";
import {
  useHistory,
  useLocation,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ReactComponent as ArrowRightCircle } from "../../assets/icons/arrow-right-circle.svg";
import { ReactComponent as ArrowRightShort } from "../../assets/icons/arrow-right-short.svg";
import { ReactComponent as TimesCircleFill } from "../../assets/icons/times-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../../assets/icons/spinner.svg";
import { getAccessToken, getAdminName } from "../../utils/localStorageService";
import { useAuth } from "../../components/utilities";
import errorHandler, { validateToken } from "../../utils/errorHandler";
import face from "../../assets/img/placeholder-img.png";
import notify from "../../utils/notification";
import placeholderImg from "../../assets/img/placeholder-img.png";
import {
  editCustomerInfo,
  getAdminProfileDetails,
  getAdminRoles,
  getCustomerDetails,
  updateAdminProfile,
} from "../../services/adminService";
import { getBranches, getRoles } from "../../services/loanService";

function CustomerDetails() {
  const history = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
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
  const [customerDetail, setCustomerDetail] = useState({});
  const [selecedDate, setSelectDate] = useState(null);
  const [hideDob, setHideDob] = useState(false);
  const [hideBranch, setHideBranch] = useState(false);
  const [branch, setBranch] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [middlename, setMiddlename] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [bvnhash, setBvnhash] = useState(null);
  const [pob, setPob] = useState(null);
  const [rank, setRank] = useState(null);
  const [genotype, setGenotype] = useState(null);
  const [branchId, setBranchId] = useState("");
  const [bloodGroup, setBloodGroup] = useState(null);
  const [securityNumber, setSecurityNumber] = useState(null);
  const [nhisNumber, setNhisNumber] = useState(null);
  const [gender, setGender] = useState(null);
  // const [transfer_limit, setTransfer_Limit] = useState(null);


  const searchParams = new URLSearchParams(search);
  const id = searchParams.get("id");

  const token = getAccessToken();

  useEffect(() => {
    validateToken(token, history, jwt_decode, auth, notify);
  }, [auth, history, token]);

  useEffect(() => {
    const handleGetCustomerDetails = async () => {
      try {
        handleChangeLoading("loadPage", true);
        const response = await getCustomerDetails(id);
        const result = await getBranches();

        if (response.data && response.data.status) {
          setCustomerDetail(response.data.data);
          setBranch(result.data);
          handleChangeLoading("loadPage", false);
          return;
        }

        console.log(response);
      } catch (error) {
        console.log(error);
        handleChangeLoading("loadPage", false);
        return;
      }
      handleChangeLoading("loadPage", false);
    };
    handleGetCustomerDetails();
  }, []);

  useEffect(() => {
    branch &&
      branch.forEach((option) => {
        if (parseInt(customerDetail.branch) === option.id) {
          setBranchName(option.name);
        }
      });
  }, []);

  const handleChangeLoading = (name, value) =>
    setLoading((prev) => ({
      ...prev,
      [name]: value,
    }));

  const handleNavigateToCustomerDetails = () => {
    history.push(`/pages/helpDesk`);
    return;
  };

  const editHideDob = () => {
    setHideDob(true);
  };

  const editHideBranch = () => {
    setHideBranch(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleChangeLoading("submit", true);

    try {
      const payload = {
        email,
        firstname,
        middlename,
        lastname,
        phone,
        bvnhash,
        // transfer_limit,
        dob: selecedDate,
        pob,
        branch: !isNaN(branchId) ? parseInt(branchId) : null,
        gender: gender ? gender.toUpperCase() : null,
        rank,
        genotype,
        blood_group: bloodGroup,
        security_number: securityNumber,
        nhis_number: Number(nhisNumber),
      };

      const response = await editCustomerInfo(id, payload);

      console.log(response);

      if (response.error) {
        notify(response.message, "error");
        handleChangeLoading("submit", false);
        return;
      }
      console.log(e, payload);
      notify(response.message, "success");
      handleChangeLoading("submit", false);
      setTimeout(() => {
        handleNavigateToCustomerDetails();
      }, 2500);
      return;
    } catch (error) {
      notify("Something went wrong", "success");
      handleChangeLoading("submit", false);
      return;
    }
  };

  return (
    <>
      <header>
        <div>
          <h1>
            <button
              onClick={() => handleNavigateToCustomerDetails()}
              className="btn btn-primary back-btn"
            >
              <ArrowRightShort />
            </button>
            Customer Details
          </h1>
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            {adminName || `NPF Admin`}
            <i className="arrow down"></i>
          </div>
          {/* <div className="some-container">
            <button
              // disabled={
              //   adminWorkFlowLevel >= loan.loanApp.workFlowLevel ? false : true
              // }
              className={`btn reject-loan-btn ${
                isLoading.rejectApplication ? "loading disabled" : ""
              }`}
            //   onClick={checkDeleteModal}
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
          </div> */}
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
            <div className="left-side col-3">
              <div className="img-holder">
                <img
                  src={customerDetail.photo_location || placeholderImg}
                  alt="customer-img"
                />
              </div>
            </div>
            <div className="loan-details col">
              <div className="details-header">Customer</div>
              <div className="row">
                <div className="col-12 mb-3">First Name:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Middle Name:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Last Name:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Email:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">BVN:</div>
              </div>
              {/* <div className="row">
                <div className="col-12 mb-3">Daily Transfer Limit:</div>
              </div> */}
              <div className="row">
                <div className="col-12 mb-3">Phone Number:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Gender:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Date of Birth:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Place of Birth:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Rank:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Branch:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Genotype:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">Blood Group:</div>
              </div>

              <div className="row">
                <div className="col-12 mb-3">Security Number:</div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">NHIS Number:</div>
              </div>
            </div>
            <div className="personal-details col">
              <div className="details-header">Details</div>
              <div className="row col-9">
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  className="form-control"
                  defaultValue={customerDetail.firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  value={firstname}
                />
              </div>
              <div className="row col-9">
                <input
                  type="text"
                  name="middlename"
                  id="middlename"
                  className="form-control"
                  defaultValue={customerDetail.middlename}
                  onChange={(e) => setMiddlename(e.target.value)}
                  value={middlename}
                />
              </div>
              <div className="row col-9">
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  className="form-control"
                  defaultValue={customerDetail.lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  value={lastname}
                />
              </div>
              <div className="row col-9">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  defaultValue={customerDetail.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>
              <div className="row col-9">
                <input
                  type="bvnhash"
                  name="bvnhash"
                  id="bvnhash"
                  className="form-control"
                  defaultValue={customerDetail.bvnhash}
                  onChange={(e) => {
                    setBvnhash(e.target.value);
                  }}
                  value={bvnhash}
                />
              </div>
              {/* transferlimit */}
              {/* <div className="row col-9">
                <input
                  type="bvnhash"
                  name="bvnhash"
                  id="bvnhash"
                  className="form-control"
                  defaultValue={customerDetail.transfer_limit}
                  onChange={(e) => {
                    setTransfer_Limit(e.target.value);
                  }}
                  value={transfer_limit}
                />
              </div> */}

              <div className="row col-9">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="form-control"
                  defaultValue={customerDetail.phone}
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </div>
              <div className="row col-9">
                <input
                  type="text"
                  name="gender"
                  id="gender"
                  className="form-control"
                  defaultValue={customerDetail.gender}
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                />
              </div>
              <div className="row col-9">
                {!hideDob ? (
                  <input
                    type="text"
                    name="dob"
                    id="dob"
                    className="form-control"
                    defaultValue={moment(customerDetail.dob).format(
                      "DD/MM/YYYY"
                    )}
                    onFocus={editHideDob}
                  />
                ) : (
                  <DatePicker
                    selected={selecedDate}
                    //   value={values.start_date}
                    onChange={(date) => setSelectDate(date)}
                    name="start_date"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select Date"
                    className="start_date form-control"
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    locale="en-GB"
                    isClearable
                  />
                )}
              </div>
              <div className="row col-9">
                <input
                  type="text"
                  name="pob"
                  id="pob"
                  className="form-control"
                  defaultValue={customerDetail.pob}
                  onChange={(e) => setPob(e.target.value)}
                  value={pob}
                />
              </div>

              <div className="row col-9">
                <input
                  type="text"
                  name="rank"
                  id="rank"
                  className="form-control"
                  defaultValue={customerDetail.rank}
                  onChange={(e) => setRank(e.target.value)}
                  value={rank}
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
                <input
                  type="text"
                  name="genotype"
                  id="genotype"
                  className="form-control"
                  defaultValue={customerDetail.genotype}
                  onChange={(e) => setGenotype(e.target.value)}
                  value={genotype}
                />
              </div>

              <div className="row col-9">
                <input
                  type="text"
                  name="blood_group"
                  id="blood_group"
                  className="form-control"
                  defaultValue={customerDetail.blood_group}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  value={bloodGroup}
                />
              </div>

              <div className="row col-9">
                <input
                  type="text"
                  name="security_number"
                  id="security_number"
                  className="form-control"
                  defaultValue={customerDetail.security_number}
                  onChange={(e) => setSecurityNumber(e.target.value)}
                  value={securityNumber}
                />
              </div>

              <div className="row col-9">
                <input
                  type="number"
                  name="nhis_number"
                  id="nhis_number"
                  className="form-control"
                  defaultValue={customerDetail.nhis_number}
                  onChange={(e) => setNhisNumber(e.target.value)}
                  value={nhisNumber}
                />
              </div>

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
}

export default CustomerDetails;
