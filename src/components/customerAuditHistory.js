import React, {Fragment, useState} from 'react';
import numeral from 'numeral';
import { ReactComponent as ArrowLeftShortCircleFill} from '../assets/icons/arrow-left-short-circle-fill.svg';

const CustomerAuditHistory = props => {
  const auditEntries = Array(1).fill("a").map((v, idx) => ({
    user: "43",
    firstname: "Janet",
    lastname: "Bartomeu",
    accountNumber: "0209525729",
    amount: "500,000",
    ref: "NIP09283U2",
    type: idx === 2 || idx === 3 ? "debit" : "credit",
    originBranch: "E-Channels",
    transDate: "20-20-2020",
    narrative: "OWN ACCOUNT TRANSFER/nREF:28410750700000105692"
  }));

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const handleChangeCurrentPage = e => {
    const element = e.target;
    if(element.dataset.operation !== "changePage") return;
    setCurrentPage(parseInt(element.dataset.auditPage));
  };

  return(
    <>
      <table className="table table-borderless">
        <thead className="color-dark-text-blue">
          <tr>
            {/* <th scope="col">
              <input type="checkbox" />
            </th> */}
            <th scope="col">&nbsp;</th>
            <th scope="col">Amount</th>
            <th scope="col">Reference</th>
            <th scope="col">Type</th>
            <th scope="col">Originating Branch</th>
            <th scope="col">Trans. Date</th>
            <th scope="col">Narrative</th>
          </tr>
        </thead>
        <tbody >
          <tr className="spacer" />
          {auditEntries.map((v, idx) => {
            const initialBoundary = ((currentPage - 1) * itemsPerPage) + 1;
            const finalBoundary = currentPage * itemsPerPage;
            const itemNumber = idx + 1;
            if(itemNumber < initialBoundary || itemNumber > finalBoundary) return null;
            return (
              <Fragment key={v.user + idx}>
                <tr className="audit-history-card">
                  {/* <th scope="row">
                    <input type="checkbox" />
                  </th> */}
                  <td className="major-details">
                    <div className="name font-weight-bold">{v.firstname} {v.lastname}</div>
                    <div className="email font-weight-light">{v.email}</div>
                    <div className="acc-number">AC/N: {v.accountNumber}</div>
                  </td>
                  <td className="">&#8358;{numeral(v.amount).format("0,0.00")}</td>
                  <td className="">{v.ref}</td>
                  <td>
                    <span className={`txn-type ${v.type.toLowerCase()}`}>
                      {v.type}
                    </span>
                  </td>
                  <td className="">{v.originBranch}</td>
                  <td className="">{v.transDate}</td>
                  <td className="">
                    {v.narrative.split("/n")[0]} <br/> {v.narrative.split("/n")[1]}
                  </td>
                </tr>
                {idx !== auditEntries.length - 1 && <tr className="spacer" />}
              </Fragment >
            )
          })}
        </tbody>
      </table>
      <div className="audit-history-footer">
        <div className="pagination-btns" onClick={handleChangeCurrentPage}>
          <button
            className={`btn icon ${currentPage === 1 ? "disabled" : ""}`}
            disabled={currentPage === 1}
            data-operation="changePage" data-audit-page={currentPage - 1}>
            <ArrowLeftShortCircleFill />
          </button>
          {Array(Math.ceil(auditEntries.length / itemsPerPage) || 1).fill("a").map((v, idx) => (
            <button data-operation="changePage" data-audit-page={idx + 1} key={idx} className={`btn${currentPage === (idx + 1) ? " active" : ""}`}>
              {idx + 1}
            </button>
          ))}
          <button
            className={`btn icon ${currentPage === (Math.ceil(auditEntries.length / itemsPerPage) || 1) ? "disabled" : ""}`}
            disabled={currentPage === (Math.ceil(auditEntries.length / itemsPerPage) || 1)}
            data-operation="changePage" data-audit-page={currentPage + 1}>
            <ArrowLeftShortCircleFill style={{transform: "rotateY(180deg)"}}/>
          </button>
        </div>
        <div>Print History</div>
      </div>
    </>
  );
};

export default CustomerAuditHistory;