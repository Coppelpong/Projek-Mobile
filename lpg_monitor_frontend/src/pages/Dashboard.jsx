import React, { useEffect, useState } from "react";
import ReadingChart from "../components/ReadingChart";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  // Pastikan URL backend benar (tanpa slash di akhir)
  const API_URL = "https://projek-mobile.onrender.com";

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
      fetchDevices(); // Refresh daftar device
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

  if (loading) return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading devices...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>LPG Monitor Dashboard</h1>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            style={{ padding: "8px 16px", backgroundColor: "#ff4d4f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>

        {/* --- FORM REGISTRASI DEVICE BARU --- */}
        <div className="register-section" style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h2>Register New Device</h2>
          <form onSubmit={handleRegisterDevice} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Device Name (e.g. Dapur)"
              value={newDevice.name}
              onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              required
              style={{ padding: "8px", flex: "1" }}
            />
            <input
              type="text"
              placeholder="Location (e.g. Rumah)"
              value={newDevice.location}
              onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
              required
              style={{ padding: "8px", flex: "1" }}
            />
            <button type="submit" style={{ padding: "8px 20px", backgroundColor: "#1890ff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Add Device
            </button>
          </form>
        </div>

        {/* --- DAFTAR DEVICE & CHART --- */}
        <div className="devices-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {devices.length === 0 ? (
            <p>Belum ada device. Silakan tambahkan device baru di atas.</p>
          ) : (
            devices.map((device) => (
              <div key={device._id} className="device-card" style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{device.name} ({device.location})</h3>
                <p style={{ fontSize: "12px", color: "#888" }}>ID: {device.device_id}</p>
                <div style={{ marginTop: "15px", height: "200px" }}>
                  {/* Komponen Chart dipanggil di sini */}
                  <ReadingChart deviceId={device.device_id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}