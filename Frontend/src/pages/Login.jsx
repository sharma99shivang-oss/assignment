import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Register Failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h3 className="text-center mb-3">Finance Login</h3>
        <input className="form-control mb-3" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="form-control mb-3" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
        <p className="mt-3 text-center">
          New user? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
