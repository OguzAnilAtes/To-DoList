import axios from 'axios';

const API_URL = 'http://localhost:7144';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/Account/Login`, { username, password });
  return response.data;
};

export const Index = async (token) => {
  const response = await axios.get(`${API_URL}/Note/Index`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
