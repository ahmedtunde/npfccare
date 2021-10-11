import React, { useEffect, useState } from "react";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";
import { ReactComponent as ArrowRightShort } from "../../../assets/icons/arrow-right-short.svg";

const NumberDiv = (props) => {
  const [number, setNumber] = useState(null);

  useEffect(() => {
    if (number != null) {
      alert(number);
    }
  }, [number]);

  return (
    <div className="col">
      <div className="num-div">
        {props.num &&
          props.num.map((content) => (
            <span onClick={() => setNumber(content)}>{content || 0}</span>
          ))}
      </div>
    </div>
  );
};

const DetailDiv = (props) => (
  <>
    <div className="row">
      <div className="col-5 mb-1">
        Significant change in interest rate because of changes in credit risk
        since initial recognition:
      </div>
      <div className="col-2">Yes</div>
      <div className="col">
        <div>
          <button
            className="btn py-1"
            style={{
              backgroundColor: "#2dbe7e",
              color: "#fff",
              borderRadius: "50px",
              padding: "0 1.5em",
              marginRight: "1em",
            }}
          >
            <CheckCircleFill /> Yes
          </button>
          <button
            className="btn py-1"
            style={{
              border: "1px solid red",
              color: "red",
              borderRadius: "50px",
              padding: "0 1.5em",
            }}
          >
            <TimesCircleFill /> No
          </button>
        </div>
      </div>
    </div>
  </>
);

const UpdateScore = (props) => {
  return (
    <>
      <div className="loan-details col">
        <div className="mb-5">
          <div className="details-header">Loan Selector</div>
          <div className="row">
            <div class="dropdown" style={{ width: "40%", outline: "none" }}>
              <button
                class="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{
                  border: "1px solid #ccc",
                  outline: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  padding: "0.8em 1em",
                  width: "100%",
                  fontWeight: "600",
                }}
              >
                Agriculture & forestry
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">
                  Action
                </a>
                <a class="dropdown-item" href="#">
                  Another action
                </a>
                <a class="dropdown-item" href="#">
                  Something else here
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="details-header">More Details</div>
          <div style={{ width: "60%" }}>
            <div className="row">
              <div className="col-5 mb-1">Customer Age:</div>
              <div className="col-2">48</div>
              <NumberDiv num={[1, 2, 3, 4, 5]} />
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <div className="row">
              <div className="col-3 mb-1">Customer BVN:</div>
              <div className="col-3">488909084875</div>
              <div className="col">
                <div>
                  <button
                    className="btn py-1"
                    style={{
                      backgroundColor: "#2dbe7e",
                      color: "#fff",
                      borderRadius: "50px",
                      padding: "0 1.5em",
                      marginRight: "1em",
                    }}
                  >
                    <CheckCircleFill /> Yes
                  </button>
                  <button
                    className="btn py-1"
                    style={{
                      border: "1px solid red",
                      color: "red",
                      borderRadius: "50px",
                      padding: "0 1.5em",
                    }}
                  >
                    <TimesCircleFill /> No
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: "65%" }}>
            <div className="row">
              <div className="col-5 mb-1">Loan repayment as a % of salary:</div>
              <div className="col-2">50%</div>
              <NumberDiv num={[5, 10, 15, 20, 30]} />
            </div>
          </div>
          <div style={{ width: "65%" }}>
            <div className="row">
              <div className="col-5 mb-1">Existing loan exposure:</div>
              <div className="col-2">50%</div>
              <NumberDiv num={[5, 10, 15, 20, 30]} />
            </div>
          </div>
          <div style={{ width: "70%" }}>
            <div className="row">
              <div className="col-5 mb-1">Date of Enlistment:</div>
              <div className="col-3">12/02/2021</div>
              <NumberDiv num={[1, 2, 3, 4, 5]} />
            </div>
          </div>
          <div style={{ width: "65%" }}>
            <div className="row">
              <div className="col-5 mb-1">Employer type:</div>
              <div className="col-3">Federal</div>
              <NumberDiv num={[1, 2, 3]} />
            </div>
          </div>
          <div style={{ width: "65%" }}>
            <div className="row">
              <div className="col-5 mb-1">Default:</div>
              <div className="col-3">13days</div>
              <NumberDiv num={[1, 2, 3, 4, 5]} />
            </div>
          </div>
        </div>
      </div>
      <div className="loan-details col">
        <div className="details-header">Behavioral Details</div>
        <DetailDiv />
        <DetailDiv />
        <DetailDiv />
        <DetailDiv />
        <div
          style={{
            margin: "2em 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <span>Continue Scoring</span>
          <button className="btn btn-info">
            Score Documents <ArrowRightShort />
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateScore;
