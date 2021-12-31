import { useEffect, useState } from "react";
import { ReactComponent as ArrowRightCircle } from "../../assets/icons/arrow-right-circle.svg";
import { ReactComponent as SpinnerIcon } from "../../assets/icons/spinner.svg";
import { ReactComponent as CheckIcon } from "../../assets/icons/check2-circle.svg";
import { ReactComponent as Binoculars } from "../../assets/icons/binoculars.svg";
import { ReactComponent as FileEarmarkTextFill } from "../../assets/icons/file-earmark-text-fill.svg";
const LoanRightOptions = ({ isScoringActive, setScoringActive, loan }) => {
  const [isLoading, setLoading] = useState({
    lookup: false,
    scoring: false,
  });
  const [signedPdf, setSignedPdf] = useState([]);

  useEffect(() => {
    loan.fileUpload &&
      loan.fileUpload.map((file) => {
        if (file.fileName.includes(".pdf")) {
          setSignedPdf([file]);
        }
      });
  }, [loan.fileUpload]);

  const offerLetter = () => {
    return (
      signedPdf &&
      signedPdf.map((file, idx) => (
        <div className="start-scoring-div">
          <div className="text-center color-dark-text-blue mt-5">
            <div className="binocu-p">
              <span>
                <FileEarmarkTextFill />
              </span>
            </div>
            <p className="font-weight-bold">Customer acceptance letter</p>
            <p className="mb-5">
              Click the button below to download signed customer loan acceptance
              letter
            </p>
            <p key={file.id} className="mt-5">
              <a
                href={file.fileName}
                rel="noreferrer"
                target="_blank"
                download={`Offer-letter${idx + 1}`}
              >
                <button className="start-look-up-btn btn">
                  Download{" "}
                  <span>
                    <ArrowRightCircle />
                  </span>
                  <div className="overlay-div"></div>
                </button>
              </a>
            </p>
          </div>
        </div>
      ))
    );
  };

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
      {offerLetter()}
    </div>
  );
};

export default LoanRightOptions;
