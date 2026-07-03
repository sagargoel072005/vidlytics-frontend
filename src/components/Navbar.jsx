import { useDispatch } from "react-redux";
import { removeUser } from "../utils/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      dispatch(removeUser());

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white shadow px-8 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold">
        Vidlytics
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-5 py-2 rounded-lg"
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;