import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Fetch user by ID
const fetchUserById = async (id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/server/users/userById/${id}`
  );
  return res.data;
};

// ✅ Update user by ID
const updateUser = async ({ id, updatedUser }) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/server/users/updateUser/${id}`,
    updatedUser
  );
  return res.data;
};

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
  });

  // ✅ Fetch user data
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });

  // ✅ Populate form when data is loaded
  useEffect(() => {
    if (user?.user) {
      setFormData({
        firstName: user.user.firstName || "",
        secondName: user.user.secondName || "",
        lastName: user.user.lastName || "",
      });
    }
  }, [user]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Mutation for update
  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User updated successfully!");
      navigate("/viewusers");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Update failed");
    },
  });

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ id, updatedUser: formData });
  };

  return (
    <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4">Edit User</h1>

        {isLoading && <div className="alert alert-info">Loading user data...</div>}

        {isError && (
          <div className="alert alert-danger">
            Failed to load user: {error?.message}
          </div>
        )}

        {!isLoading && !isError && (
          <form onSubmit={handleSubmit}>
            {["firstName", "secondName", "lastName"].map((field) => (
              <div className="form-group mb-3" key={field}>
                <label className="form-label">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-success"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update User"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default EditUser;
