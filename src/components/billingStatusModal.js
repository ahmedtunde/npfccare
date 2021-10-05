import Modal from "./modal";

const BillingStatusModal = ({ billingStatus }) => (
  <Modal id="billingStatusModal" showCloseX>
    <div className="modal-body">
      <h5 className="modal-title" id={`billingStatusModalLabel`}>
        Billing Status
      </h5>
      <div className="billing-status-container text-left ml-5">
        <div className="row font-weight-bold">
          <div className="col-3">Message:</div>
          <div className="col">{billingStatus.message ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">RRR:</div>
          <div className="col">{billingStatus.rrr ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Payer Email:</div>
          <div className="col">{billingStatus.payerEmail ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Payer Name:</div>
          <div className="col">{billingStatus.payerName ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Payer Phone:</div>
          <div className="col">{billingStatus.payerPhone ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Description:</div>
          <div className="col">{billingStatus.description ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Currency:</div>
          <div className={`col`}>{billingStatus.currency ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Amount:</div>
          <div className={`col`}>{billingStatus.rrrAmount ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Charge Fee:</div>
          <div className={`col`}>{billingStatus.chargeFee ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Amount Due:</div>
          <div className={`col`}>{billingStatus.amountDue ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Type:</div>
          <div className={`col`}>{billingStatus.type ?? "N/A"}</div>
        </div>
        <div className="row">
          <div className="col-3">Accept Part Payment:</div>
          <div className={`col`}>
            {billingStatus.acceptPartPayment?.toString?.() ?? "N/A"}
          </div>
        </div>
      </div>
    </div>
  </Modal>
);

export default BillingStatusModal;
