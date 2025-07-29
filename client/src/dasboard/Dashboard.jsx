import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// API fetchers
const fetchStudentCount = async () => {
  const res = await axios.get('http://localhost:8800/server/students/studentNumber', { withCredentials: true });
  return res.data.count;
};

const fetchTodayPayment = async () => {
  const res = await axios.get('http://localhost:8800/server/payments/todayPayments', { withCredentials: true });
  return res.data.totalPaidToday;
};

const fetchTotalPayment = async () => {
  const res = await axios.get('http://localhost:8800/server/payments/getTotalPayments', { withCredentials: true });
  return res.data.totalPaid;
};

const fetchBalance = async () => {
  const res = await axios.get('http://localhost:8800/server/payments/getBalance', { withCredentials: true });
  return res.data.balance;
};

const fetchLatestStudents = async () => {
  const res = await axios.get('http://localhost:8800/server/students/getLatestStudents', { withCredentials: true });
  return res.data;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Queries
  const { data: studentCount, isLoading: isLoadingStudents, isError: isErrorStudents, error: errorStudents } = useQuery({
    queryKey: ['studentCount'],
    queryFn: fetchStudentCount,
    enabled: isAuthenticated,
  });

  const { data: todayPayment, isLoading: isLoadingToday, isError: isErrorToday, error: errorToday } = useQuery({
    queryKey: ['todayPayment'],
    queryFn: fetchTodayPayment,
    enabled: isAuthenticated,
  });

  const { data: totalPayment, isLoading: isLoadingTotal, isError: isErrorTotal, error: errorTotal } = useQuery({
    queryKey: ['totalPayment'],
    queryFn: fetchTotalPayment,
    enabled: isAuthenticated,
  });

  const { data: balance, isLoading: isLoadingBalance, isError: isErrorBalance, error: errorBalance } = useQuery({
    queryKey: ['balance'],
    queryFn: fetchBalance,
    enabled: isAuthenticated,
  });

  const { data: latestStudents = [], isLoading: isLoadingLatest, isError: isErrorLatest } = useQuery({
    queryKey: ['latestStudents'],
    queryFn: fetchLatestStudents,
    enabled: isAuthenticated,
  });
if (!isAuthenticated) {
    return <div className="text-white p-4">You must be logged in to view this page.</div>;
  }
  if (loading) return <div className="text-white p-4">Checking authentication...</div>;

  return (
    <div className="sb-nav-fixed d-flex">

      <main id="layoutSidenav_content" className="w-100">
        <div className="container-fluid px-4">
          <h1 className="mt-4">Dashboard</h1>

          {/* Stats Cards */}
          <div className="row">
            {/* Student Count */}
            <div className="col-xl-3 col-md-6">
              <div className="card bg-success text-white mb-4">
                <div className="card-body">
                  <small>Total Students:</small>{' '}
                  <strong>
                    {isLoadingStudents ? 'Loading...' : isErrorStudents ? errorStudents.message : studentCount}
                  </strong>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link to="/viewStudents" className="small text-white stretched-link">View Details</Link>
                  <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                </div>
              </div>
            </div>

            {/* Today's Payment */}
            <div className="col-xl-3 col-md-6">
              <div className="card bg-warning text-white mb-4">
                <div className="card-body">
                  <small>Today's Payment:</small>{' '}
                  <strong>
                    {isLoadingToday ? 'Loading...' : isErrorToday ? errorToday.message : `KES ${todayPayment?.toLocaleString()}`}
                  </strong>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link to="/viewPayment" className="small text-white stretched-link">View Details</Link>
                  <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                </div>
              </div>
            </div>

            {/* Total Payment */}
            <div className="col-xl-3 col-md-6">
              <div className="card bg-danger text-white mb-4">
                <div className="card-body">
                  <small>Total Payment:</small>{' '}
                  <strong>
                    {isLoadingTotal ? 'Loading...' : isErrorTotal ? errorTotal.message : `KES ${totalPayment?.toLocaleString()}`}
                  </strong>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link to="/viewPayment" className="small text-white stretched-link">View Details</Link>
                  <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="col-xl-3 col-md-6">
              <div className="card bg-info text-white mb-4">
                <div className="card-body">
                  <small>Balance:</small>{' '}
                  <strong>
                    {isLoadingBalance ? 'Loading...' : isErrorBalance ? errorBalance.message : `KES ${balance?.toLocaleString()}`}
                  </strong>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link to="/viewPayment" className="small text-white stretched-link">View Details</Link>
                  <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Students Table */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-people me-1"></i>
              Ten Latest Students
              <Link to="/viewStudents" className="d-flex justify-content-end">View Details</Link>
            </div>
            <div className="card-body">
              <table id="datatablesSimple" className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Adm No.</th>
                    <th>Form</th>
                    <th>Parent Name</th>
                    <th>Parent Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingLatest ? (
                    <tr><td colSpan="6">Loading latest students...</td></tr>
                  ) : isErrorLatest ? (
                    <tr><td colSpan="6">Error loading students</td></tr>
                  ) : latestStudents.length === 0 ? (
                    <tr><td colSpan="6">No recent students found.</td></tr>
                  ) : (
                    latestStudents.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>{`${student.first_name} ${student.second_name} ${student.last_name}`}</td>
                        <td>{student.student_AdmNo}</td>
                        <td>{student.class}</td>
                        <td>{student.parent_name}</td>
                        <td>{student.parent_contact}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
