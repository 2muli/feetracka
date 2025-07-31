import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  // 🧠 Fetch Payments
  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 💸 Fetch Overall Balance
  const fetchBalance = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/payments/getBalance`);
    return res.data;
  };

  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
    error: errorBalance,
  } = useQuery({
    queryKey: ['balance'],
    queryFn: fetchBalance,
  });

  if (isLoadingBalance) return <div>Loading balance...</div>;
  if (isErrorBalance) {
    console.error("Balance fetch error:", errorBalance);
    return <div>Error loading balance</div>;
  }

  // 🗑️ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/server/payments/${id}`);
      toast.success("Payment deleted successfully");
      fetchPayments(); // refresh
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete payment");
    }
  };

  // 🔢 Pagination Logic
  const totalPages = Math.ceil(payments.length / paymentsPerPage);
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirst, indexOfLast);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">View Payments</h1>
       <div className="d-flex justify-content-start">
          <Link to="/filterfeebalance">
            <button className="btn btn-warning">Print Balance</button>
          </Link>
        </div>
        <div className="d-flex justify-content-end">
          <Link to="/addPayment">
            <button className="btn btn-success mb-3">Add Payment</button>
          </Link>
        </div>

        <table className="table table-hover table-striped">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Student Adm No.</th>
              <th> Student Name</th>
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
                <td>{p?.admissionNo}</td>
                <td>{`${p.first_name} ${p.second_name} ${p.last_name}`}</td>
                <td>{Number(p.Amount_paid).toLocaleString()}</td>
                <td>{p.payment_method}</td>
                <td>{new Date(p.createdAt).toISOString().split('T')[0]}</td>
                <td>{p.term}</td>
                <td>
                  <Link to={`/editpayment/${p.id}`}>
                    <button className="btn btn-primary btn-sm me-2">Edit</button>
                  </Link>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                  <Link to={`/payment-statement/${p.student_id}`}>
                    <button className="btn btn-info btn-sm">Payment Statement</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ⛔ No records */}
        {payments.length === 0 && (
          <div className="alert alert-info">No payments found.</div>
        )}

        {/* 💖 Balance Display */}
        <div className="my-4 text-white p-3 rounded text-center">
          <p><strong>Expected Amount:</strong> KES {Number(balanceData.totalExpected).toLocaleString()}/=</p>
          <p><strong>Paid Amount:</strong> KES {Number(balanceData.totalPaid).toLocaleString()}/=</p>
          <p><strong>Balance:</strong> KES {Number(balanceData.balance).toLocaleString()}/=</p>
        </div>

        {/* 🔄 Pagination */}
        {payments.length > paymentsPerPage && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={prevPage}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={nextPage}>Next</button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </main>
  );
};

export default ViewPayments;
