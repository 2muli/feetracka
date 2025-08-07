// src/context/AuthProvider.jsx
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import CookieExpire from "./CookieExpire";

axios.defaults.baseURL = import.meta.env.VITE_API_URL + "/server";
axios.defaults.withCredentials = true;

const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/loggedUser");
      setUserDetails(res.data);
      setIsAuthenticated(true);
      setHasLoggedInBefore(true);
      Cookies.set("user", JSON.stringify(res.data), { expires: 1 });
    } catch (error) {
      if (error.response?.status === 401 && hasLoggedInBefore) {
        setSessionExpired(true);
      }
      setIsAuthenticated(false);
      setUserDetails(null);
      Cookies.remove("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    const interval = setInterval(fetchUser, 15000); // check every 15s
    return () => clearInterval(interval);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post("/users/login", { email, password });
      const user = res.data.user;
      setUserDetails(user);
      setIsAuthenticated(true);
      setSessionExpired(false);
      setHasLoggedInBefore(true);
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post("/users/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      Cookies.remove("user");
      setUserDetails(null);
      setIsAuthenticated(false);
      setSessionExpired(false);
      setHasLoggedInBefore(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userDetails, login, logout, loading }}
    >
      <CookieExpire show={sessionExpired} />
      <div aria-hidden={sessionExpired}>{children}</div>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
