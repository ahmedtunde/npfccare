import face from "../../assets/img/face.jpg";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as PlusIcon } from "../../assets/icons/icons8-plus.svg";
import { ReactComponent as ArrowLeftShortCircleFill } from "../../assets/icons/arrow-left-short-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../../assets/icons/spinner.svg";
import { ReactComponent as NothingFoundIcon } from "../../assets/icons/nothing-found.svg";
import { ReactComponent as MenuIcon } from "../../assets/icons/menu.svg";
import { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
import LoanCustomerCard from "./loanCustomerCard";
import RunningLoans from "./runningLoans";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getBranches, getPendingLoans } from "../../services/loanService";
import numeral from "numeral";
import { useAuth } from "../utilities";
import { LoanErrorHandler } from "../../utils/errorHandler";
import notify from "../../utils/notification";
import { getAdminName, getBranchId } from "../../utils/localStorageService";
import {
  easternRegion,
  northernRegion,
  westernRegion,
} from "../../utils/constant";

const AllLoanApplications = (props) => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const adminName = getAdminName();

  const auth = useAuth();
  // useCallback ensures that handle error function isn't recreated on every render
  const handleError = useCallback(
    (errorObject, notify, cb) =>
      LoanErrorHandler(auth)(errorObject, notify, cb),
    [auth]
  );

  const [allLoans, setLoans] = useState({
    inProcess: [],
    approved: [],
    declined: [],
    running: [],
    paid: [],
  });

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCustomers, setShowCustomers] = useState("inProcess");
  const [isLoading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchesId, setBranchesId] = useState([]);
  const [dashboardItems, setDashboardItems] = useState({
    new_applications: 0,
    upcoming_disbursement: 0,
    total_loan_value: 0,
    total_repayments: 0,
  });

  const HQ_ID = Number(process.env.REACT_APP_HQ_ID);
  const WQ_ID = Number(process.env.REACT_APP_WQ_ID);
  const NQ_ID = Number(process.env.REACT_APP_NQ_ID);
  const EQ_ID = Number(process.env.REACT_APP_EQ_ID);
  const adminBranchId = getBranchId();
  const idNum = Number(adminBranchId);

  useEffect(() => {
    async function handleGetAllLoanApplications() {
      try {
        setLoading(true);
        const result = await getPendingLoans();
        setLoading(false);
        if (result?.data?.loans) setLoans(result?.data?.loans);
        if (result?.data?.dashboard) setDashboardItems(result?.data?.dashboard);
      } catch (error) {
        handleError(error, notify, () => setLoading(false));
      }
    }

    handleGetAllLoanApplications();

    // console.log('newc', customer);
  }, [handleError]);

  // console.log(branchesId, branches);

  useEffect(() => {
    const northernRegionIds = [];
    const easternRegionIds = [];
    const westernRegionIds = [];
    const handleGetBranches = async () => {
      const getAllBranches = await getBranches();
      if (getAllBranches?.data) setBranches(getAllBranches?.data);
      // console.log(getAllBranches.data);

      if (getAllBranches) {
        branches.forEach((item) => {
          if (northernRegion.includes(item.name.toLowerCase())) {
            northernRegionIds.push(item.id);
          }

          if (easternRegion.includes(item.name.toLowerCase())) {
            easternRegionIds.push(item.id);
          }
          if (westernRegion.includes(item.name.toLowerCase())) {
            westernRegionIds.push(item.id);
          }
        });

        if (easternRegionIds && easternRegionIds.includes(idNum)) {
          setBranchesId(easternRegionIds);
        } else if (northernRegionIds && northernRegionIds.includes(idNum)) {
          setBranchesId(northernRegionIds);
        } else if (westernRegionIds && westernRegionIds.includes(idNum)) {
          setBranchesId(westernRegionIds);
        } else {
          setBranchesId([]);
        }

        // console.log(northernRegionIds, easternRegionIds, branchesId);
      }
    };

    handleGetBranches();
  }, [branches, idNum]);

  const handleNavigateToCustomer = (e) => {
    const element = e.target;
    if (!element.classList.contains("action-btn")) return;
    const userId = element.dataset.userId;
    // console.log(userId);
    // const requestedCustomer = customers[customers.findIndex(v => v.id.toString() === userId)];
    // history.push(`${path}/${userId}`, {requestedCustomer: requestedCustomer});
    if (showCustomers === "inProcess") {
      history.push(`${path}/inProcess?id=${userId}`);
      return;
    }
    if (showCustomers === "running" || showCustomers === "paid") {
      history.push(`${path}/schedule?id=${userId}`);
      return;
    }
    history.push(`${path}/customer?id=${userId}`);
  };

  // let customerCount = 0;

  const customerCount = () => {
    let countArr = [];

    allLoans[showCustomers]?.forEach((customer) => {
      // check.push(customer.approvalBranch_id);

      if (idNum === HQ_ID) {
        countArr.push(customer.approvalBranch_id);
      } else if (idNum === customer.approvalBranch_id) {
        const checkCount = [];
        checkCount.push(customer.approvalBranch_id);
        for (let count of checkCount) {
          if (count) countArr.push(count);
        }
      } else if (
        idNum === NQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        const checkCount = [];
        checkCount.push(customer.approvalBranch_id);
        for (let count of checkCount) {
          if (count) countArr.push(count);
        }
      } else if (
        idNum === WQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        const checkCount = [];
        checkCount.push(customer.approvalBranch_id);
        for (let count of checkCount) {
          if (count) countArr.push(count);
        }
      } else if (
        idNum === EQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        const checkCount = [];
        checkCount.push(customer.approvalBranch_id);
        for (let count of checkCount) {
          if (count) countArr.push(count);
        }
      }
    });

    return countArr.length;
  };

  const upcomingDisbursement = () => {
    let amount = 0;
    allLoans["approved"].forEach((customer) => {
      // console.log(idNum, customer.approvalBranch_id)
      if (idNum === HQ_ID) {
        amount += customer.approved_amount;
      } else if (idNum === customer.approvalBranch_id) {
        amount += customer.approved_amount;
      } else if (
        idNum === NQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      } else if (
        idNum === WQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      } else if (
        idNum === EQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      }
    });
    // handleBranches();
    return amount;
  };

  const totalLoanValue = () => {
    let amount = 0;
    const disbursedLoans = upcomingDisbursement();
    allLoans["running"].forEach((customer) => {
      if (idNum === HQ_ID) {
        amount += customer.approved_amount;
      } else if (idNum === customer.approvalBranch_id) {
        amount += customer.approved_amount;
      } else if (
        idNum === NQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      } else if (
        idNum === WQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      } else if (
        idNum === EQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      }
    });
    return amount + disbursedLoans;
  };

  const totalRepayments = () => {
    let amount = 0;
    allLoans["paid"].forEach((customer) => {
      if (idNum === HQ_ID) {
        amount += customer.approved_amount;
      } else if (idNum === customer.approvalBranch_id) {
        amount += customer.approved_amount;
      } else if (
        idNum === NQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      } else if (
        idNum === WQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      } else if (
        idNum === EQ_ID &&
        branchesId.includes(customer.approvalBranch_id)
      ) {
        amount += customer.approved_amount;
      }
    });
    return amount;
  };

  const applicationCount = () => {
    let appCount;

    switch (showCustomers) {
      case "paid":
        appCount = "Closed Applications";
        break;
      case "approved":
        appCount = "Approved Applications";
        break;
      case "declined":
        appCount = "Declined Applications";
        break;
      case "running":
        appCount = "Running Applications";
        break;
      default:
        appCount = "New Applications";
    }

    return appCount;
  };

  return (
    <>
      <header className="loans-header">
        <div>
          <h1>Loan Management</h1>
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            {adminName || `NPF Admin`}
            <i className="arrow down"></i>
          </div>
        </div>
      </header>
      <div className="loan-dashboard">
        <div className="loan-dashboard-card row">
          <div className="col-3 side-icon">
            <span
              className="side-icon-inner color-purplish bg-color-purplish"
              style={{
                paddingRight: "18px",
                paddingLeft: "18px",
              }}
            >
              <MenuIcon />
            </span>
          </div>
          <div className="card-details col-9">
            <div className="card-content">
              {numeral(customerCount()).format("0,0")}
            </div>
            <div className="card-title">{applicationCount()}</div>
          </div>
        </div>
        <div className="loan-dashboard-card row">
          <div className="col-3 side-icon">
            <span className="side-icon-inner bg-color-blueish color-blueish">
              &#8358;
            </span>
          </div>
          <div className="card-details col-9">
            <div className="card-content">
              &#8358; {numeral(upcomingDisbursement()).format("0,0.00")}
            </div>
            <div className="card-title">Upcoming Disbursement</div>
          </div>
        </div>
        <div className="loan-dashboard-card row">
          <div className="col-3 side-icon">
            <span className="side-icon-inner bg-color-redish color-redish">
              &#8358;
            </span>
          </div>
          <div className="card-details col-9">
            <div className="card-content">
              &#8358; {numeral(totalLoanValue()).format("0,0.00")}
            </div>
            <div className="card-title">Total Loan Value</div>
          </div>
        </div>
        <div className="loan-dashboard-card row">
          <div className="col-3 side-icon">
            <span className="side-icon-inner color-greenish bg-color-greenish">
              &#8358;
            </span>
          </div>
          <div className="card-details col-9">
            <div className="card-content">
              &#8358; {numeral(totalRepayments()).format("0,0.00")}
            </div>
            <div className="card-title">Total Repayments</div>
          </div>
        </div>
      </div>
      <div className="loan-nav-wrapper">
        <nav>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <a
            className={showCustomers === "inProcess" ? "active" : ""}
            onClick={(e) => setShowCustomers("inProcess")}
          >
            In process
          </a>
          <a
            className={showCustomers === "approved" ? "active" : ""}
            onClick={(e) => setShowCustomers("approved")}
          >
            Approved
          </a>
          <a
            className={showCustomers === "declined" ? "active" : ""}
            onClick={(e) => setShowCustomers("declined")}
          >
            Declined
          </a>
          <a
            className={showCustomers === "running" ? "active" : ""}
            onClick={(e) => setShowCustomers("running")}
          >
            Running
          </a>
          <a
            className={showCustomers === "paid" ? "active" : ""}
            onClick={(e) => setShowCustomers("paid")}
          >
            Closed
          </a>
          {/* eslint-enable */}
        </nav>
        <div className="some-container">
          <div className="search-div d-none">
            <label htmlFor="search">
              <SearchIcon />
            </label>
            <input
              type="search"
              className="form-control"
              name="search"
              id="search"
              aria-label="Search for customers"
            />
          </div>
          <button
            className="btn create-admin-btn"
            onClick={(e) => history.push(`${path}/new/selectCustomer`)}
          >
            <span>
              <PlusIcon />
            </span>
            New application
          </button>
        </div>
      </div>

      {branchesId.length > 0 || idNum === HQ_ID ? (
        <main className="loans-page customers-page">
          {(isLoading || allLoans[showCustomers]?.length === 0) && (
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
          {!isLoading && allLoans[showCustomers]?.length > 0 && (
            <>
              <div className="color-dark-text-blue">
                Entries per page:{" "}
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

              {showCustomers === "running" ? (
                <RunningLoans
                  idNum={idNum}
                  HQ_ID={HQ_ID}
                  EQ_ID={EQ_ID}
                  NQ_ID={NQ_ID}
                  branchesId={branchesId}
                  customers={allLoans[showCustomers]}
                />
              ) : (
                <table
                  className="table table-borderless table-hover"
                  onClick={handleNavigateToCustomer}
                >
                  <thead className="color-dark-text-blue">
                    <tr>
                      <th scope="col">
                        <input type="checkbox" name="selCustomer-all" />
                      </th>
                      <th scope="col">Customer</th>
                      {/* Show loan details only when on submitted or inProcess tabs */}
                      {(showCustomers === "submitted" ||
                        showCustomers === "inProcess") && (
                        <th scope="col">Loan Details</th>
                      )}
                      {/* Show Customer Request only when NOT on submitted or inProcess tabs */}
                      {showCustomers !== "submitted" &&
                        showCustomers !== "inProcess" && (
                          <th scope="col">Customer Request</th>
                        )}
                      {/* Show Bank offer only when on approved or paid tabs */}
                      {(showCustomers === "approved" ||
                        showCustomers === "paid") && (
                        <th scope="col">Bank Offer</th>
                      )}
                      <th scope="col">Repayment Method</th>
                      {showCustomers === "submitted" && (
                        <th scope="col">
                          DTI &nbsp; &nbsp;
                          <span className="dti positive">%</span>
                        </th>
                      )}
                      {showCustomers === "inProcess" && (
                        <th scope="col">Status</th>
                      )}
                      {(showCustomers === "inProcess" ||
                        showCustomers === "approved") && (
                        <>
                          <th scope="col">
                            System Score &nbsp; &nbsp;
                            <span className="dti positive">%</span>
                          </th>
                        </>
                      )}
                      {/* Show narrative when declined tab is active */}
                      {showCustomers === "declined" && (
                        <th scope="col" className="col-4">
                          Narrative
                        </th>
                      )}
                      <th scope="col">
                        {showCustomers === "paid"
                          ? "Closed"
                          : "Application Date"}
                      </th>
                      {/* Hide action when declined tab is active */}
                      {showCustomers !== "declined" && (
                        <th scope="col">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="spacer"></tr>
                    {allLoans[showCustomers]?.map((customer, idx, arr) => {
                      const checkItemNumber = [];
                      if (idNum === HQ_ID) {
                        checkItemNumber.push(customer.approvalBranch_id);
                        const initialBoundary =
                          (currentPage - 1) * itemsPerPage + 1;
                        const finalBoundary = currentPage * itemsPerPage;
                        const itemNumber = idx + 1;

                        if (
                          itemNumber < initialBoundary ||
                          itemNumber > finalBoundary
                        )
                          return null;
                        return (
                          <LoanCustomerCard
                            customerDetails={customer}
                            showMajorDetails
                            shownCustomerCategory={showCustomers}
                            key={customer.id}
                          >
                            {idx !== arr.length - 1 && (
                              <tr className="spacer" />
                            )}
                          </LoanCustomerCard>
                        );
                      } else if (idNum === customer.approvalBranch_id) {
                        checkItemNumber.push(customer.approvalBranch_id);
                        const initialBoundary =
                          (currentPage - 1) * itemsPerPage + 1;
                        const finalBoundary = currentPage * itemsPerPage;
                        const itemNumber = idx + 1;

                        if (
                          itemNumber < initialBoundary ||
                          itemNumber > finalBoundary
                        )
                          return null;
                        return (
                          <LoanCustomerCard
                            customerDetails={customer}
                            showMajorDetails
                            shownCustomerCategory={showCustomers}
                            key={customer.id}
                          >
                            {idx !== arr.length - 1 && (
                              <tr className="spacer" />
                            )}
                          </LoanCustomerCard>
                        );
                      } else if (
                        idNum === NQ_ID &&
                        branchesId.includes(customer.approvalBranch_id)
                      ) {
                        checkItemNumber.push(customer.approvalBranch_id);
                        const initialBoundary =
                          (currentPage - 1) * itemsPerPage + 1;
                        const finalBoundary = currentPage * itemsPerPage;
                        const itemNumber = idx + 1;

                        if (
                          itemNumber < initialBoundary ||
                          itemNumber > finalBoundary
                        )
                          return null;
                        return (
                          <LoanCustomerCard
                            customerDetails={customer}
                            showMajorDetails
                            shownCustomerCategory={showCustomers}
                            key={customer.id}
                          >
                            {idx !== arr.length - 1 && (
                              <tr className="spacer" />
                            )}
                          </LoanCustomerCard>
                        );
                      } else if (
                        idNum === EQ_ID &&
                        branchesId.includes(customer.approvalBranch_id)
                      ) {
                        checkItemNumber.push(customer.approvalBranch_id);
                        const initialBoundary =
                          (currentPage - 1) * itemsPerPage + 1;
                        const finalBoundary = currentPage * itemsPerPage;
                        const itemNumber = idx + 1;

                        if (
                          itemNumber < initialBoundary ||
                          itemNumber > finalBoundary
                        )
                          return null;
                        return (
                          <LoanCustomerCard
                            customerDetails={customer}
                            showMajorDetails
                            shownCustomerCategory={showCustomers}
                            key={customer.id}
                          >
                            {idx !== arr.length - 1 && (
                              <tr className="spacer" />
                            )}
                          </LoanCustomerCard>
                        );
                      } else if (
                        idNum === WQ_ID &&
                        branchesId.includes(customer.approvalBranch_id)
                      ) {
                        checkItemNumber.push(customer.approvalBranch_id);
                        const initialBoundary =
                          (currentPage - 1) * itemsPerPage + 1;
                        const finalBoundary = currentPage * itemsPerPage;
                        const itemNumber = idx + 1;

                        if (
                          itemNumber < initialBoundary ||
                          itemNumber > finalBoundary
                        )
                          return null;
                        return (
                          <LoanCustomerCard
                            customerDetails={customer}
                            showMajorDetails
                            shownCustomerCategory={showCustomers}
                            key={customer.id}
                          >
                            {idx !== arr.length - 1 && (
                              <tr className="spacer" />
                            )}
                          </LoanCustomerCard>
                        );
                      }
                    })}
                  </tbody>
                </table>
              )}
              <div className="paginate-footer">
                <ReactPaginate
                  pageCount={Math.ceil(
                    allLoans[showCustomers]?.length / itemsPerPage
                  )}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  forcePage={currentPage - 5}
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
              </div>
            </>
          )}
        </main>
      ) : (
        <div className="searching-block">
          <div className={"svg-holder " + (!isLoading ? "not-loading" : "")}>
            {isLoading ? (
              <SpinnerIcon className="rotating" />
            ) : (
              <NothingFoundIcon />
            )}
          </div>
          {!isLoading && <p>NOTHING FOUND!</p>}
        </div>
      )}
    </>
  );
};

export default AllLoanApplications;
