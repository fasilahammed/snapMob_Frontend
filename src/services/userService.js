import dotnetAPI from "../Api's/dotnetAPI";

// GET user profile
export const getUserById = async (id) => {
  const res = await dotnetAPI.get(`/user/${id}`);
  return res.data; 
};

// UPDATE user profile
export const updateUserProfile = async (id, formData) => {
  const res = await dotnetAPI.put(`/user/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// CHANGE PASSWORD
export const changePassword = async (id, payload) => {
  const res = await dotnetAPI.patch(`/user/${id}/change-password`, payload);
  return res.data;
};
