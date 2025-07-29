import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRemedial = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    term: "",
    amountPaid: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amountPaid" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await axios.post("http://localhost:8800/server/remedials/", formData);
      alert("Fee record added successfully");
      navigate("/remedial"); // Redirect to view fees page
    } catch (err) {
      console.error("The Class already added!:", err);
      setError(err.response?.data?.error || "Failed to add fee ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Add Remedial</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Term Dropdown */}
          <div className="form-group mb-3">
            <label>Term</label>
            <select
              className="form-control"
              name="term"
              value={formData.term}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Term --</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>

          {/* Amount Input */}
          <div className="form-group mb-3">
            <label>Amount to be Paid</label>
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

          <button
            type="submit"
            className="btn btn-success mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddRemedial;
