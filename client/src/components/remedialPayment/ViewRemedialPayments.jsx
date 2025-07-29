import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const ViewRemedialPayments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  // 🔄 Fetch payments using React Query
  const {
    data: payments = [],
    isLoading: isLoadingPayments,
    isError: isErrorPayments,
    refetch: refetchPayments,
    error: errorPayments
  } = useQuery({
    queryKey: ['remedialPayments'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8800/server/remedialPayments");
      return res.data;
    },
  });

  // 💸 Fetch overall balance
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
    error: errorBalance,
  } = useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8800/server/remedialPayments/getRemedialBalance");
      return res.data;
    },
  });

  // 🗑️ Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await axios.delete(`http://localhost:8800/server/remedialPayments/${id}`);
      alert("Payment deleted successfully");
      refetchPayments(); // Refresh data
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete payment");
    }
  };

  // 🔢 Pagination
  const totalPages = Math.ceil(payments.length / paymentsPerPage);
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => setCurrentPage(page);
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  if (isLoadingPayments || isLoadingBalance) return <div>Loading...</div>;
  if (isErrorPayments) return <div>Error loading payments: {errorPayments?.message}</div>;
  if (isErrorBalance) return <div>Error loading balance: {errorBalance?.message}</div>;

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">View Payments</h1>

        <div className="d-flex justify-content-start">
          <Link to="/filterremedialbalance">
            <button className="btn btn-warning">Print Balance</button>
          </Link>
        </div>

        <div className="d-flex justify-content-end">
          <Link to="/addRemedialPayment">
            <button className="btn btn-success mb-3">Add Payment</button>
          </Link>
        </div>

        {payments.length === 0 ? (
          <div className="alert alert-info">No payments found.</div>
        ) : (
          <table className="table table-hover table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Student Adm No.</th>
                <th>Student Name</th>
                <th>Amount (KES)</th>
                <th>Method</th>
                <th>Payment Date</th>
                <th>Term</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((p, index) => (
                <tr key={p.id}>
                  <th>{indexOfFirst + index + 1}</th>
                  <td>{p.admissionNo}</td>
                  <td>{`${p.first_name} ${p.second_name} ${p.last_name}`}</td>
                  <td>{Number(p.Amount_paid).toLocaleString()}</td>
                  <td>{p.payment_method}</td>
                  <td>{new Date(p.createdAt).toISOString().split('T')[0]}</td>
                  <td>{p.term}</td>
                  <td>
                    <Link to={`/editremedialpayment/${p.id}`}>
                      <button className="btn btn-primary btn-sm me-2">Edit</button>
                    </Link>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                    <Link to={`/editremedialpayment/${p.id}`}>
                      <button className="btn btn-info btn-sm">Payment Statement</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 💖 Balance Summary */}
        {balanceData && (
          <div className="my-4 text-white p-3 rounded text-center">
            <p><strong>Expected Amount:</strong> KES {Number(balanceData.totalExpected).toLocaleString()}/=</p>
            <p><strong>Paid Amount:</strong> KES {Number(balanceData.totalPaid).toLocaleString()}/=</p>
            <p><strong>Balance:</strong> KES {Number(balanceData.balance).toLocaleString()}/=</p>
          </div>
        )}

        {/* 📄 Pagination */}
        {payments.length > paymentsPerPage && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={prevPage}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={nextPage}>Next</button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </main>
  );
};

export default ViewRemedialPayments;
