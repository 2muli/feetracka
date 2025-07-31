import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const fetchClasses = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/students/classes`);
    return res.data;
  } catch (err) {
    console.error("Error fetching classes:", err);
    return [];
  }
};

const AddPayment = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    staleTime: 60 * 60 * 1000,
  });

  const [formData, setFormData] = useState({
    class: "",
    studentId: "",
    amountPaid: "",
    paymentMethod: "",
    term: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!formData.class) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/server/students/studentsByClass?className=${formData.class}`
        );
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [formData.class]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/server/payments/addPayment`,
        formData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment added successfully");
      navigate("/viewPayment");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Something went wrong.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.studentId || !formData.term || !formData.amountPaid) {
      toast.error("Please fill all required fields");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="container mt-5">
      <h3>Add Student Payment</h3>
      <form onSubmit={handleSubmit}>
        {/* Class Dropdown */}
        <div className="mb-3">
          <label className="form-label">Class</label>
          <select
            className="form-control"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
          >
            <option value="">Select class</option>
            {classes.map((cls, index) => (
              <option key={index} value={cls.class}>
                {cls.class}
              </option>
            ))}
          </select>
        </div>

        {/* Student Dropdown */}
        <div className="mb-3">
          <label className="form-label">Student</label>
          <select
            className="form-control"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            disabled={!formData.class}
            required
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.second_name} {student.last_name} -{" "}
                {student.admissionNo || student["student_AdmNo."]}
              </option>
            ))}
          </select>
        </div>

        {/* Term */}
        <div className="mb-3">
          <label className="form-label">Term</label>
          <select
            className="form-control"
            name="term"
            value={formData.term}
            onChange={handleChange}
            required
          >
            <option value="">Select term</option>
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
          </select>
        </div>

        {/* Amount Paid */}
        <div className="mb-3">
          <label className="form-label">Amount Paid</label>
          <input
            type="number"
            className="form-control"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            required
            min={0}
          />
        </div>

        {/* Payment Method */}
        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <select
            className="form-control"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="">Select method</option>
            <option value="M-PESA">M-PESA</option>
            <option value="Bank">Bank</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

export default AddPayment;
