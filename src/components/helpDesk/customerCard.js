import React, { useEffect, useState } from "react";
import { getCommentByLoanId } from "../../services/loanService";
import { ReactComponent as NothingFoundIcon } from "../../assets/icons/nothing-found.svg";
import notify from "../../utils/notification";
import { getAllAdminProfiles } from "../../services/adminService";
import {
  useHistory,
  useLocation,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import placeholderImg from "../../assets/img/placeholder-img.png";

const CustomerCard = ({ customersInfo, path }) => {
  const history = useHistory();

  const handleNavigateToCustomerDetails = (id) => {
    history.push(`${path}/customerDetails?id=${id}`);
    return;
  };

  const handleNavigateToAdminDetails = (id) => {
    history.push(`${path}/adminDetails?id=${id}`);
    return;
  };

  return (
    <>
      {customersInfo && customersInfo.length > 0 ? (
        <table
          className="table table-borderless admin-table-hover table-hover"
          // onClick={handleNavigateToCustomer}
        >
          <thead className="color-dark-text-blue">
            <tr>
              <th scope="col">Customer</th>

              <th scope="col">Phone Number</th>

              <th scope="col">BVN</th>

              <th scope="col">Gender</th>

              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="spacer"></tr>
            {customersInfo &&
              customersInfo.map((data) => (
                <tr
                  onClick={() => handleNavigateToCustomerDetails(data.id)}
                  key={data.id}
                  className="customer-card font-weight-600"
                >
                  <td className="major-details">
                    <div className="row">
                      <div className="customer-img col-3">
                        <img
                          src={data.photo_location || placeholderImg}
                          className=""
                          alt="customer-img"
                        />
                      </div>
                      <div className="pl-2">
                        <div className="name font-weight-bold">
                          {`${data.firstname} ${data.lastname}`}
                        </div>
                        <div className="email font-weight-light">
                          {data.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="repay-method">
                    <p>{data.phone}</p>
                  </td>

                  <td className="repay-method">
                    <p>{data.bvnhash}</p>
                  </td>

                  <td className="repay-method">
                    <p>{data.gender}</p>
                  </td>
                  <td>
                    {/* define operation based on active tab */}
                    <button
                      onClick={() => handleNavigateToAdminDetails(data.id)}
                      className="btn btn-success action-btn bg-color-green"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="no-comment">
          <p>NO CUSTOMER FOUND!</p>
        </div>
      )}
    </>
  );
};

export default CustomerCard;
