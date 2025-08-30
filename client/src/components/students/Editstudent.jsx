import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔍 Fetch student by ID
const fetchStudentById = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/students/studentById/${id}`);
  return res.data;
};

// 🔄 Update student API
const updateStudent = async ({ id, updatedStudent }) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/server/students/updateStudent/${id}`,
    updatedStudent
  );
  return res.data;
};

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    admissionNo: "",
    className: "Form 1",
  });

  // ✅ Fetch student
  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudentById(id),
    enabled: !!id,
  });

  // ✅ Populate form on data load
  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.first_name || "",
        secondName: student.second_name || "",
        lastName: student.last_name || "",
        admissionNo: student.admissionNo || "",
        className: student.class || "Form 1",
      });
    }
  }, [student]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Update mutation
  const {
    mutate,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      toast.success("Student updated successfully!");
      navigate("/viewstudents");
    },
    onError: (error) => {
      toast.error(
        (error?.response?.data?.error || "Unknown error")
      );
    },
  });
  // ✅ Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ id, updatedStudent: formData });
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Edit Student</h1>

        {isLoading && <p>Loading student data...</p>}

        {isError && (
          <div className="alert alert-danger">
            Failed to load: {error?.message}
          </div>
        )}

        {!isLoading && !isError && (
          <form onSubmit={handleSubmit}>
            {/* Input fields */}
            {["firstName", "secondName", "lastName"].map(
              (field) => (
                <div className="form-group mb-2" key={field}>
                  <label>{field}</label>
                  <input
                    type="text"
                    className="form-control"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              )
            )}

            {/* Admission Number */}
            <div className="form-group mb-2">
              <label>Admission Number</label>
              <input
                type="number"
                className="form-control"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Class Dropdown */}
            <div className="form-group mb-2">
              <label>Class</label>
              <select
                className="form-control"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  --Select class--
                </option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-success mt-3"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Student"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default EditStudent;
