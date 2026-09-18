import api from "./api";

export const getAssignments = () => api.get("/assignments").then((res) => res.data);
export const createAssignment = (data) => api.post("/assignments", data).then((res) => res.data);
export const updateAssignment = (id, data) => api.put(`/assignments/${id}`, data).then((res) => res.data);
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`).then((res) => res.data);