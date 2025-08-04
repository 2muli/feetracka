import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { mutate, isLoading, isSuccess, error, data } = useMutation({
    mutationFn: async (userData) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/server/users/register`,
        userData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("User added successfully!");
      navigate("/viewusers");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Unknown error");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutate(formData);
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Add User</h1>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="form-group mb-2">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              required
            />
          </div>

          {/* Second Name */}
          <div className="form-group mb-2">
            <label>Second Name</label>
            <input
              type="text"
              className="form-control"
              name="secondName"
              value={formData.secondName}
              onChange={handleChange}
              placeholder="Enter Second Name"
              required
            />
          </div>

          {/* Last Name */}
          <div className="form-group mb-2">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group mb-2">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group mb-2">
            <label>Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group mb-2">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group mb-2">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter Confirm Password"
              required
            />
          </div>

          <button type="submit" className="btn btn-success mt-3" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {isSuccess && (
          <div className="alert alert-success mt-3">
            {data?.message || "User added."}
          </div>
        )}
      </div>
    </main>
  );
};

export default AddUser;
