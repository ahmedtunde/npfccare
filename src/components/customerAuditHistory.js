import React, {Fragment, useEffect, useState} from 'react';
import moment from 'moment';
import { ReactComponent as NothingFoundIcon} from '../assets/icons/nothing-found.svg';
import { ReactComponent as SpinnerIcon} from '../assets/icons/spinner.svg';
import { ReactComponent as ArrowLeftShortCircleFill} from '../assets/icons/arrow-left-short-circle-fill.svg';
import { getCustomerLogs } from '../services/customerService';
import notify from '../utils/notification';
import handleError from '../utils/handleError';
import { useAuth } from './utilities';

const CustomerAuditHistory = props => {
  const [auditEntries, setAuditEntries] = useState(Array(1).fill("a").map((v, idx) => ({
    createdAt: "2020-11-24T09:46:08.757Z",
    customerId: "65",
    endpoint: "/api/v1/auth/sign_in",
    id: 5,
    ip: "8.35.57.9",
    requestBody: "{\"phone\":\"2348067465112\",\"password\":\"897$312game\"}",
    requestHeaders: "{\"content-length\":\"50\",\"total-route-time\":\"6\",\"x-request-start\":\"1606211168313\",\"connect-time\":\"0\",\"via\":\"1.1 vegur\",\"x-forwarded-port\":\"443\",\"x-forwarded-proto\":\"https\",\"x-forwarded-for\":\"8.35.57.9\",\"x-request-id\":\"08682b02-f276-4ae7-a5e0-da1e3f177047\",\"accept-language\":\"en-GB,en-US;q=0.9,en;q=0.8\",\"accept-encoding\":\"gzip, deflate, br\",\"referer\":\"https://npf-web.herokuapp.com/\",\"sec-fetch-dest\":\"empty\",\"sec-fetch-mode\":\"cors\",\"sec-fetch-site\":\"same-origin\",\"origin\":\"https://npf-web.herokuapp.com\",\"content-type\":\"application/json\",\"user-agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36\",\"accept\":\"application/json\",\"connection\":\"close\",\"host\":\"20.42.119.47:8282\"}",
    requestMethod: "POST",
    responseBody: "{\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjAsImN1c3RvbWVyTnVtYmVyIjoiMTAwMjE4NDg1IiwiY29tcGFueUNvZGUiOm51bGwsImVtYWlsIjoiZnJhbmtvcmppMTYxQGdtYWlsLmNvbSIsImZpcnN0bmFtZSI6IkZyYW5rIiwibGFzdG5hbWUiOiJPcmppIiwicGhvbmUiOiIyMzQ4MDY3NDY1MTEyIiwiaWF0IjoxNjA2MjExMTY4LCJleHAiOjE2MDYyMTgzNjh9.j_SnIj4PMaFD6rTNzUUsx36OvSVOe5gF-bhuBQc3D6A\",\"message\":\"Login successful\",\"password_change_required\":false}",
    responseCode: "200",
    responseHeaders: "{\"x-powered-by\":\"Express\",\"access-control-allow-origin\":\"*\"}",
    updatedAt: "2020-11-24T09:46:08.757Z"
  })));
  const auth = useAuth();
  
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setLoading] = useState(false);

  const itemsPerPage = 5;
  const { userId } = props;

  useEffect(() => {
    handleGetCustomerLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeCurrentPage = e => {
    const element = e.target;
    if(element.dataset.operation !== "changePage") return;
    setCurrentPage(parseInt(element.dataset.auditPage));
  };

  const handleGetCustomerLogs = async (customer_id = userId) => {
    setLoading(true);
    try {
      const result = await getCustomerLogs(customer_id);
      setLoading(false);
      if(result.error) return notify(result.message, "error");
      setAuditEntries(result.result)
    } catch (error) {
      handleError(error, notify, () => setLoading(false), auth);
    }
  };

  const handleShowResponseBody = e => {
    const element = e.target;
    if (!element.classList.contains("action-btn")) return;
    const entryId = element.dataset.entryId;
    const entry = auditEntries[entryId];
    let resBody = JSON.parse(entry.responseBody);
    const formattedBody = syntaxHighlight(JSON.stringify(resBody, null, 2));
    const preElement = document.querySelector("pre.res-body-pre");
    preElement.innerHTML = formattedBody;
    document.$("#resBodyModal").modal("show");
  };

  function syntaxHighlight(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  return(
    <>
    {(isLoading || auditEntries.length === 0) &&
      <div className="searching-block">
        <div className={"svg-holder " + (!isLoading ? "not-loading" : "")}>
          {isLoading ? <SpinnerIcon className="rotating" /> : <NothingFoundIcon />}
        </div>
        {!isLoading && <p>NOTHING FOUND!</p>}
      </div>}
    {!isLoading && auditEntries.length !== 0 && <>
      <table className="table table-borderless">
        <thead className="color-dark-text-blue">
          <tr>
            {/* <th scope="col">
              <input type="checkbox" />
            </th> */}
            <th scope="col">Source IP</th>
            <th scope="col">Created At</th>
            <th scope="col-3">URL</th>
            <th scope="col">Response Status</th>
            <th scope="col">Response Body</th>
          </tr>
        </thead>
        <tbody onClick={handleShowResponseBody} >
          <tr className="spacer" />
          {auditEntries.map((v, idx) => {
            const initialBoundary = ((currentPage - 1) * itemsPerPage) + 1;
            const finalBoundary = currentPage * itemsPerPage;
            const itemNumber = idx + 1;
            if(itemNumber < initialBoundary || itemNumber > finalBoundary) return null;
            const parsedResBody = JSON.parse(v.responseBody);
            console.log(itemNumber, parsedResBody);
            return (
              <Fragment key={idx}>
                <tr className="audit-history-card">
                  {/* <th scope="row">
                    <input type="checkbox" />
                  </th>
                  <td className="major-details">
                    <div className="name font-weight-bold">{v.firstname} {v.lastname}</div>
                    <div className="email font-weight-light">{v.email}</div>
                    <div className="acc-number">AC/N: {v.accountNumber}</div>
                  </td>
                  <td className="">&#8358;{numeral(v.amount).format("0,0.00")}</td> */}
                  <td className="">{v.ip}</td>
                  <td className="col-2">{moment(v.createdAt).format("DD/MM/YYYY, h:mm:ss a")}</td>
                  <td className="col-2">{v.endpoint}</td>
                  <td className="">{v.responseCode}</td>
                  <td className="res-body">
                    <p>error: {parsedResBody.error?.toString() || "false"}</p>
                    <button data-entry-id={idx} className="btn btn-success action-btn">
                      View Response Body
                    </button>
                    {/* {responseBody.map(([propt, value], idx) => (
                      <div className="row" key={idx}>
                        <div className="col-4 res-propt text-break">{propt}:</div>
                        <div className="col res-value text-break">{value.toString()}</div>
                      </div>
                    ))} */}
                  </td>
                  {/* <td>
                    <span className={`txn-type ${v.type.toLowerCase()}`}>
                      {v.type}
                    </span>
                  </td>
                  <td className="">{v.originBranch}</td>
                  <td className="">{v.transDate}</td>
                  <td className="">
                    {v.narrative.split("/n")[0]} <br/> {v.narrative.split("/n")[1]}
                  </td> */}
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
            data-operation="changePage"
            data-audit-page={currentPage - 1}>
            <ArrowLeftShortCircleFill />
          </button>
          {Array(Math.ceil(auditEntries.length / itemsPerPage) || 1).fill("a").map((v, idx) => (
            <button
              data-operation="changePage"
              data-audit-page={idx + 1}
              key={idx}
              className={`btn${currentPage === (idx + 1) ? " active" : ""}`}>
              {idx + 1}
            </button>
          ))}
          <button
            className={`btn icon ${currentPage === (Math.ceil(auditEntries.length / itemsPerPage) || 1) ? "disabled" : ""}`}
            disabled={currentPage === (Math.ceil(auditEntries.length / itemsPerPage) || 1)}
            data-operation="changePage"
            data-audit-page={currentPage + 1}>
            <ArrowLeftShortCircleFill style={{transform: "rotateY(180deg)"}}/>
          </button>
        </div>
      </div>
    </>}
    </>
  );
};

export default CustomerAuditHistory;