import axios from "axios";

const API = "http://localhost:5000/api/topics";

export const getTopics = () => axios.get(API);

export const upvoteTopic = (id, username) => 
    axios.post(`${API}/${id}/upvote`, { username });

export const downvoteTopic = (id, username) => 
    axios.post(`${API}/${id}/downvote`, { username });
