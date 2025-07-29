import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ManageAccount = () => {
  const { isAuthenticated, userDetails } = useAuth();
  const navigate= useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userDetails) {
      setFormData({
        firstName: userDetails.user?.firstName || "",
        secondName: userDetails.user?.secondName || "",
        lastName: userDetails.user?.lastName || ""
      });
    }
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Prepare data to only include changed fields
    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== (userDetails[key] || "")) {
        updatedData[key] = formData[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      setMessage("No changes to update");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8800/server/users/updateUser/${userDetails.user?.id}`,
        updatedData,
        { withCredentials: true }
      );
      setMessage(res.data.message || "Update successful");
      navigate("/profile");
    } catch (err) {
      const error = err.response?.data?.error || "Update failed";
      setMessage(error);
    }
  };

  if (!isAuthenticated || !userDetails) return null;

  return (
    <main>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header">
                <h3 className="text-center font-weight-light my-4">Manage Account</h3>
              </div>
              <div className="card-body">
                {message && (
                  <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
                    {message}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3 mb-md-0">
                        <input
                          className="form-control"
                          id="inputFirstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          type="text"
                          placeholder="Enter your first name"
                          required
                        />
                        <label htmlFor="inputFirstName">First name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          className="form-control"
                          id="inputSecondName"
                          name="secondName"
                          value={formData.secondName}
                          onChange={handleChange}
                          type="text"
                          placeholder="Enter your second name"
                        />
                        <label htmlFor="inputSecondName">Second name</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="inputLastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter your last name"
                      required
                    />
                    <label htmlFor="inputLastName">Last name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="inputEmail"
                      value={userDetails.email}
                      disabled
                      type="email"
                    />
                    <label htmlFor="inputEmail">Email address (not editable)</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      id="inputPhone"
                      value={userDetails.phone}
                      disabled
                      type="text"
                    />
                    <label htmlFor="inputPhone">Phone number (not editable)</label>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                    <Link to="/profile" className="small">Return to profile</Link>
                    <button type="submit" className="btn btn-primary">Update Account</button>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <div className="small">
                  <Link to="/dashboard">To the dashboard? Click here</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageAccount;
