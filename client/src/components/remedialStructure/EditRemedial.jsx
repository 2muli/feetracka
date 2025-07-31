import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Fetch fee record by ID
const fetchRemedialById = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/remedials/${id}`);
  return res.data;
};

// Update fee record
const updateRemedial = async ({ id, updatedFee }) => {
  const res = await axios.put(`${import.meta.env.VITE_API_URL}/server/remedials/updateRemedial/${id}`, updatedFee);
  return res.data;
};

const EditRemedial = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    term: "",
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
    queryFn: () => fetchRemedialById(id),
    enabled: !!id,
  });

  // Populate form with fetched data
  useEffect(() => {
    if (fee) {
      setFormData({
        term: fee.term || "",
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
    mutationFn: updateRemedial,
    onSuccess: () => {
      toast.success("Fee updated successfully!");
      navigate("/remedial");
    },
    onError: (error) => {
      toast.error(
        (error?.response?.data?.error || "Unknown error")
      );
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
        <h1 className="mt-4">Edit Remedial</h1>

        {isLoading ? (
          <p>Loading fee data...</p>
        ) : isError ? (
          <div className="alert alert-danger">Error: {error?.message}</div>
        ) : (
          <form onSubmit={handleSubmit}>

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

          </form>
        )}
      </div>
    </main>
  );
};

export default EditRemedial;
