import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Fetch fee record by ID
const fetchFeeById = async (id) => {
  const res = await axios.get(`http://localhost:8800/server/fees/${id}`);
  return res.data;
};

// Update fee record
const updateFee = async ({ id, updatedFee }) => {
  const res = await axios.put(`http://localhost:8800/server/fees/updateFee/${id}`, updatedFee);
  return res.data;
};

const EditFees = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    classPaid: "",
    term: "",
    year: "",
    amountPaid: "",
  });

  // Fetch fee on load
  const {
    data: fee,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fee", id],
    queryFn: () => fetchFeeById(id),
    enabled: !!id,
  });

  // Populate form with fetched data
  useEffect(() => {
    if (fee) {
      setFormData({
        classPaid: fee.class || "",
        term: fee.term || "",
        year: fee.Year || "",
        amountPaid: fee.Amount_paid || "",
      });
    }
  }, [fee]);

  // Update mutation
  const {
    mutate,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: updateFee,
    onSuccess: () => {
      alert("Fee updated successfully!");
      navigate("/viewfee");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amountPaid" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ id, updatedFee: formData });
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Edit Fee</h1>

        {isLoading ? (
          <p>Loading fee data...</p>
        ) : isError ? (
          <div className="alert alert-danger">Error: {error?.message}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Class</label>
              <select
                className="form-control"
                name="classPaid"
                value={formData.classPaid}
                onChange={handleChange}
                required
              >
                <option value="1">Form 1</option>
                <option value="2">Form 2</option>
                <option value="3">Form 3</option>
                <option value="4">Form 4</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Term</label>
              <select
                className="form-control"
                name="term"
                value={formData.term}
                onChange={handleChange}
                required
              >
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Year</label>
              <input
                type="text"
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleChange}
                placeholder="Enter year"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Amount to be paid</label>
              <input
                type="number"
                name="amountPaid"
                className="form-control"
                value={formData.amountPaid}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </div>

            <button type="submit" className="btn btn-success mt-2" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Fee"}
            </button>

            {isUpdateError && (
              <div className="alert alert-danger mt-3">
                {updateError?.response?.data?.error || "Update failed"}
              </div>
            )}
          </form>
        )}
      </div>
    </main>
  );
};

export default EditFees;
