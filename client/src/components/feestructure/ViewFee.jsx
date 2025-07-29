import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ViewFee = () => {
  const [fees, setFees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const feesPerPage = 10;

  const fetchFees = async () => {
    try {
      const res = await axios.get("http://localhost:8800/server/fees");
      setFees(res.data);
    } catch (err) {
      console.error("Failed to fetch fees:", err);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this fee?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8800/server/fees/${id}`);
      alert("Fee deleted successfully!");
      fetchFees();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong while deleting");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(fees.length / feesPerPage);
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = fees.slice(indexOfFirstFee, indexOfLastFee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">View Fees</h1>
        <div className="d-flex justify-content-end">
          <Link to="/addfee">
            <button className="btn btn-success mb-3">Add Fee</button>
          </Link>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Form</th>
              <th>Term</th>
              <th>Amount Paid</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFees.map((fee, index) => (
              <tr key={fee.id}>
                <th>{indexOfFirstFee + index + 1}</th>
                <td>{fee.class}</td>
                <td>{fee.term}</td>
                <td>{fee.Amount_paid}</td>
                <td>{fee.Year}</td>
                <td>
                  <Link to={`/editfee/${fee.id}`}>
                    <button className="btn btn-primary btn-sm me-2">Edit</button>
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(fee.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {fees.length === 0 && (
          <div className="alert alert-info">No fees found.</div>
        )}

        {/* 🌟 Bootstrap Pagination UI */}
        {fees.length > 0 && (
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={goToPrevPage}>
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button onClick={() => paginate(number)} className="page-link">
                    {number}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={goToNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </main>
  );
};

export default ViewFee;
