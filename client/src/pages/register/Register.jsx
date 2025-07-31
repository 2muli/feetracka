import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError(null);
  };

  const mutation = useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/server/users/register`,
        userData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        navigate("/for-account-to-activated");
      } else {
        setError(data.error || "Registration failed");
      }
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || "Registration failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (user.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    if (user.password !== user.confirmPassword) {
      return setError("Passwords do not match");
    }

  return (
    <main>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header">
                <h3 className="text-center font-weight-light my-4">Create Account</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger text-center py-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3 mb-md-0">
                        <input
                          className="form-control"
                          name="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          value={user.firstName}
                          onChange={handleChange}
                          required
                        />
                        <label>First name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3 mb-md-0">
                        <input
                          className="form-control"
                          name="secondName"
                          type="text"
                          placeholder="Enter your second name"
                          value={user.secondName}
                          onChange={handleChange}
                        />
                        <label>Second name (optional)</label>
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      name="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={user.lastName}
                      onChange={handleChange}
                      required
                    />
                    <label>Last name</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                    <label>Email address</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      name="phone"
                      type="text"
                      placeholder="Phone number"
                      value={user.phone}
                      onChange={handleChange}
                      required
                    />
                    <label>Phone number</label>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3 mb-md-0">
                        <input
                          className="form-control"
                          name="password"
                          type="password"
                          placeholder="Create a password"
                          value={user.password}
                          onChange={handleChange}
                          required
                        />
                        <label>Password</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3 mb-md-0">
                        <input
                          className="form-control"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={user.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <label>Confirm Password</label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 mb-0">
                    <div className="d-grid">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? "Creating..." : "Create Account"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <div className="small">
                  <a href="/login">Have an account? Go to login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
