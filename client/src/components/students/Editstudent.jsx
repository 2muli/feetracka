import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 👉 Fetch student by ID
const fetchStudentById = async (id) => {
  const res = await axios.get(`http://localhost:8800/server/students/studentById/${id}`);
  return res.data;
};

// 👉 Update student
const updateStudent = async ({ id, updatedStudent }) => {
  const res = await axios.put(
    `http://localhost:8800/server/students/updateStudent/${id}`,
    updatedStudent
  );
  return res.data;
};

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Local state for form
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    admissionNo: "",
    className: "Form 1",
    parentName: "",
    parentContact: "",
  });

  // ✅ Fetch student data
  const {
    data: student,
    isLoading: isFetching,
    isError: isFetchError,
    error: fetchError,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudentById(id),
    enabled: !!id,
  });

  // ✅ Populate form after fetch
  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.first_name || "",
        secondName: student.second_name || "",
        lastName: student.last_name || "",
        admissionNo: student.admissionNo || "",
        className: student.class || "Form 1",
        parentName: student.parent_name || "",
        parentContact: student.parent_contact || "",
      });
    }
  }, [student]);

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "admissionNo" ? parseInt(value) || "" : value,
    }));
  };

  // ✅ Mutation to update student
  const {
    mutate,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      alert("Student updated successfully!");
      navigate("/viewstudents");
    },
  });

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ id, updatedStudent: formData });
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Edit Student</h1>

        {isFetching && <p>Loading student data...</p>}

        {isFetchError && (
          <div className="alert alert-danger">
            Failed to load: {fetchError?.message}
          </div>
        )}

        {!isFetching && !isFetchError && (
          <form onSubmit={handleSubmit}>
            {["firstName", "secondName", "lastName", "parentName", "parentContact"].map(
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

            {/* Admission No */}
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
    <option value="1">Form 1</option>
    <option value="2">Form 2</option>
    <option value="3">Form 3</option>
    <option value="4">Form 4</option>
  </select>
</div>

            <button
              type="submit"
              className="btn btn-success mt-3"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </form>
        )}

        {isUpdateError && (
          <div className="alert alert-danger mt-3">
            {updateError?.response?.data?.error || "Update failed"}
          </div>
        )}
      </div>
    </main>
  );
};

export default EditStudent;
