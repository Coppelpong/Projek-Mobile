import React, { useEffect, useState } from "react";
import ReadingChart from "../components/ReadingChart";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Token tidak ditemukan. Silakan login kembali.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_URL}/api/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      setDevices(data);
    } catch (err) {
      console.error("Error fetching devices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterDevice = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Token tidak ditemukan.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_URL}/api/devices/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDevice),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      alert("Device registered!");
      setNewDevice({ name: "", location: "" });
      fetchDevices();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  if (loading) return <p>Loading devices...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>LPG Monitor Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}