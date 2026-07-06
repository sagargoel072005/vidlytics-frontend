import axios from "axios";
import { BASE_URL } from "../utils/constant";


export const logoutAPI = () =>
  axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });