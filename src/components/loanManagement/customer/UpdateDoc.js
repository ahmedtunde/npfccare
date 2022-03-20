import React, { useEffect, useState } from "react";
import { ReactComponent as FileEarmarkImage } from "../../../assets/icons/file-earmark-image.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";

const Doc = ({ file }) => {
  useEffect(() => {
    console.log(file);
  }, []);

  return (
    <div className="col document-card">
      <img src={file} alt="" />
      <div className="document-info">
        <span>
          <FileEarmarkImage />
        </span>
        <b>Guarantor one - Ebube</b>
      </div>
    </div>
  );
};

const DocInfo = (props) => (
  <div className="col-6">
    <div
      style={{
        margin: "3.5em auto",
        padding: ".5em 3em",
      }}
    >
      <span>
        Guarantor Name: <b>Emeka Chibuike</b>
      </span>
    </div>
  </div>
);

const ButtonDiv = () => {
  return (
    <div className="col" style={{ padding: "0 0 1.5em" }}>
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
  );
};

const DocDetails = ({ file }) => {
  return (
    <div className="col-3">
      <ButtonDiv />
      <Doc file={file} />
    </div>
  );
};

const UpdateDoc = ({ loan }) => {
  const [criteriaFiles, setCriteriaFiles] = useState([]);
  const [guarantorFiles, setGuarantorFiles] = useState([]);

  useEffect(() => {
    const allCriteriaFiles = [];
    loan.fileUpload &&
      loan.fileUpload.map((file) => {
        if (!file.fileName.includes("guarantor")) {
          allCriteriaFiles.push(file.fileName);
          const newFiles = [...new Set(allCriteriaFiles)];
          setCriteriaFiles(newFiles);
          // console.log(file);
        }

        if (file.fileName.includes("guarantor")) {
          setGuarantorFiles([file]);
        }
      });

    console.log(loan);
  }, []);

  return (
    <>
      <div>
        <div className="mb-5">
          <div className="details-header">Guarantor Details</div>
          <div className="row">
            <DocDetails />
            <DocInfo />
          </div>
        </div>
        <div>
          <div className="details-header">Other Documents</div>
          {criteriaFiles.map((file, idx) => (
            <div className="row" style={{ gap: "140px" }}>
              <div key={idx} className="col-3 document-card">
                <a href={file} target="_blank" rel="noreferrer">
                  <img src={file} alt="" />
                </a>
                <div className="document-info">
                  <span>
                    <FileEarmarkImage />
                  </span>
                  <b>{`Document ${idx + 1}`}</b>
                  <div className="scored-div">
                    <CheckCircleFill /> Scored: YES
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UpdateDoc;
