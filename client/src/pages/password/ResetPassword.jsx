import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/server/resetPassword/send-reset-email`, // ✅ updated endpoint
        formData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset email sent. Please check your inbox.");
      navigate("/login");
    },
    onError: (err) => {
      const msg =
        err.response?.data?.error || err.response?.data?.message || "Something went wrong.";
      toast.error(msg);
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <main>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header">
                <h3 className="text-center font-weight-light my-4">Reset Password</h3>
              </div>
              <div className="card-body">
                <div className="small mb-3 text-muted">
                  Enter your email address and we’ll send you a password reset link.
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="inputEmail"
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="inputEmail">Email address</label>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                    <Link to="/login" className="small">Return to login</Link>
                    <button className="btn btn-primary" type="submit">Send Reset Link</button>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <div className="small"><Link to="/register">Need an account? Sign up!</Link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
