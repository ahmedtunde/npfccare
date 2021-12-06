import moment from "moment";
import numeral from "numeral";
import { ReactComponent as ClockIcon } from "../../assets/icons/clock.svg";

const LoanCustomerCard = ({
  customerDetails,
  showMajorDetails,
  shownCustomerCategory,
  children,
}) => {
  return (
    <>
      <tr className="customer-card font-weight-600">
        {showMajorDetails && (
          <>
            <th scope="row" style={{ verticalAlign: "middle" }}>
              <input
                type="checkbox"
                name={`selCustomer-${customerDetails.id}`}
              />
            </th>
            <td className="major-details">
              <div className="row">
                <div className="customer-img col-3">
                  <img
                    src={customerDetails.photo_location}
                    className=""
                    alt=""
                  />
                </div>
                <div className="pl-2">
                  <div className="name font-weight-bold">
                    {customerDetails.name}
                  </div>
                  <div className="email font-weight-light">
                    {customerDetails.email}
                  </div>
                </div>
              </div>
            </td>
          </>
        )}
        {/* Show loan details only when on submitted or inProcess tabs */}
        {(shownCustomerCategory === "submitted" ||
          shownCustomerCategory === "inProcess" ||
          shownCustomerCategory === "running") && (
          <td className="card-loan-details">
            <p>{customerDetails.loan_name}</p>
            <p>
              &#8358; {numeral(customerDetails.loan_amount).format("0,0.00")}
            </p>
          </td>
        )}
        {/* Show Customer Request only when NOT on submitted or inProcess or running tabs */}
        {shownCustomerCategory !== "submitted" &&
          shownCustomerCategory !== "inProcess" &&
          shownCustomerCategory !== "running" && (
            <td className="repay-method">
              <p>
                <span className="font-weight-bold">Amount: &nbsp;&nbsp;</span>
                &#8358;{numeral(customerDetails.loan_amount).format("0,0.00")}
              </p>
              <p>
                <span className="font-weight-bold">Tenure: &nbsp;&nbsp;</span>
                <span>
                  <ClockIcon />
                </span>
                &nbsp;&nbsp;{customerDetails.loan_repayment_tenure}
              </p>
            </td>
          )}

        {/* Show Bank offer only when on approved or paid tabs */}
        {(shownCustomerCategory === "approved" ||
          shownCustomerCategory === "paid") && (
          <td className="repay-method">
            <p>
              <span className="font-weight-bold">Amount: &nbsp;&nbsp;</span>
              &#8358;{numeral(customerDetails.approved_amount).format("0,0.00")}
            </p>
            <p>
              <span className="font-weight-bold">Tenure: &nbsp;&nbsp;</span>
              <span>
                <ClockIcon />
              </span>
              &nbsp;&nbsp;{customerDetails.approved_tenure}
            </p>
          </td>
        )}

        <td className="repay-method">
          <p>{customerDetails.loan_repayment_method}</p>
          <p>
            <span>
              <ClockIcon />
            </span>
            &nbsp;&nbsp;{customerDetails.loan_repayment_tenure}
          </p>
        </td>

        {shownCustomerCategory === "inProcess" && (
          <td
            className={`loan-status ${
              customerDetails.status === "APPROVE" ? "color-green" : ""
            }`}
          >
            {customerDetails.status}
          </td>
        )}

        {/* Hide score/DTI when declined/paid tabs are active */}
        {shownCustomerCategory !== "declined" &&
          shownCustomerCategory !== "paid" && (
            <td>
              <span
                className={`dti ${
                  customerDetails[
                    shownCustomerCategory !== "submitted"
                      ? "score"
                      : "debtToIncome"
                  ] < 50
                    ? "negative"
                    : "positive"
                }`}
              >
                {
                  customerDetails[
                    shownCustomerCategory !== "submitted"
                      ? "score"
                      : "debtToIncome"
                  ]
                }{" "}
                %
              </span>
            </td>
          )}
        {/* Show narrative when declined tab is active */}
        {shownCustomerCategory === "declined" && (
          <td className="font-weight-normal">{customerDetails.narrative}</td>
        )}
        <td>
          {moment(
            customerDetails[
              shownCustomerCategory === "paid"
                ? "date_completed"
                : "application_date"
            ]
          ).format("Do MMMM YYYY")}
        </td>
        {shownCustomerCategory !== "declined" && (
          <td>
            {/* define operation based on active tab */}
            <button
              data-user-id={customerDetails.id}
              data-operation-type={
                shownCustomerCategory === "approved"
                  ? "disburse"
                  : shownCustomerCategory === "paid"
                  ? "schedule"
                  : "view"
              }
              className="btn btn-success action-btn bg-color-green"
            >
              {shownCustomerCategory === "approved"
                ? "Disburse"
                : shownCustomerCategory === "paid"
                ? "Schedule"
                : "View"}
            </button>
          </td>
        )}
      </tr>
      {children}
    </>
  );
};

export default LoanCustomerCard;
