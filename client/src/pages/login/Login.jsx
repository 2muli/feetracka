// src/pages/login/Login.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const {userDetails} = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await login(inputs); // get fresh data
      console.log(loggedUser);
  
      if (loggedUser.isActive !== 1) {
        navigate("/for-account-to-activated");
      } else {
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };
  
  return (
    <main>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header">
                <h3 className="text-center font-weight-light my-4">Login</h3>
              </div>
              <div className="card-body">
                <h5 className="text-center">
                  Welcome back! Please enter your credentials to continue.
                </h5>

                  <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      name="email"
                      value={inputs.email}
                      onChange={handleChange}
                      className="form-control"
                      id="inputEmail"
                      type="email"
                      placeholder="name@example.com"
                      required
                    />
                    <label htmlFor="inputEmail">Email address</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      name="password"
                      value={inputs.password}
                      onChange={handleChange}
                      className="form-control"
                      id="inputPassword"
                      type="password"
                      placeholder="Password"
                      required
                    />
                    <label htmlFor="inputPassword">Password</label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      id="inputRememberPassword"
                      type="checkbox"
                    />
                    <label className="form-check-label" htmlFor="inputRememberPassword">
                      Remember Password
                    </label>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                    <Link to="/reset-password/" className="small">
                      Forgot Password?
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer text-center py-3">
                <div className="small">
                  <Link to="/register">Need an account? Sign up!</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
