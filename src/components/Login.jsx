import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [emailId, setEmailId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);

      dispatch(addUser(res.data));

      navigate("/dashboard");
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white w-100 p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={emailId}
          onChange={(e) =>
            setEmailId(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded"
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>

        <p className="mt-4 text-center">
          New User?
          <Link
            to="/signup"
            className="text-blue-500 ml-1"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;