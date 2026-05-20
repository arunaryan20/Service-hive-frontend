import api from "../api/axios";

export const loginAdmin = async (data: { email: string; password: string }) => {
  const response = await api.post("/admin/admin-login", data);
  return response.data;
};

export const signupAdmin = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const response = await api.post("/admin/create-admin", data);

  return response.data;
};
