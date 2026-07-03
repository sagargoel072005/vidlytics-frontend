import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}/signup`,
        form,
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (err) {
      console.log(err);
      alert(
        err?.response?.data || "Signup Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-100 p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Signup
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded mb-4"
          value={form.firstName}
          onChange={(e) =>
            setForm({
              ...form,
              firstName: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded mb-4"
          value={form.lastName}
          onChange={(e) =>
            setForm({
              ...form,
              lastName: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={form.emailId}
          onChange={(e) =>
            setForm({
              ...form,
              emailId: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded"
        >
          {loading
            ? "Creating Account..."
            : "Signup"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?
          <Link
            to="/"
            className="text-blue-500 ml-1"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;