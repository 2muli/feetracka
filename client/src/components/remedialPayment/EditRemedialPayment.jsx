import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Fetch payment by ID
const fetchPaymentById = async (id) => {
  const res = await axios.get(`http://localhost:8800/server/remedialPayments/${id}`);
  return res.data;
};

// Update payment
const updatePayment = async ({ id, updatedPayment }) => {
  const res = await axios.put(`http://localhost:8800/server/remedialPayments/updateRemedialPayment/${id}`, updatedPayment);
  return res.data;
};

const EditRemedialPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    amountPaid: "",
    paymentMethod: "",
    term: "",
  });

  // Fetch existing payment data
  const {
    data: payment,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payment", id],
    queryFn: () => fetchPaymentById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        studentId: payment.student_id || "",
        amountPaid: payment.Amount_paid || "",
        paymentMethod: payment.payment_method || "",
        term: payment.term || "",
      });
    }
  }, [payment]);

  const {
    mutate,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: updatePayment,
    onSuccess: () => {
      toast.success("Payment updated successfully!");
      navigate("/viewremedialpayments"); // Adjust route to your payments list
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
      [name]: name === "amountPaid" || name === "studentId" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ id, updatedPayment: formData });
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Edit Payment</h1>

        {isLoading ? (
          <p>Loading payment data...</p>
        ) : isError ? (
          <div className="alert alert-danger">Error: {error?.message}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Student Adm No.</label>
              <input
                type="number"
                className="form-control"
                name="studentId"
                value={formData?.studentId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Amount Paid</label>
              <input
                type="number"
                className="form-control"
                name="amountPaid"
                value={formData?.amountPaid}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Payment Method</label>
              <select
                className="form-control"
                name="paymentMethod"
                value={formData?.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Method --</option>
                <option value="Cash">Cash</option>
                <option value="M-pesa">M-pesa</option>
                <option value="Account">Account</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Term</label>
              <select
                className="form-control"
                name="term"
                value={formData?.term}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Term --</option>
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Payment"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default EditRemedialPayment;
