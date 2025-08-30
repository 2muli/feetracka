import axios from "axios";
import { confirmDialog } from 'primereact/confirmdialog';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";

const ViewFee = () => {
  const [fees, setFees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const feesPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/fees`);
      setFees(res.data);
    } catch (err) {
      console.error("Failed to fetch fees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);
  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <BarLoader color="#3b4c0a" height={10} width={150} speedMultiplier={1} />
      </div>
    );
  }
  
   const handleDelete = (id) => {
    confirmDialog({
      message: 'Do you want to delete this fee?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/server/fees/${id}`);
          toast.success("Fee deleted successfully");
          fetchFees(); // refresh list
        } catch (err) {
          console.error("Delete error:", err);
          toast.error("Failed to delete fee");
        }
      },
      reject: () => {
        toast.info("Deletion cancelled");
      }
    });
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
