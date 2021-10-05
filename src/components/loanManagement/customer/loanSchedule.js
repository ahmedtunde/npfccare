import React, {Fragment, useEffect, useState} from 'react';
import moment from 'moment';
import { ReactComponent as NothingFoundIcon} from '../../../assets/icons/nothing-found.svg';
import { ReactComponent as SpinnerIcon} from '../../../assets/icons/spinner.svg';
import { ReactComponent as ArrowLeftShortCircleFill} from '../../../assets/icons/arrow-left-short-circle-fill.svg';
import { ReactComponent as ArrowRightShort} from '../../../assets/icons/arrow-right-short.svg';
import notify from '../../../utils/notification';
import errorHandler from '../../../utils/errorHandler';
import { useAuth } from '../../utilities';
import ReactPaginate from 'react-paginate';
import { formatAmount } from '../../utilities';
import face from "../../../assets/img/face.jpg";
import { useHistory } from 'react-router';

const LoanSchedule = props => {
  const history = useHistory();
  const [scheduleEntries, setScheduleEntries] = useState(Array(5).fill("a").map((v, idx) => ({
    date: new Date(),
    deferDate: new Date(),
    totalDue: "",
    totalCap: "",
    principal: "",
    interest: "",
    charge: "",
    tax: "",
    totalPymt: "",
    outstanding: "",
  })));
  const auth = useAuth();
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const handleError = errorHandler(auth);
  
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setLoading] = useState(false);
  const { userId } = props;

  useEffect(() => {
    handleGetCustomerBillings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetCustomerBillings = async (customer_id = userId) => {
    setLoading(true);
    try {
      // const result = await getCustomerBillings(customer_id);
      setLoading(false);
      // if(result.error) return notify(result.message, "error");
      // setScheduleEntries(result.result)
    } catch (error) {
      handleError(error, notify, () => setLoading(false));
    }
  };

  return(
    <>
      <header>
        <div>
          <h1>
            <button onClick={e => history.goBack()} className="btn btn-primary back-btn">
              <ArrowRightShort />
            </button>Customer Repayment Schedule & History
          </h1>
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
        {(isLoading || scheduleEntries.length === 0) && (
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
        {!isLoading && scheduleEntries.length !== 0 && (
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
            <table className="table table-borderless">
              <thead className="color-dark-text-blue">
                <tr>
                  {/* <th scope="col">
                    <input type="checkbox" />
                  </th> */}
                  <th scope="col">Date</th>
                  <th scope="col">Defer Date</th>
                  <th scope="col-3">Total Due</th>
                  <th scope="col">Total Cap</th>
                  <th scope="col">Principal</th>
                  <th scope="col">Interest</th>
                  <th scope="col">Charge</th>
                  <th scope="col-3">Tax</th>
                  <th scope="col">Total Pymt</th>
                  <th scope="col">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                <tr className="spacer" />
                {scheduleEntries.map((v, idx) => {
                  const initialBoundary = ((currentPage - 1) * itemsPerPage) + 1;
                  const finalBoundary = currentPage * itemsPerPage;
                  const itemNumber = idx + 1;
                  if(itemNumber < initialBoundary || itemNumber > finalBoundary) return null;
                  return (
                    <Fragment key={idx}>
                      <tr className="billing-history-card">
                        {/* <th scope="row">
                          <input type="checkbox" />
                        </th> */}
                        <td className="">{moment(v.date).format("DD/MM/YYYY")}</td>
                        <td className="">{moment(v.deferDate).format("DD/MM/YYYY")}</td>
                        <td className="">{formatAmount(v.totalDue)}</td>
                        <td className="">{v.totalCap}</td>
                        <td className="">{formatAmount(v.principal)}</td>
                        <td className="">{formatAmount(v.interest)}</td>
                        <td className="">{formatAmount(v.charge)}</td>
                        <td className="">{formatAmount(v.tax)}</td>
                        <td className="color-sec-green">{formatAmount(v.totalPymt)}</td>
                        <td className="color-red">-{formatAmount(v.outstanding)}</td>
                      </tr>
                      {idx !== scheduleEntries.length - 1 && <tr className="spacer" />}
                    </Fragment >
                  )
                })}
              </tbody>
            </table>
            <div className="audit-history-footer">
              <ReactPaginate
                pageCount={Math.ceil(scheduleEntries.length / itemsPerPage) || 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                forcePage={currentPage - 1}
                onPageChange={selectedItem => setCurrentPage(selectedItem.selected + 1)}
                containerClassName="pagination-btns"
                activeLinkClassName="active"
                pageLinkClassName="btn"
                previousLabel={<ArrowLeftShortCircleFill />}
                previousLinkClassName="btn icon"
                nextLabel={<ArrowLeftShortCircleFill style={{transform: "rotateY(180deg)"}}/>}
                nextLinkClassName="btn icon"
                disabledClassName="disabled"
              />
            </div>
          </>
        )}
      </main>
  </>
  );
};

export default LoanSchedule;