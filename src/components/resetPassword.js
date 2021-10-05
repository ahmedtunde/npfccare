import React, { useEffect, useState } from 'react';
import logo from '../assets/img/logo-main.png';
import { ReactComponent as ArrowRightCircle} from '../assets/icons/arrow-right-circle.svg';
import { ReactComponent as EyeFill} from '../assets/icons/eye-fill.svg';
import { ReactComponent as EyeSlashFill} from '../assets/icons/eye-slash-fill.svg';
import { ReactComponent as SpinnerIcon} from '../assets/icons/spinner.svg';
import { useHistory } from 'react-router-dom';
import notify from '../utils/notification';
import { resetAdminPassword } from '../services/authService';

const ResetPassword = props => {

    const [showNewPassword, setShowNewPassword] = useState(false);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isInputFocused, setInputFocused] = useState({
		oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const [userInputs, setInputs] = useState({
		oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [isLoading, setLoading] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState("");

    useEffect(() => {
        //remove modal reminants
        const body = document.querySelector('body');
        body.classList.remove("modal-open");
        body.style.paddingRight = "";

        const modalBackdrop = document.querySelector(".modal-backdrop");
        if(modalBackdrop) modalBackdrop.remove();
    }, []);
	
    const handleShowPassword = target => {
		if(target === "new") {
			setShowNewPassword(prev => !prev)
		} else if(target === "confirm") {
			setShowConfirmPassword(prev => !prev)
		} else {
			setShowOldPassword(prev => !prev)
		}
	};

    const handleChange = e => {
        const {name, value} = e.target;
        setLoginErrorMessage("");

        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

	const handleInputFocused = e => {
		const { name } = e.target;
		setInputFocused(prev => ({
			...prev,
			[name]: true
		}));
	};

	const handleInputBlur = e => {
		const { name } = e.target;
		setInputFocused(prev => ({
			...prev,
			[name]: false
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setLoginErrorMessage("");

		try {
			const result = await resetAdminPassword(userInputs.oldPassword, userInputs.newPassword);
			setLoading(false);

			if(result.error) return setLoginErrorMessage(result.message);

			notify(result.message, "success", () => {
				setInputs({
					oldPassword: "",
					newPassword: "",
					confirmPassword: ""
				})
			});

		} catch (error) {
			setLoading(false);
			const msg = error?.toLowerCase?.().includes?.("unauth") ? "Unauthorized." :
			error?.message?.toLowerCase?.().includes?.("network") ? "Network Error" :
				error?.message?.toLowerCase?.().includes?.("timeout") ? "Service Timeout, Try Again." :
				"Something went wrong!";
			setLoginErrorMessage(msg);
		}
	};
	
	return(
		<article className="animated fadeIn delay-05s">
			<section className="mx-auto">
				<div className="">
					{/* <div className="left-img-holder">
						<img src={sideImg} alt="" />
					</div> */}

					<div className="reset-form-container login-form-container mx-auto">
						<form className="mx-auto" onSubmit={handleSubmit}>

							<div className="form-header">
								<div className="logo-holder">
									<img src={logo} alt="logo"/>
								</div>

								<p>Provide your old and new password to proceed.</p>
								<p className="text-danger">Password must be a minimum of 8 characters and contain at least 1 uppercase letter, 1 digit and 1 symbol.</p>
							</div>

							<div className={`form-group${isInputFocused.oldPassword ? " input-focused" : ""}`}>
								<label htmlFor="oldPassword">
									Old Password
								</label>
								<input
									type={showOldPassword ? "text" : "password"}
									name="oldPassword"
									id="oldPassword"
									className="form-control"
									required
									onBlur={handleInputBlur}
									onFocus={handleInputFocused}
									onChange={handleChange}
									value={userInputs.oldPassword}/>
								<button type="button" className="show-password-btn1" onClick={() => {handleShowPassword("old")}}>
									{showOldPassword ? <EyeSlashFill /> : <EyeFill />}
								</button>
							</div>

							<div className={`mb-0 form-group${isInputFocused.newPassword ? " input-focused" : ""}`}>
								<label htmlFor="newPassword">
									New Password
								</label>
								<input
									type={showNewPassword ? "text" : "password"}
									name="newPassword"
									id="newPassword"
									className="form-control"
									required
									onBlur={handleInputBlur}
									onFocus={handleInputFocused}
									onChange={handleChange}
									value={userInputs.newPassword}/>
								<button type="button" className="show-password-btn1" onClick={() => {handleShowPassword("new")}}>
									{showNewPassword ? <EyeSlashFill /> : <EyeFill />}
								</button>
							</div>

							<div className={`form-group${isInputFocused.confirmPassword ? " input-focused" : ""}`}>
								<label htmlFor="password">
									Confirm Password
								</label>
								<input
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									id="confirmPassword"
									className="form-control"
									required
									onBlur={handleInputBlur}
									onFocus={handleInputFocused}
									onChange={handleChange}
									value={userInputs.confirmPassword}/>
								<button type="button" className="show-password-btn1" onClick={() => {handleShowPassword("confirm")}}>
									{showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
								</button>
							</div>

							{loginErrorMessage && <div className="custom invalid-feedback mb-2">
							{loginErrorMessage}
							</div>}

							<button 
								disabled={(!userInputs.newPassword && !userInputs.confirmPassword && !userInputs.oldPassword) || 
								(userInputs.newPassword && userInputs.newPassword.toString() !== userInputs.confirmPassword.toString())} 
								className="signin-btn btn" type="submit" style={{padding: "25px 103px 25px 108px"}}>
								Change Password
							<span className={`${isLoading ? "loading" : ""}`}>
								{isLoading ?
								<SpinnerIcon className="rotating" /> :
								<ArrowRightCircle />}
							</span>
							<div className="overlay-div"></div>
							</button>
						</form>

					</div>
				</div>
			</section>
		</article>
	);
};

export default ResetPassword;