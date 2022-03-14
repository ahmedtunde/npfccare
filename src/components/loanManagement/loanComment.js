import React, { useEffect, useState } from "react";
import { getCommentByLoanId } from "../../services/loanService";
import { ReactComponent as NothingFoundIcon } from "../../assets/icons/nothing-found.svg";
import notify from "../../utils/notification";

const LoanComments = ({ loanAppId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const response = await getCommentByLoanId(loanAppId);

        if (response) {
          if (response.status === "success") {
            setComments(response.data);
            return;
          }
          console.log(response);

          notify(response.error, "error");
          return;
        }
      } catch (error) {
        console.log(error);
        // notify("No loan comment found", "error");
        return;
      }
    };

    getAllComments();
  }, []);

  return (
    <>
      <h1 className="comment-header">Loan Officers Comments</h1>
      {comments.length > 0 ? (
        <table
          className="table table-borderless table-hover"
          // onClick={handleNavigateToCustomer}
        >
          <thead className="color-dark-text-blue">
            <tr>
              <th scope="col">Staff Name</th>

              <th scope="col">Rank</th>

              <th scope="col">Branch</th>

              <th scope="col">Comment</th>
            </tr>
          </thead>
          <tbody>
            <tr className="spacer"></tr>
            {comments &&
              comments.map((data) => (
                <tr className="customer-card font-weight-600">
                  <td className="repay-method">
                    <p>{data.full_name}</p>
                  </td>

                  <td className="repay-method">
                    <p>{data.rank}</p>
                  </td>

                  <td className="repay-method">
                    <p>{data.staff_branch}</p>
                  </td>

                  <td className="repay-method">
                    <p>{data.comment}</p>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="no-comment">
          <p>NO COMMENT FOUND!</p>
        </div>
      )}
    </>
  );
};

export default LoanComments;
