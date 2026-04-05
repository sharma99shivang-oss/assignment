import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [role, setRole] = useState("admin");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [form, setForm] = useState({
    amount: "",
    type: "income",
    category: "",
    date: "",
    note: ""
  });

  const [editingId, setEditingId] = useState(null);
  const fetchRecords = async () => {
    const res = await API.get("/records");
    setRecords(res.data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const addRecord = async () => {
    console.log("SENDING DATA:", form);
    await API.post("/records", form);
    fetchRecords();
  };

  const deleteRecord = async (id) => {
    await API.delete(`/records/${id}`);
    fetchRecords();
  };
  const updateRecord = async () => {
    console.log("UPDATING:", editingId, form);

    await API.put(`/records/${editingId}`, form);

    setEditingId(null);

    setForm({
      amount: "",
      type: "income",
      category: "",
      date: "",
      note: ""
    });

    fetchRecords();
  };
  const income = records
    .filter(r => r.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = records
    .filter(r => r.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  return (
    <div className="container mt-4">

      {/* NAVBAR */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>💰 Finance Dashboard</h3>

        <select
          className="form-select w-auto"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="row text-center mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white p-3">
            <h5>Income</h5>
            <h3>₹ {income}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-danger text-white p-3">
            <h5>Expense</h5>
            <h3>₹ {expense}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-dark text-white p-3">
            <h5>Balance</h5>
            <h3>₹ {balance}</h3>
          </div>
        </div>
      </div>

      {/* FORM (ADMIN ONLY) */}
      {role === "admin" && (
        <div className="card p-3 mb-4">
          <h5>Add Transaction</h5>

          <div className="row">
            <div className="col">
              <input
                className="form-control"
                placeholder="Amount"
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                placeholder="Notes"
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />
            </div>
            <div className="col">
              <select
                className="form-control"
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="col">
              <input
                className="form-control"
                placeholder="Category"
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />
            </div>

            <div className="col">
              <input
                type="date"
                className="form-control"
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>

            <div className="col">
              <button
                className="btn btn-primary w-100"
                onClick={editingId ? updateRecord : addRecord}
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Filter by category"
            onChange={(e) => setFilterCategory(e.target.value)}
          />
        </div>
      </div>
      {/* TABLE */}
      <div className="card p-3">
        <h5>Transactions</h5>

        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>Note</th>
              {role === "admin" && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {records
              .filter((r) => {
                return (
                  r.category.toLowerCase().includes(search.toLowerCase()) &&
                  (filterType ? r.type === filterType : true) &&
                  (filterCategory
                    ? r.category.toLowerCase().includes(filterCategory.toLowerCase())
                    : true)
                );
              })
              .map((r) => (
                <tr key={r._id}>
                  <td>₹ {r.amount}</td>
                  <td>{r.type}</td>
                  <td>{r.category}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.note}</td>
                  {role === "admin" && (
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteRecord(r._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          console.log("EDIT CLICKED", r); // debug

                          setEditingId(r._id);

                          setForm({
                            amount: r.amount,
                            type: r.type,
                            category: r.category,
                            date: r.date ? r.date.split("T")[0] : "",
                            note: r.note || ""
                          });
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}