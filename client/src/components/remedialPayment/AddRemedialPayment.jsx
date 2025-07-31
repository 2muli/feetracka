import { useQuery } from "@tanstack/react-query";
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
const AddRemedialPayment = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [terms, setTerms] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    class:"",
    studentId: "",
    amountPaid: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    term: "",
  });
  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    staleTime: 60 * 60 * 1000,
  });
  // 🌸 Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/students/searchStudents`);
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };
    fetchStudents();
  }, []);
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

  // 🌸 Fetch terms
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/remedials/terms/list`);
        setTerms(res.data);
      } catch (err) {
        console.error("Failed to fetch terms", err);
      }
    };
    fetchTerms();
  }, []);

  // 🌸 Fetch summary when student and term are selected
  useEffect(() => {
    if (formData.studentId && formData.term) {
      const fetchSummary = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/server/students/${formData.studentId}/payment-summary?term=${formData.term}`
          );
          setSummary(res.data);
        } catch (err) {
          console.error("Failed to fetch summary", err);
        }
      };
      fetchSummary();
    }
  }, [formData.studentId, formData.term]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "studentId") {
      const student = students.find((s) => s.id === parseInt(value));
      setSelectedStudent(student || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      studentId: parseInt(formData.studentId),
      amountPaid: parseFloat(formData.amountPaid),
      paymentMethod: formData.paymentMethod,
      term: formData.term,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/server/remedialPayments/addRemedialPayment`, payload);
      toast.success("Remedial payment added successfully");
      navigate("/viewremedialpayments");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h2 className="mt-4">Add Remedial Payment</h2>
        <form onSubmit={handleSubmit}>
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
          {/* 🌸 Student Dropdown */}
          <div className="form-group">
            <label>Select Student</label>
            <select
              className="form-control"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Student --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.second_name} {student.last_name} (Adm No: {student?.admissionNo})
                </option>
              ))}
            </select>
          </div>

          {/* 🌸 Term Dropdown */}
          <div className="form-group mt-2">
            <label>Select Term</label>
            <select
              className="form-control"
              name="term"
              value={formData.term}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Term --</option>
              {terms.map((term) => (
                <option key={term} value={term}>
                  Term {term}
                </option>
              ))}
            </select>
          </div>

          {/* 🌸 Payment Summary */}
          {summary && (
            <div className="mt-3">
              <p><strong>Full Name:</strong> {summary.fullName}</p>
              <p><strong>Total Paid:</strong> Ksh {summary.totalPaid}</p>
              <p><strong>Balance:</strong> Ksh {summary.balance}</p>
            </div>
          )}

          {/* 🌸 Amount Paid */}
          <div className="form-group mt-2">
            <label>Amount Paid</label>
            <input
              type="number"
              className="form-control"
              name="amountPaid"
              value={formData.amountPaid}
              onChange={handleChange}
              required
              disabled={!formData.studentId || !formData.term}
            />
          </div>

          {/* 🌸 Payment Method */}
          <div className="form-group mt-2">
            <label>Payment Method</label>
            <select
              className="form-control"
              name="paymentMethod"
              value={formData.paymentMethod}
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

          {/* 🌸 Payment Date */}
          <div className="form-group mt-2">
            <label>Payment Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.paymentDate}
              disabled
            />
          </div>

          {/* 🌸 Submit Button */}
          <button type="submit" className="btn btn-success mt-3">
            Submit Payment
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddRemedialPayment;
