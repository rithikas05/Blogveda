import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const getAllBlogs = () => API.get('/');

export const getBlogById = (id) => API.get(`/${id}`); // Used in EditBlog
export const getBlogBySlug = (slug) => API.get(`/slug/${slug}`); //  Used in ViewBlog

export const createBlog = (formData) =>
  API.post('/', formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateBlog = (id, formData) =>
  API.put(`/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteBlog = (id) =>
  API.delete(`/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  });

export const getFeaturedBlogs = async () => {
  const res = await API.get("/featured");
  return res.data;
  
};
console.log("Featured API hit"); 


  
export const toggleLike = (id) =>
  API.put(`/${id}/like`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });

export const addComment = (blogId, data) =>
  API.post(`/${blogId}/comments`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  });

export const deleteComment = (blogId, commentId) =>
  API.delete(`/${blogId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  });

export const updateProfile = (data) =>
  API.put('/profile', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
