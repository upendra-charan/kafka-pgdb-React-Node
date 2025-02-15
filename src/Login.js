import React, { useState, useEffect } from "react";

import './Login.css';
import { loginUser } from "./services/authService";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [kafkaMessages, setKafkaMessages] = useState([]);

console.log("kafkaMessages", kafkaMessages)

useEffect(() => {
  // Polling every 5 seconds to fetch new messages
  const interval = setInterval(async () => {
    try {
      const response = await axios.get('http://localhost:5005/messages');
      console.log('Fetched messages:', response.data.messages);  // Check response

      // Update the state with new messages
      setKafkaMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, 500000000); // Poll every 5 seconds

  // Cleanup polling when the component unmounts
  return () => clearInterval(interval);
}, []); // Empty dependency array ensures this runs only once when the component mounts

const clearMessages = async () => {
  try {
    await axios.post('http://localhost:5000/clear-messages');
    console.log("Messages cleared!");
    // Optionally reset the local state in React
    setKafkaMessages([]);  // Clear the messages in React state
  } catch (error) {
    console.error('Error clearing messages:', error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(username, password); // Call the service function
      console.log('Login successful:', data?.message);
      // Handle successful login, e.g., store token or redirect
      alert('Login successful!');
    } catch (error) {
      console.log("setError>>setError>err", error)
      setError(error?.message); // Set the error message from the service
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post('http://localhost:5000/send', { message });
      // alert(response.data.status);
      console.log("Response: ", response);
      setMessage(''); // Clear the input afte
      if (response.status == '200') setLoading(false);
    } catch (error) {
      setLoading(false);
      alert('Error sending message');
    }
  };

  const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num+2);
console.log(doubled); 

  return (
    <div className="login-container">
      <h2>React and Kafka Integration</h2>

      <h2></h2>
      <div className="form-group">
      <input 
        type="text" 
        value={message} 
        onChange={handleMessageChange} 
        placeholder="Enter message" 
      />
      {loading ? (
        <button onClick={handleSendMessage}><span className="spinner"></span></button>
           // A simple loading spinner (could be an icon)
        ) : (
      <button onClick={handleSendMessage}>Send to Kafka</button>
    )}
      </div>

      <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
  {kafkaMessages.length > 0 && <h4 >Message Receving from Kafka:</h4>}
  {kafkaMessages.length > 0 && <button type="reset" onClick={clearMessages}>Clear</button>}
</div>

      <ul>
        {kafkaMessages.map((msg, index) => (
          <h5 style={{ display: 'flex', alignItems: 'flex-start'}} key={index}>{msg}</h5>
        ))}
      </ul>

      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{'error'}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
