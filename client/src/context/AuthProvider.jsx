import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import CookieExpire from "./CookieExpire";

axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}/server`;
axios.defaults.withCredentials = true;

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(false); // 🆕 key

  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/loggedUser");
      setUserDetails(res.data);
      setIsAuthenticated(true);
      setHasLoggedInBefore(true); // ✅ user was authenticated before
      Cookies.set("user", JSON.stringify(res.data), { expires: 1 }); // 1 day
    } catch (error) {
      if (error.response?.status === 401 && hasLoggedInBefore) {
        // ✅ Only show modal if token expired after being logged in
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
    const interval = setInterval(fetchUser, 10000); // check every 10s
    fetchUser(); // initial
    return () => clearInterval(interval);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post("/users/login", { email, password });
      setUserDetails(res.data.user);
      setIsAuthenticated(true);
      setSessionExpired(false);
      setHasLoggedInBefore(true); // ✅
      Cookies.set("user", JSON.stringify(res.data.user), { expires: 1 });
      return res.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("user");
      setUserDetails(null);
      setIsAuthenticated(false);
      setSessionExpired(false);
      setHasLoggedInBefore(false); // 🧼 clear this too
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
