import api from "../api/axios";

export const getLeads = async () => {
  const response = await api.get("/lead/get-lead-list");

  return response.data;
};

export const createLead = async (data: any) => {
  const response = await api.post("/lead/create-lead", data);

  return response.data;
};

export const updateLead = async (id: string, data: any) => {
  const response = await api.put(`/lead/update-lead/${id}`, data);

  return response.data;
};

export const deleteLead = async (id: string) => {
  const response = await api.delete(`/lead/delete-lead/${id}`);

  return response.data;
};
