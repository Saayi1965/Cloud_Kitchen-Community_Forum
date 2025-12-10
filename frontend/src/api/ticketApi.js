import axios from 'axios';

const API = 'http://localhost:5000/api/tickets';

export const getTickets = (params) => axios.get(API, { params });
export const getTicket = (id) => axios.get(`${API}/${id}`);
export const createTicket = (ticketData) => axios.post(API, ticketData);
export const updateTicket = (id, ticketData) => axios.put(`${API}/${id}`, ticketData);
export const deleteTicket = (id) => axios.delete(`${API}/${id}`);
export const getTicketStats = () => axios.get(`${API}/stats/summary`);
