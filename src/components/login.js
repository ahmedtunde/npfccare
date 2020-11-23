import React, { useState } from 'react';
import sideImg from '../assets/img/side-img.png';
import { ReactComponent as ArrowRightCircle} from '../assets/icons/arrow-right-circle.svg';
import { ReactComponent as EyeFill} from '../assets/icons/eye-fill.svg';
import { ReactComponent as EyeSlashFill} from '../assets/icons/eye-slash-fill.svg';
import { ReactComponent as SpinnerIcon} from '../assets/icons/spinner.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from './utilities';
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

  const handleShowPassword = e => setShowPassword(prev => !prev);
  const handleChange = e => {
    const {name, value} = e.target;
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

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    // setTimeout(() => setLoading(false), 3000);
    // return;
    const { from } = location.state || { from: { pathname: "/pages"}}
    auth.signin(() => {
      setLoading(false);
      setLoginErrorMessage("Stuff just went down.")
      history.replace(from);
    });
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
              
              <button className="signin-btn btn" type="submit">
                Sign In
                <span className={`${isLoading ? "loading" : ""}`}>
                  {isLoading ?
                  <SpinnerIcon className="rotating" /> :
                  <ArrowRightCircle />}
                </span>
                <div className="overlay-div"></div>
              </button>
              {loginErrorMessage && <div className="custom invalid-feedback">
                {loginErrorMessage}
              </div>}
            </form>
            {/* <div className="container-fluid other-links">
              <div className="row">
                <div className="col">
                  <Link to="/">Forgot Password</Link>
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
