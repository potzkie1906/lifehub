import api from "./api";

export const getSubjects = () => api.get("/subjects").then((res) => res.data);
export const createSubject = (data) => api.post("/subjects", data).then((res) => res.data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data).then((res) => res.data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`).then((res) => res.data);