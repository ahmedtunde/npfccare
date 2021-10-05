import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import face from "../assets/img/face.jpg";
import placeholderImg from "../assets/img/placeholder-img.png";
import { ReactComponent as ArrowLeftShortCircleFill } from "../assets/icons/arrow-left-short-circle-fill.svg";
import { ReactComponent as SpinnerIcon } from "../assets/icons/spinner.svg";
import { ReactComponent as NothingFoundIcon } from "../assets/icons/nothing-found.svg";
import {
  getBillingStatus,
  getFailedBillings,
} from "../services/customerService";
import errorHandler from "../utils/errorHandler";
import notify from "../utils/notification";
import { handleOpenModal, useAuth } from "./utilities";
import ReactPaginate from "react-paginate";
import numeral from "numeral";
import BillingStatusModal from "./billingStatusModal";

const FailedBillings = (props) => {
  const auth = useAuth();
  // useCallback ensures that handle error function isn't recreated on every render
  const handleError = useCallback(
    (errorObject, notify, cb) => errorHandler(auth)(errorObject, notify, cb),
    [auth]
  );

  const [billingEntries, setBillingEntries] = useState(() =>
    Array(0)
      .fill("")
      .map((v, idx) => ({
        user: 54,
        amountDue: "100.00",
        rrr: "",
        status: "INCOMPLETE",
        date: "2021-04-21T09:22:39.830Z",
        responseObject: null,
        description: "",
        funds_deduction: "",
        CustomerUser: {
          locked: false,
          CustomerInfos: [
            {
              id: 54,
              firstname: "",
              lastname: "",
              email: "",
              phone: "",
            },
          ],
        },
      }))
  );
  const [billingStatus, setBillingStatus] = useState({
    rrr: "",
    amountDue: 200,
    chargeFee: 100,
    rrrAmount: 100,
    payerEmail: "",
    payerName: "",
    payerPhone: "",
    description: "",
    currency: "",
    type: "",
    acceptPartPayment: false,
    message: "",
  });
  const [isStatusFetching, setStatusFetching] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // useCallback ensures that handle error function isn't recreated on every render
  const fetchFailedBillings = useCallback(
    async (method, param) => {
      setLoading(true);
      try {
        const result = await getFailedBillings();
        setLoading(false);
        if (result.error) return notify(result.message, "error");
        const tempBillingEntry = result?.result?.filter(
          ({ user }) => user !== null
        );
        setBillingEntries(tempBillingEntry ?? []);
      } catch (error) {
        handleError(error, notify, () => setLoading(false));
      }
    },
    [handleError]
  );

  useEffect(() => {
    fetchFailedBillings();
  }, [fetchFailedBillings]);

  const handleShowBillingStatus = async (e) => {
    const element = e.target;
    if (!element.classList.contains("action-btn")) return;
    const rrr = element.dataset.rrr;
    try {
      setStatusFetching(rrr);
      const result = await getBillingStatus(rrr);
      setStatusFetching("");
      if (result.error) return notify(result.message, "error");
      setBillingStatus({
        ...result.result,
        message: result.message,
      });
      handleOpenModal("#billingStatusModal");
    } catch (error) {
      handleError(error, notify, () => setStatusFetching(""));
    }
  };

  return (
    <>
      <header>
        <div>
          <h1>Failed Billing History</h1>
        </div>
        <div>
          <div className="small-admin-details">
            <img src={face} alt="" />
            NPF Admin
            <i className="arrow down"></i>
          </div>
          <div className="some-container"></div>
        </div>
      </header>
      <main className="customers-page">
        {(isLoading || billingEntries.length === 0) && (
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
        {!isLoading && billingEntries.length !== 0 && (
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
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col-3">RRR</th>
                  <th scope="col">Amount Due</th>
                  <th scope="col">Funds Deduction</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody onClick={handleShowBillingStatus}>
                <tr className="spacer" />
                {billingEntries.map((entry, idx) => {
                  const initialBoundary = (currentPage - 1) * itemsPerPage + 1;
                  const finalBoundary = currentPage * itemsPerPage;
                  const itemNumber = idx + 1;
                  if (
                    itemNumber < initialBoundary ||
                    itemNumber > finalBoundary
                  )
                    return null;
                  if (entry.user === null) return null;

                  const {
                    CustomerUser: {
                      CustomerInfos: [CustomerInfo],
                    },
                  } = entry;

                  return (
                    <Fragment key={`${entry.user} + ${idx}`}>
                      <tr className="customer-card">
                        <td className="major-details">
                          <div className="row">
                            <div className="customer-img">
                              <img
                                src={entry.photo_location || placeholderImg}
                                className=""
                                alt=""
                              />
                            </div>
                            <div className="col">
                              <div className="name font-weight-bold">
                                {CustomerInfo?.firstname}{" "}
                                {CustomerInfo?.lastname}
                              </div>
                              <div className="email font-weight-light">
                                {CustomerInfo?.email}
                              </div>
                              <div className="acc-number">
                                <Link to={`/pages/customers/${entry.user}`}>
                                  View Customer
                                </Link>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="">
                          {moment(entry.date).format("MMMM Do, YYYY")}
                        </td>
                        <td className="">{entry.description}</td>
                        <td className="">{entry.rrr}</td>
                        <td className="">
                          &#8358;{numeral(entry.amountDue).format("0,0.00")}
                        </td>
                        <td className="">{entry.funds_deduction || "N/A"}</td>
                        <td
                          className={`${
                            entry.status === "SUCCESSFUL"
                              ? "text-success"
                              : entry.status === "FAILED"
                              ? "text-danger"
                              : ""
                          }`}
                        >
                          {entry.status}
                        </td>
                        <td className="text-center">
                          <button
                            data-rrr={entry.rrr}
                            className="btn btn-success action-btn"
                            disabled={isStatusFetching}
                          >
                            {isStatusFetching === entry.rrr ? (
                              <SpinnerIcon className="rotating" />
                            ) : (
                              "View"
                            )}
                          </button>
                        </td>
                      </tr>
                      {idx !== billingEntries.length - 1 && (
                        <tr className="spacer" />
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            <div className="audit-history-footer">
              <ReactPaginate
                pageCount={Math.ceil(billingEntries.length / itemsPerPage) || 1}
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
      <BillingStatusModal billingStatus={billingStatus} />
    </>
  );
};

export default FailedBillings;
