import React from "react";
import { ReactComponent as FileEarmarkImage } from "../../../assets/icons/file-earmark-image.svg";
import { ReactComponent as CheckCircleFill } from "../../../assets/icons/check-circle-fill.svg";
import { ReactComponent as TimesCircleFill } from "../../../assets/icons/times-circle-fill.svg";

const Doc = (props) => (
  <div className="col document-card">
    <img src={props.document_location} alt="" />
    <div className="document-info">
      <span>
        <FileEarmarkImage />
      </span>
      <b>Guarantor one - Ebube</b>
    </div>
  </div>
);

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

const DocDetails = () => {
  return (
    <div className="col-3">
      <ButtonDiv />
      <Doc />
    </div>
  );
};

const UpdateDoc = () => {
  return (
    <>
      <div className="loan-details col">
        <div className="mb-5">
          <div className="details-header">Guarantor Details</div>
          <div className="row">
            <DocDetails />
            <DocInfo />
          </div>
        </div>
        <div className="mb-5">
          <div className="details-header">Other Documents</div>
          <div className="row">
            <DocDetails />
            <DocDetails />
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateDoc;
