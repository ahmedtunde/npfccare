import React, { useEffect, useState } from 'react';
import sideImg from '../assets/img/side-img.png';
import logo from '../assets/img/logo-main.png';
import { ReactComponent as ArrowRightCircle} from '../assets/icons/arrow-right-circle.svg';
import { ReactComponent as EyeFill} from '../assets/icons/eye-fill.svg';
import { ReactComponent as EyeSlashFill} from '../assets/icons/eye-slash-fill.svg';
import { ReactComponent as SpinnerIcon} from '../assets/icons/spinner.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from './utilities';
import notify from '../utils/notification';
import { signInAdmin } from '../services/authService';
const Login = props => {
  const auth = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isInputFocused, setInputFocused] = useState({
    email: false,
    password: false
  });
  const [userInputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    //remove modal reminants
    const body = document.querySelector('body');
    body.classList.remove("modal-open");
    body.style.paddingRight = "";

    document.querySelector(".modal-backdrop")?.remove();
  }, []);
  useEffect(() => {
    if (auth.user) history.push(location.state?.from ?? "/pages" ) //redirect if there's token
  },[auth.user, history, location.state?.from])

  const handleShowPassword = e => setShowPassword(prev => !prev);
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
    const { from } = location.state || { from: { pathname: "/pages"}};
    try {
      const result = await signInAdmin(userInputs.email, userInputs.password);
      setLoading(false);
      if(!result.token) return setLoginErrorMessage("Incorrect email or password.");
      notify(result.message, "success");
      auth.signin(() => history.replace(from));
    } catch (error) {
      setLoading(false);
      const msg = error.toLowerCase?.().includes("unauth") ? "Incorrect email or password." :
        error.message.toLowerCase().includes("network") ? "Network Error" :
          error.message.toLowerCase().includes("timeout") ? "Service Timeout, Try Again." :
          "Something went wrong!";
      setLoginErrorMessage(msg);
    }
  };
  return(
    <article className="animated fadeIn delay-05s">
      <section className="mx-auto">
        <div className="login-wrapper">
          <div className="left-img-holder">
            <img src={sideImg} alt="" />
          </div>
          <div className="login-form-container mx-auto">
            <form className="mx-auto" onSubmit={handleSubmit}>
              <div className="form-header">
                <div className="logo-holder">
                  <img src={logo} alt="logo"/>
                </div>
                <h3 className="font-weight-bold">Admin Back Office</h3>
                <p>Kindly provide admin login details to proceed</p>
              </div>
              <div className={`form-group${isInputFocused.email ? " input-focused" : ""}`}>
                <label htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  required
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocused}
                  onChange={handleChange}
                  value={userInputs.email}/>
              </div>

              <div className={`form-group${isInputFocused.password ? " input-focused" : ""}`}>
                <label htmlFor="password">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="form-control"
                  required
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocused}
                  onChange={handleChange}
                  value={userInputs.password}/>
                <button type="button" className="show-password-btn" onClick={handleShowPassword}>
                  {showPassword ? <EyeSlashFill /> : <EyeFill />}
                </button>
              </div>
              {loginErrorMessage && <div className="custom invalid-feedback">
                {loginErrorMessage}
              </div>}
              <button className="signin-btn btn" type="submit">
                Sign In
                <span className={`${isLoading ? "loading" : ""}`}>
                  {isLoading ?
                  <SpinnerIcon className="rotating" /> :
                  <ArrowRightCircle />}
                </span>
                <div className="overlay-div"></div>
              </button>
            </form>
            {/* <div className="container-fluid other-links">
              <div className="row">
                <div className="col">
                  <Link to="/forgotpassword">Forgot Password</Link>
                </div>
                <div className="col">
                  <Link to="/signup">Create Account</Link>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </article>
  );
};

export default Login;
