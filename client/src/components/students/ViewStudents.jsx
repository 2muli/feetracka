import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { confirmDialog } from 'primereact/confirmdialog';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ViewStudents = () => {
  const { isAuthenticated, loading } = useAuth();
  const [students, setStudents] = useState([]);
  const [studentClass, setStudentClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const studentsPerPage = 10;

  // 💡 Fetch students by class
  const fetchStudentsByClass = async () => {
    if (!studentClass) return;
    try {
      const res = await axios.get(`/students/studentsByClass?className=${studentClass}`);
      setStudents(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]);// clear students if error
    }
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: 'Do you want to delete this student?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/server/students/${id}`);
          toast.success("Student deleted successfully");
          fetchStudentsByClass(); // refresh list
        } catch (err) {
          console.error("Delete error:", err);
          toast.error("Failed to delete payment");
        }
      },
      reject: () => {
        toast.info("Deletion cancelled");
      }
    });
  };
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Form ${studentClass} Students List`, 14, 15);

    const tableColumn = ["#", "Adm No.", "Full Name", "Form", "Parent Name", "Parent Contact"];
    const tableRows = [];

    students.forEach((student, index) => {
      tableRows.push([
        index + 1,
        student.student_AdmNo,
        `${student.first_name} ${student.second_name} ${student.last_name}`,
        student.class,
        student.parent_name,
        student.parent_contact,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`students_list_${studentClass}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    if (!loading && isAuthenticated && studentClass) {
      fetchStudentsByClass();
    }
  }, [studentClass, isAuthenticated, loading]);

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);

  if(isLoading){
    return <span><BarLoader
    height={10}
    speedMultiplier={0}
    width={123}
    /></span>
  }
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
        <h1 className="mt-4">View Form {studentClass} Students</h1>

        <div className="mb-3 no-print">
          <label htmlFor="studentClass" className="form-label">Select Form</label>
          <select
            id="studentClass"
            className="form-control"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          >
            <option value="">--Select Form--</option>
            <option value="2">Form 2</option>
            <option value="3">Form 3</option>
            <option value="4">Form 4</option>
          </select>
        </div>
        

        <div className="mb-3 d-flex justify-content-between no-print">
          <button className="btn btn-info no-print" onClick={fetchStudentsByClass} disabled={!studentClass}>
            Load Students
          </button>
          <Link to="/addStudent">
            <button className="btn btn-success no-print">Add Student</button>
          </Link>
          </div>
          {students.length > 0 && <div className="mb-3 no-print">
            <button className="btn btn-warning me-2 no-print" onClick={handleExportPDF}>
              Export to PDF
            </button>
            <button className="btn btn-success me-2 no-print" onClick={handlePrint}>
              Print
            </button>
          </div>}
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Adm No.</th>
              <th>Form</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{indexOfFirst + index + 1}</td>
                <td>{`${student.first_name} ${student.second_name} ${student.last_name}`}</td>
                <td>{student.student_AdmNo}</td>
                <td>{student.class}</td>
                <td>
                  <Link to={`/editstudent/${student.id}`}>
                    <button className="btn btn-primary btn-sm me-2 no-print">Edit</button>
                  </Link>
                  <button
                    className="btn btn-danger btn-sm me-2 no-print"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="alert alert-info no-print">No students found for selected class.</div>
        )}

        <div className="text-white text-center font-weight-bold my-3 no-print">
          Total Students: {students.length}
        </div>

        {students.length > studentsPerPage && (
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
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

export default ViewStudents;
