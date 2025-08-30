import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddStudent = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    admissionNo: "", // Will be handled as a number input
    className: "", // Default selected value
    parentName: "",
    parentContact: "",
  });

  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation({
    mutationFn: async (studentData) => {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/server/students/addStudent`, studentData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Student added successfully!");
      navigate("/viewstudents");
    },
    onError: (error) => {
      toast.error(
        (error?.response?.data?.error || "Unknown error")
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "admissionNo" ? parseInt(value) || "" : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Add Student</h1>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="form-group mb-2">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
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
              placeholder="Enter second name"
                value={formData.secondName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name */}
          <div className="form-group mb-2">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Admission Number - number input */}
          <div className="form-group mb-2">
            <label>Admission Number</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter admission number"
              name="admissionNo"
              value={formData.admissionNo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Class - Dropdown */}
          <div className="form-group mb-2">
            <label>Class</label>
            <select
  className="form-control"
  name="className"
  value={formData.className}
  onChange={handleChange}
  required
>
  <option value="">
    --Select class--
  </option>
  <option value="2">Form 2</option>
  <option value="3">Form 3</option>
  <option value="4">Form 4</option>
</select>
          </div>

          {/* Parent Name */}
          <div className="form-group mb-2">
            <label>Parent Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter parent name"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Parent Contact */}
          <div className="form-group mb-2">
            <label>Parent Contact</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter parent contact"
              name="parentContact"
              value={formData.parentContact}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success mt-3" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {isSuccess && <div className="alert alert-success mt-3">{data?.message}</div>}
        
      </div>
    </main>
  );
};

export default AddStudent;
