import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { getCommentByLoanId } from "../../services/loanService";
import { ReactComponent as NothingFoundIcon } from "../../assets/icons/nothing-found.svg";
import notify from "../../utils/notification";
import { useAuth } from "../../components/utilities";
import { getAllAdminProfiles } from "../../services/adminService";
import {
  useHistory,
  useLocation,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { validateToken } from "../../utils/errorHandler";
import { getAccessToken } from "../../utils/localStorageService";

const AdminCard = ({ comments, branch, path }) => {
  const history = useHistory();
  const auth = useAuth();
  const token = getAccessToken();

  useEffect(() => {
    validateToken(token, history, jwt_decode, auth, notify);
  }, [auth, history, token]);

  const handleNavigateToAdminDetails = (id) => {
    history.push(`${path}/adminDetails?id=${id}`);
    return;
  };

  console.log(comments);

  return (
    <>
      {comments && comments.length > 0 ? (
        <table
          className="table table-borderless admin-table-hover table-hover"
          // onClick={handleNavigateToCustomer}
        >
          <thead className="color-dark-text-blue">
            <tr>
              <th scope="col">Staff ID</th>

              <th scope="col">Admin Name</th>

              <th scope="col">Email</th>

              <th scope="col">Admin Role</th>

              <th scope="col">Branch</th>

              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="spacer"></tr>
            {comments &&
              comments.map((data) => (
                <tr
                  onClick={() => handleNavigateToAdminDetails(data.id)}
                  key={data.id}
                  className="customer-card font-weight-600"
                >
                  <td className="repay-method">
                    <p>{data.staff_id}</p>
                  </td>

                  <td className="repay-method">
                    <p>{`${data.firstname} ${data.lastname}`}</p>
                  </td>

                  <td className="repay-method">
                    <p>{data.username}</p>
                  </td>

                  <td className="repay-method">
                    {data.AdminUserRoles.map((role) =>
                      role.code !== null && role.code !== "" ? (
                        <p>{`${role.name} (${role.code})`}</p>
                      ) : (
                        <p>{`${role.name}`}</p>
                      )
                    )}
                  </td>

                  <td className="repay-method">
                    {branch &&
                      branch.map(
                        (dtx) =>
                          dtx.id === Number(data.branch) && (
                            <p key={dtx.id}>{dtx.name}</p>
                          )
                      )}
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
          <p>NO ADMIN FOUND!</p>
        </div>
      )}
    </>
  );
};

export default AdminCard;
