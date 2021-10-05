import { useState } from "react";
import { ReactComponent as ArrowRightCircle } from "../../assets/icons/arrow-right-circle.svg";
import { ReactComponent as SpinnerIcon } from "../../assets/icons/spinner.svg";
import { ReactComponent as CheckIcon } from "../../assets/icons/check2-circle.svg";
import { ReactComponent as Binoculars } from "../../assets/icons/binoculars.svg";
const LoanRightOptions = ({ isScoringActive, setScoringActive}) => {
  const [isLoading, setLoading] = useState({
    lookup: false,
    scoring: false,
  });
  return (
    <div className="loan-right-options col-3 text-center">
      <div className={`credit-lookup-div ${isScoringActive ? "disabled" : ""}`}>
        <div className="binocu-p">
          <span>
            <Binoculars />
          </span>
        </div>
        <p className="font-weight-bold">Credit History Lookup</p>
        <p>Look up this customer's credit history before making a decision</p>
        <p className="mt-5">
          <button className="start-look-up-btn btn">
            Start Lookup
            <span className={`${isLoading.lookup ? "loading" : ""}`}>
              {isLoading.lookup ? (
                <SpinnerIcon className="rotating" />
              ) : (
                <ArrowRightCircle />
              )}
            </span>
            <div className="overlay-div"></div>
          </button>
        </p>
      </div>
      <div className="start-scoring-div">
        <p className="font-weight-bold">Loan appraisal scoring</p>
        <p>
          <button className={`scoring-btn btn ${isScoringActive ? "active" : ""}`} onClick={e => setScoringActive(true)}>
            <span>
              <CheckIcon />
            </span>
            <div className="overlay-div"></div>
            {isScoringActive ? "Finish" : "Start"} Scoring
          </button>
        </p>
        <p className={isScoringActive ? "d-block" : "d-none"}>
          <button
            className="btn btn-outline-danger cancel-scoring-btn d-block"
            onClick={e => setScoringActive(false)}
          >
            Cancel
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoanRightOptions;
