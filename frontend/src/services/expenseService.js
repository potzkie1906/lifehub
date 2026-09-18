// client/src/services/expenseService.js
import api from "./api";

export const getExpenses = () => api.get("/expenses").then((res) => res.data);
export const getExpenseSummary = () => api.get("/expenses/summary").then((res) => res.data);
export const createExpense = (data) => api.post("/expenses", data).then((res) => res.data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`).then((res) => res.data);
export const updateBudget = (monthly_budget) => api.put("/expenses/budget", { monthly_budget }).then((res) => res.data);