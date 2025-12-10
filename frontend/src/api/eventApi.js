import axios from "axios";

const API = "http://localhost:5000/api/events";

const normalize = (res) => {
	// Prefer res.data.data (common wrapper), then specific keys, then raw data
	const d = res?.data;
	if (d == null) return { data: null };
	const payload = d.data ?? d.event ?? d.events ?? d;
	return { data: payload };
};

export const createEvent = (data) =>
	axios.post(API, data).then(normalize);

export const getEvents = () =>
	axios.get(API).then(normalize);

export const deleteEvent = (id) =>
	axios.delete(`${API}/${id}`).then(normalize);

export const getEvent = (id) =>
	axios.get(`${API}/${id}`).then(normalize);

export const updateEvent = (id, data) =>
	axios.put(`${API}/${id}`, data).then(normalize);
