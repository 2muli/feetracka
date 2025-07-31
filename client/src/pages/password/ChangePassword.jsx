import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/server/users/reset-password/${token}`,
        {
          newPassword: formData.newPassword, // must match backend's expected field
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    },
    onError: (err) => {
      setError(err?.response?.data?.error || "An unexpected error occurred.");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const { newPassword, confirmPassword } = formData;

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return setError(
        "Password must include uppercase, lowercase, number, and special character."
      );
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    mutation.mutate();
  };

  return (
    <main>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg mt-5">
              <div className="card-header">
                <h3 className="text-center">Change Password</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <label>New Password</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <label>Confirm Password</label>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <Link className="small" to="/login">
                      Back to Login
                    </Link>
                    <button className="btn btn-primary" type="submit">
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;
