import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const RemedialPaymentStatement = () => {
  const { studentId } = useParams();
  const [term, setTerm] = useState(1); // Not used actively but left as-is
  const [payments, setPayments] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [studentClass, setStudentClass] = useState(null);
  const [termFeeMap, setTermFeeMap] = useState({}); // ✅ Added missing state

  useEffect(() => {
    const fetchPaymentsAndFees = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/server/remedialPayments/getRemedialPaymentByStudent/${studentId}`
        );
        const data = res.data;
        console.log("All data", data);
        setPayments(data);

        if (data.length > 0) {
          const s = data[0];
          const fetchedClass = s.class;
          setStudentClass(fetchedClass);
          setStudentInfo({
            name: `${s.first_name} ${s.second_name} ${s.last_name}`,
            admissionNo: s.admissionNo,
            class: fetchedClass,
          });
        }
      } catch (err) {
        console.error("Error fetching student payments:", err);
        setError("Failed to load payment statement.");
      }
    };

    fetchPaymentsAndFees();
  }, [studentId]);

  useEffect(() => {
    const fetchAllTermFees = async () => {
      if (!studentClass || payments.length === 0) return;

      const terms = [...new Set(payments.map((p) => p.term))];
      const feeMap = {};

      for (const t of terms) {
        try {
          const res = await axios.get(
            `http://localhost:8800/server/remedials/byClass/${t}`
          );
          console.log("All data", res.data);
          feeMap[t] = res.data[0]?.Amount_paid || 0;
        } catch (err) {
          console.error(`Failed to fetch fee for term ${t}`, err);
          feeMap[t] = 0;
        }
      }

      setTermFeeMap(feeMap); // ✅ Correct usage
    };

    fetchAllTermFees();
  }, [studentClass, payments]);

  const groupedByTerm = payments.reduce((acc, payment) => {
    const { term } = payment;
    if (!acc[term]) acc[term] = [];
    acc[term].push(payment);
    return acc;
  }, {});

  const calculateTotalPaid = (termPayments) =>
    termPayments.reduce((total, p) => total + Number(p.Amount_paid), 0);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Payment Statement</h3>
        <Link to="/viewremedialpayments">
          <button className="btn btn-secondary">Back</button>
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {studentInfo && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5>Student Info</h5>
            <p>
              <strong>Name:</strong> {studentInfo.name}
            </p>
            <p>
              <strong>Admission No:</strong> {studentInfo.admissionNo}
            </p>
            <p>
              <strong>Class:</strong> {studentInfo.class}
            </p>
          </div>
        </div>
      )}

      {Object.keys(groupedByTerm).length > 0 ? (
        Object.entries(groupedByTerm).map(([term, termPayments]) => {
          const totalPaid = calculateTotalPaid(termPayments);
          const termFee = termFeeMap[term] || 0;
          const balance = termFee - totalPaid;

          return (
            <div className="card mb-4 shadow-sm" key={term}>
              <div className="card-body">
                <h5>Term {term}</h5>
                <table className="table table-bordered mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Amount Paid</th>
                      <th>Method</th>
                      <th>Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {termPayments.map((p, idx) => (
                      <tr key={p.id}>
                        <td>{idx + 1}</td>
                        <td>KES {Number(p.Amount_paid).toLocaleString()}</td>
                        <td>{p.payment_method}</td>
                        <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">
                        <strong>Term {term} Total Paid:</strong>
                      </td>
                      <td colSpan="2">
                        <strong>KES {totalPaid.toLocaleString()}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <strong>Term {term} Fee:</strong>
                      </td>
                      <td colSpan="2">
                        <strong>KES {termFee.toLocaleString()}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <strong>Balance:</strong>
                      </td>
                      <td colSpan="2">
                        <strong
                          className={
                            balance > 0 ? "text-danger" : "text-success"
                          }
                        >
                          KES {balance.toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })
      ) : (
        !error && (
          <div className="alert alert-info">
            No payments found for this student.
          </div>
        )
      )}
    </div>
  );
};

export default RemedialPaymentStatement;
