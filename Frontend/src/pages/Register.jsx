import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      alert("Register Failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Register</h3>

        <input className="form-control mb-2" placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input className="form-control mb-2" placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <input className="form-control mb-2" type="password" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />

        <select className="form-control mb-3"
          onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="admin">Admin</option>
          <option value="analyst">Analyst</option>
          <option value="viewer">Viewer</option>
        </select>

        <button className="btn btn-success w-100" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}