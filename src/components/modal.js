import React from 'react';
import { ReactComponent as Check2Circle} from '../assets/icons/check2-circle.svg';
import { ReactComponent as TimesIcon} from '../assets/icons/times.svg';

const Modal = props => {
  return(
    <>
      {/* <!-- Modal --> */}
      <div className="modal fade" data-backdrop={props.closeWithBackDrop ? true : "static"} data-keyboard="false" id={props.id} tabIndex="-1" aria-labelledby={`${props.id}Label`}  aria-hidden="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            {/* <div className="modal-header"> */}
              {props.showCloseX && <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"><TimesIcon /></span>
              </button>}
            {/* </div> */}
            <div className="modal-body">
              {!props.imgSrc && <div className="modal-icon"><Check2Circle /></div>}
              <h5 className="modal-title" id={`${props.id}Label`}>{props.title}</h5>
              {props.imgSrc ? <div className="modal-img">
                <img className="w-100" src={props.imgSrc} alt="" />
              </div> : <div className="modal-text">
                {props.modalText}
              </div>}
              {props.replaceButton ? 
                props.newButton :
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Alright</button>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;