import axios from "axios";
import { BASE_URL } from "../utils/constant";

export const getProfileAPI = () =>
  axios.get(`${BASE_URL}/profile/view`, { withCredentials: true });

export const getProfileStatsAPI = () =>
  axios.get(`${BASE_URL}/profile/stats`, { withCredentials: true });

export const editProfileAPI = (data) =>
  axios.patch(`${BASE_URL}/profile/edit`, data, { withCredentials: true });

export const changePasswordAPI = (data) =>
  axios.patch(`${BASE_URL}/profile/password`, data, { withCredentials: true });

export const uploadProfilePhotoAPI = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  return axios.post(BASE_URL + "/profile/upload-photo", formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
};