import axios from 'axios';

const API_URL = 'http://localhost:5006';

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed!');
  }
};
