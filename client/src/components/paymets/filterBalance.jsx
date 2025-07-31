import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const FilterStudentsByBalance = () => {
  const { isAuthenticated, loading } = useAuth();
  const [students, setStudents] = useState([]);
  const [minBalance, setMinBalance] = useState(0);
  const [studentClass, setStudentClass] = useState("");
  const [term, setTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  if(!isAuthenticated){
    return null;
    }
  if(loading){
    return <span>Loading wait for a minute</span>
  }
  const handleSearch = async () => {
    if (!studentClass || !term || minBalance === "") {
      toast.error("Please select class, term, and enter minimum balance");
      return;
    }

    try {
      const res = await axios.get(
        `/payments/getStudentBalances?class=${studentClass}&term=${term}&minBalance=${minBalance}`
      );
      console.log(res.data)
      setStudents(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Failed to fetch students with balances");
    }
  };

  const handleExportPDF = () => {
  const doc = new jsPDF();
  doc.text(`Form ${studentClass} Students Term ${term} Fee Balance`, 14, 15);

  const tableColumn = ["#", "Adm No.", "Full Name", "Form", "Amount Paid", "Balance"];
  const tableRows = [];

  students.forEach((student, index) => {
    tableRows.push([
      index + 1,
      student.student_AdmNo,
      `${student.first_name} ${student.second_name} ${student.last_name}`,
      student.class,
      student.totalPaid,
      student.balance,
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save(`Form ${studentClass} Students Term ${term} Fee Balance.pdf`);
};

  const handlePrint = () => {
    window.print();
  };

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);

  return (
    <main className="sb-nav-fixed">
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 4px;
          }
        }
      `}</style>

      <div className="container-fluid px-4">
        <h1 className="mt-4">Form {studentClass} Students Term {term} Fee Balance</h1>

        <div className="mb-3 no-print">
          <label className="form-label">Form</label>
          <select
            className="form-control"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          >
            <option value="">--Select Form--</option>
            <option value="1">Form 1</option>
            <option value="2">Form 2</option>
            <option value="3">Form 3</option>
            <option value="4">Form 4</option>
          </select>

          <label className="form-label mt-2">Term</label>
          <select
            className="form-control"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          >
            <option value="">--Select Term--</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <label className="form-label mt-2">Minimum Balance</label>
          <input
            type="number"
            className="form-control"
            value={minBalance}
            onChange={(e) => setMinBalance(e.target.value)}
            placeholder="Enter minimum balance"
          />

          <button className="btn btn-info mt-3" onClick={handleSearch}>
            Search
          </button>
        </div>
{ students.length > 0 && (
        <div className="d-flex justify-content-between mb-3 no-print">
          <div>
            <button className="btn btn-warning me-2 no-print" onClick={handleExportPDF}>
              Export to PDF
            </button>
            <button className="btn btn-success no-print" onClick={handlePrint}>
              Print
            </button>
          </div>
        </div>
)}
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Adm No.</th>
              <th>Full Name</th>
              <th>Form</th>
              <th>Amount Paid</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={student.studentId}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{student.student_AdmNo}</td>
                <td>{`${student.first_name} ${student.second_name} ${student.last_name}`}</td>
                <td>{student.class}</td>
                <td>{student.totalPaid}</td>
                <td>{student?.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="alert alert-info">No students found.</div>
        )}

        {students.length > studentsPerPage && (
          <nav className="d-flex justify-content-center no-print">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
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

export default FilterStudentsByBalance;