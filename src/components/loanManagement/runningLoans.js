import { Fragment, useState } from "react";
import { ReactComponent as ArrowRightCircle } from "../../assets/icons/arrow-right-circle.svg";
import LoanCustomerCard from "./loanCustomerCard";

const RunningLoans = ({ customers }) => {
  const [showAllRunningLoans, setShowAllRunningLoans] = useState(true);
  return (
    <>
      <div className="running-loans-header row">
        <div className="row col-6 pl-3 ml-1">
          <div className="">
            <label htmlFor="showAllRunningLoans" className="custom-checkbox-container">All Running Loans
              <input
                type="checkbox"
                checked={showAllRunningLoans}
                name="showRunningLoans"
                id="showAllRunningLoans"
                onChange={(e) => setShowAllRunningLoans(e.target.checked)}
              />
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="pl-5">
            <label htmlFor="showRunningLoansPerCustomer" className="custom-checkbox-container">Per Customer
              <input
                type="checkbox"
                checked={!showAllRunningLoans}
                name="showRunningLoansPerCustomer"
                id="showRunningLoansPerCustomer"
                onChange={(e) => setShowAllRunningLoans(!e.target.checked)}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <div className="col-6 export-report-btn-container text-right pr-2">
          <button className="btn btn-primary export-ifrs-btn">
            Export Report (IFRS){" "}
            <span>
              <ArrowRightCircle className="rotate-90" />
            </span>
          </button>
        </div>
      </div>

      <table className="table table-borderless">
        {showAllRunningLoans ? (
          <tbody>
            <tr className="spacer"></tr>
            {customers.map((customer, idx, arr) => {
              return (
                <Fragment key={idx}>
                  <tr className="big-customer-card font-weight-600">
                    <th scope="row" style={{ paddingTop: "40px" }}>
                      <input
                        type="checkbox"
                        name={`selCustomer-${customer.id}`}
                      />
                    </th>
                    <td className="major-details">
                      <div className="row">
                        <div className="customer-img">
                          <img
                            src={customer.photo_location}
                            className=""
                            alt=""
                          />
                        </div>
                        <div className="col">
                          <div className="name font-weight-bold">
                            {customer.name}
                          </div>
                          <div className="email font-weight-light">
                            {customer.email}
                          </div>
                          <div className="acc-number">
                            AC/N: {customer.accno || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="running-loans-container">
                      <table className="table table-borderless">
                        <RunningLoanTableHeader />
                        <tbody>
                          {Array(3)
                            .fill(customer)
                            .map((customer1, idx, arr) => (
                              <LoanCustomerCard
                                key={idx}
                                customerDetails={customer1}
                                shownCustomerCategory="running"
                              >
                                {idx !== arr.length - 1 && (
                                  <tr className="spacer" />
                                )}
                              </LoanCustomerCard>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {idx !== arr.length - 1 && <tr className="spacer" />}
                </Fragment>
              );
            })}
          </tbody>
        ) : (
          <>
            <RunningLoanTableHeader isRunningLoanShownPerCustomer>
              <th scope="col">
                <input type="checkbox" name="selCustomer-all" />
              </th>
            </RunningLoanTableHeader>
            <tbody>
              {customers.map((customer, idx, arr) => {
                return (
                  <LoanCustomerCard
                    key={idx}
                    showMajorDetails
                    customerDetails={customer}
                    shownCustomerCategory="running"
                  >
                    {idx !== arr.length - 1 && <tr className="spacer" />}
                  </LoanCustomerCard>
                );
              })}
            </tbody>
          </>
        )}
      </table>
    </>
  );
};

export default RunningLoans;
function RunningLoanTableHeader({ isRunningLoanShownPerCustomer, children }) {
  return (
    <thead className="color-dark-text-blue">
      <tr>
        {children}
        {isRunningLoanShownPerCustomer && (
          <th scope="col">Customer</th>
        )}
        <th scope="col">Loan Details</th>
        <th scope="col">Repayment Method</th>
        <th scope="col">
          Paid Back &nbsp; &nbsp;
          <span className="dti positive">%</span>
        </th>
        <th scope="col">Application Date</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
  );
}
