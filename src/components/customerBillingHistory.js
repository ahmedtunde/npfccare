import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";
import { ReactComponent as NothingFoundIcon } from "../assets/icons/nothing-found.svg";
import { ReactComponent as SpinnerIcon } from "../assets/icons/spinner.svg";
import { ReactComponent as ArrowLeftShortCircleFill } from "../assets/icons/arrow-left-short-circle-fill.svg";
import {
  getCustomerBillings,
  getBillingStatus,
} from "../services/customerService";
import notify from "../utils/notification";
import errorHandler from "../utils/errorHandler";
import { handleOpenModal, useAuth } from "./utilities";
import ReactPaginate from "react-paginate";
import numeral from "numeral";
import BillingStatusModal from "./billingStatusModal";

const CustomerBillingHistory = (props) => {
  const [billingEntries, setBillingEntries] = useState(
    Array(0)
      .fill("a")
      .map((v, idx) => ({
        amountDue: "200.00",
        rrr: "000000",
        status: "FAILED",
        date: "2021-04-14T08:54:08.181Z",
        description: "Eko Prepaid Bills",
        funds_deduction: "",
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
  const auth = useAuth();
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const handleError = errorHandler(auth);

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setLoading] = useState(false);
  const [isStatusFetching, setStatusFetching] = useState("");
  const { userId } = props;

  useEffect(() => {
    handleGetCustomerBillings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetCustomerBillings = async (customer_id = userId) => {
    setLoading(true);
    try {
      const result = await getCustomerBillings(customer_id);
      setLoading(false);
      if (result.error) return notify(result.message, "error");
      setBillingEntries(result.result);
    } catch (error) {
      handleError(error, notify, () => setLoading(false));
    }
  };

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
          <div>
            Entries per page:{" "}
            <div className="form-group" style={{ display: "inline-block" }}>
              <select
                className="form-control"
                onChange={(e) => setItemsPerPage(e.target.value)}
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
          <table className="table table-borderless">
            <thead className="color-dark-text-blue">
              <tr>
                {/* <th scope="col">
              <input type="checkbox" />
            </th> */}
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
              {billingEntries.map((v, idx) => {
                const initialBoundary = (currentPage - 1) * itemsPerPage + 1;
                const finalBoundary = currentPage * itemsPerPage;
                const itemNumber = idx + 1;
                if (itemNumber < initialBoundary || itemNumber > finalBoundary)
                  return null;
                return (
                  <Fragment key={idx}>
                    <tr className="billing-history-card">
                      {/* <th scope="row">
                    <input type="checkbox" />
                  </th> */}
                      <td className="">
                        {moment(v.date).format("MMMM Do, YYYY")}
                      </td>
                      <td className="">{v.description}</td>
                      <td className="">{v.rrr}</td>
                      <td className="">
                        &#8358;{numeral(v.amountDue).format("0,0.00")}
                      </td>
                      <td className="">{v.funds_deduction || "N/A"}</td>
                      <td
                        className={`${
                          v.status === "SUCCESSFUL"
                            ? "text-success"
                            : v.status === "FAILED"
                            ? "text-danger"
                            : ""
                        }`}
                      >
                        {v.status}
                      </td>
                      <td className="text-center">
                        <button
                          data-rrr={v.rrr}
                          className="btn btn-success action-btn"
                          disabled={isStatusFetching}
                        >
                          {isStatusFetching === v.rrr ? (
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
          </div>
        </>
      )}

      <BillingStatusModal billingStatus={billingStatus} />
    </>
  );
};

export default CustomerBillingHistory;
