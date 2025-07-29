// StudentPaymentStatement.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const StudentPaymentStatement = () => {
  const { studentId } = useParams();
  const [payments, setPayments] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/server/payments/getStudentPayments/${studentId}`);
        setPayments(res.data);
        if (res.data.length > 0) {
          const s = res.data[0];
          setStudentInfo({
            name: `${s.first_name} ${s.second_name} ${s.last_name}`,
            admissionNo: s.admissionNo
          });
        }
      } catch (err) {
        console.error("Error fetching student payments:", err);
        setError("Failed to load payment statement.");
      }
    };
    fetchPayments();
  }, [studentId]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Payment Statement</h3>
        <Link to="/viewpayment">
          <button className="btn btn-secondary">Back</button>
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {studentInfo && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5>Student Info</h5>
            <p><strong>Name:</strong> {studentInfo.name}</p>
            <p><strong>Admission No:</strong> {studentInfo.admissionNo}</p>
          </div>
        </div>
      )}

      {payments.length > 0 ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>All Payments</h5>
            <table className="table table-bordered mt-3">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Amount Paid</th>
                  <th>Method</th>
                  <th>Term</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td>KES {Number(p.Amount_paid).toLocaleString()}</td>
                    <td>{p.payment_method}</td>
                    <td>{p.term}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                    <td><strong>Balance:</strong></td>
                    <td><strong>KES {Number(payments.reduce((total, p) => total + Number(p.Amount_paid), 0)).toLocaleString()}</strong></td>
                  <td colSpan="col" className="text-end"><strong>Total:</strong></td>
                  <td><strong>KES {Number(payments.reduce((total, p) => total + Number(p.Amount_paid), 0)).toLocaleString()}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        !error && <div className="alert alert-info">No payments found for this student.</div>
      )}
    </div>
  );
};

export default StudentPaymentStatement;
