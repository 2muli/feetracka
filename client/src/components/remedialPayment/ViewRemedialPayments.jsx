import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { confirmDialog } from "primereact/confirmdialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
const ViewRemedialPayments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  // ✅ Fetch remedial payments
  const {
    data: paymentsData,
    isLoading: isLoadingPayments,
    isError: isErrorPayments,
    refetch: refetchPayments,
    error: errorPayments,
  } = useQuery({
    queryKey: ["remedialPayments"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/server/remedialPayments`
      );
      return res.data;
    },
  });

  // ✅ Fetch overall balance
  const {
    data: balanceData,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
    error: errorBalance,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/server/remedialPayments/getRemedialBalance`
      );
      return res.data;
    },
  });

  // ✅ Defensive check
  const payments = Array.isArray(paymentsData) ? paymentsData : [];

  // ✅ Pagination logic
  const totalPages = Math.ceil(payments.length / paymentsPerPage);
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => setCurrentPage(page);
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // ✅ Handle delete
  const handleDelete = (id) => {
    confirmDialog({
      message: "Do you want to delete this payment?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/server/remedialPayments/${id}`
          );
          toast.success("Payment deleted successfully");
          refetchPayments();
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete payment");
        }
      },
      reject: () => {
        toast.info("Deletion cancelled");
      },
    });
  };

  // ✅ Loading & error states
  if (isLoadingPayments || isLoadingBalance) return <div><BarLoader
  height={10}
  speedMultiplier={0}
  width={123}
/></div>;
  if (isErrorPayments) return <div>Error loading payments: {errorPayments?.message}</div>;
  if (isErrorBalance) return <div>Error loading balance: {errorBalance?.message}</div>;

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Remedial Payments</h1>

        <div className="d-flex justify-content-between mb-3">
          <Link to="/filterremedialbalance">
            <button className="btn btn-warning">Print Balance</button>
          </Link>
          <Link to="/addRemedialPayment">
            <button className="btn btn-success">Add Payment</button>
          </Link>
        </div>
        {payments.length === 0 ? (
          <div className="alert alert-info">No payments found.</div>
        ) : (
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Adm No.</th>
                <th>Student Name</th>
                <th>Amount (KES)</th>
                <th>Method</th>
                <th>Date</th>
                <th>Term</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((p, index) => (
                <tr key={p.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{p.admissionNo}</td>
                  <td>{`${p.first_name} ${p.second_name} ${p.last_name}`}</td>
                  <td>{Number(p.Amount_paid).toLocaleString()}</td>
                  <td>{p.payment_method}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
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
                    <Link to={`/remedial-payment-statement/${p.student_id}`}>
                      <button className="btn btn-info btn-sm">Statement</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 💰 Summary Section */}
        {balanceData && (
          <div className="text-white p-4 rounded my-4 text-center">
            <p><strong>Expected Amount:</strong> KES {Number(balanceData.totalExpected).toLocaleString()}</p>
            <p><strong>Paid Amount:</strong> KES {Number(balanceData.totalPaid).toLocaleString()}</p>
            <p><strong>Balance:</strong> KES {Number(balanceData.balance).toLocaleString()}</p>
          </div>
        )}

        {/* 📄 Pagination */}
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={prevPage}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => goToPage(i + 1)}>
                    {i + 1}
                  </button>
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
