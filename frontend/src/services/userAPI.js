import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL.replace('/blogs', '/users'),
});


//  Update profile
export const updateProfile = (data) =>
  API.put("/profile", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });

//  Get user info by ID
export const getUserById = async (userId) => {
  try {
    const res = await API.get(`/${userId}`);
    return res;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch user data";
  }
};

// Get blogs by user ID
export const getBlogsByUser = async (userId) => {
  try {
    const res = await API.get(`/${userId}/blogs`);
    return res;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch user blogs";
  }
};
