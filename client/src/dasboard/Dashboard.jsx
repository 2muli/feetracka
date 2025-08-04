import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fetcher = async (url) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}${url}`, { withCredentials: true });
  return res.data;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, userDetails } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌞 Good morning";
    if (hour < 17) return "🌤️ Good afternoon";
    if (hour < 21) return "🌇 Good evening";
    return "🌙 Good night";
  }, [new Date().getHours()]);

  const { data: studentCount, isLoading: loadingStudents, error: errorStudents } = useQuery({
    queryKey: ['studentCount'],
    queryFn: () => fetcher('/server/students/studentNumber').then(data => data.count),
    enabled: isAuthenticated,
  });

  const { data: todayPayment, isLoading: loadingToday, error: errorToday } = useQuery({
    queryKey: ['todayPayment'],
    queryFn: () => fetcher('/server/payments/todayPayments').then(data => data.totalPaidToday),
    enabled: isAuthenticated,
  });

  const { data: totalPayment, isLoading: loadingTotal, error: errorTotal } = useQuery({
    queryKey: ['totalPayment'],
    queryFn: () => fetcher('/server/payments/getTotalPayments').then(data => data.totalPaid),
    enabled: isAuthenticated,
  });

  const { data: balance, isLoading: loadingBalance, error: errorBalance } = useQuery({
    queryKey: ['balance'],
    queryFn: () => fetcher('/server/payments/getBalance').then(data => data.balance),
    enabled: isAuthenticated,
  });

  const { data: latestStudents = [], isLoading: loadingLatest, error: errorLatest } = useQuery({
    queryKey: ['latestStudents'],
    queryFn: () => fetcher('/server/students/getLatestStudents'),
    enabled: isAuthenticated,
  });

  if (loading) return <div className="text-white p-4">Checking authentication...</div>;
  if (!isAuthenticated) return <div className="text-white p-4">You must be logged in to view this page.</div>;

  return (
    <div className="sb-nav-fixed d-flex">
      <main id="layoutSidenav_content" className="w-100">
        <div className="container-fluid px-4">
        <h1 className="mt-4">
        {greeting},{" "}
      {userDetails?.user?.firstName && userDetails?.user?.lastName
        ? `${userDetails.user.firstName} ${userDetails.user.lastName}`
        : "Malioni Clerk"}{" "}
      👋
    </h1>

          <div className="row">
            {[
              { title: 'Total Students', value: studentCount, loading: loadingStudents, error: errorStudents, link: '/viewStudents', color: 'success' },
              { title: "Today's Payment", value: todayPayment, loading: loadingToday, error: errorToday, link: '/viewPayment', color: 'warning' },
              { title: 'Total Payment', value: totalPayment, loading: loadingTotal, error: errorTotal, link: '/viewPayment', color: 'danger' },
              { title: 'Balance', value: balance, loading: loadingBalance, error: errorBalance, link: '/viewPayment', color: 'info' }
            ].map(({ title, value, loading, error, link, color }, idx) => (
              <div className="col-xl-3 col-md-6" key={idx}>
                <div className={`card bg-${color} text-white mb-4`}>
                  <div className="card-body">
                    <small>{title}:</small>{' '}
                    <strong>
                      {loading ? 'Loading...' : error ? error.message : `KES ${Number(value).toLocaleString()}`}
                    </strong>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <Link to={link} className="small text-white stretched-link">View Details</Link>
                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between">
              <div><i className="bi bi-people me-1"></i>Ten Latest Students</div>
              <Link to="/viewStudents">View Details</Link>
            </div>
            <div className="card-body">
              <table className='table table-hover table-striped'>
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
                  {loadingLatest ? (
                    <tr><td colSpan="6">Loading...</td></tr>
                  ) : errorLatest ? (
                    <tr><td colSpan="6">Error loading students</td></tr>
                  ) : latestStudents.length === 0 ? (
                    <tr><td colSpan="6">No recent students found.</td></tr>
                  ) : (
                    latestStudents.map((s, i) => (
                      <tr key={s.id}>
                        <td>{i + 1}</td>
                        <td>{`${s.first_name} ${s.second_name} ${s.last_name}`}</td>
                        <td>{s.student_AdmNo}</td>
                        <td>{s.class}</td>
                        <td>{s.parent_name}</td>
                        <td>{s.parent_contact}</td>
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
