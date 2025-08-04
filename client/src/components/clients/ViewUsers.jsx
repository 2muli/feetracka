import axios from "axios";
import { confirmDialog } from "primereact/confirmdialog";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const USERS_PER_PAGE = 10;

const ViewUsers = () => {
  const { isAuthenticated, loading ,userDetails} = useAuth();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
console.log(userDetails)
  if (!isAuthenticated) return null;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/server/users`);
      console.log(res.data);
      setUsers(res.data.users || []); // Ensure correct structure
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, loading]);

  const handleDelete = (id) => {
    confirmDialog({
      message: "Do you want to delete this user??",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/server/users/${id}`);
          toast.success("User deleted successfully");
          fetchUsers();
        } catch (err) {
          console.error("Delete error:", err);
          toast.error("Failed to delete user?");
        }
      },
      reject: () => toast.info("Deletion cancelled"),
    });
  };
  const handleToggleActive = async (user) => {
    if(user.id === userDetails.user.id){
      toast.error("You cannot deactivate yourself");
      return;
    }
    try {
      const updatedUser = { isActive: user.isActive ? 0 : 1 };
  
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/server/users/${user.id}/toggle-activation`,
        updatedUser
      );
  
      toast.success(`User ${user.isActive ? "deactivated" : "activated"} successfully`);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Toggle activation failed:", error);
      toast.error("Failed to toggle user status");
    }
  };
  

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const indexOfLast = currentPage * USERS_PER_PAGE;
  const indexOfFirst = indexOfLast - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  return (
         <main className="sb-nav-fixed">
        <div className="container-fluid px-4">
          <h1 className="mt-4">View Users</h1>

          <div className="mb-3 d-flex justify-content-between no-print">
            <Link to="/adduser">
              <button className="btn btn-success">Add User</button>
            </Link>
          </div>

          {users.length === 0 ? (
            <div className="alert alert-info no-print">No users found.</div>
          ) : (
            <>
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id || index}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{`${user?.first_name} ${user?.second_name} ${user?.last_name}`}</td>
                      <td>{user?.email}</td>
                      <td>{user?.phone}</td>
                      <td>{user?.role}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${user?.isActive ? "btn-success" : "btn-warning"}`}
                          onClick={() => handleToggleActive(user)}
                        >
                          {user?.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td>{new Date(user?.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/edituser/${user?.id}`}>
                          <button className="btn btn-primary btn-sm me-2">Edit</button>
                        </Link>
                        {userDetails.user.id !== user.id && <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-center text-white fw-bold my-3 no-print">
                Total Users: {users.length}
              </div>

              {users.length > USERS_PER_PAGE && (
                <nav className="d-flex justify-content-center">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
  );
};

export default ViewUsers;
