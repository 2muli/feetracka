import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ChangePassword = () => {
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: (formData) =>
      axios.post("http://localhost:8800/server/users/changePassword", formData, {
        withCredentials: true,
      }),
    onSuccess: (res) => {
      toast.success(res.data.message || "Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Something went wrong.");
    },
  });

  if (!isAuthenticated) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    mutation.mutate(form);
  };

  return (
    <main>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header">
                <h3 className="text-center font-weight-light my-4">
                  Change Password
                </h3>
              </div>
              <div className="card-body">
                {error && toast.error(error)}
                {success && toast.success(success)}

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="currentPassword">Current Password</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="newPassword">New Password</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                    <Link to="/profile" className="small">
                      Return to profile
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      {mutation.isPending ? "Updating..." : "Update Password"}
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
