import React, { useEffect, useState } from "react";
import ReadingChart from "../components/ReadingChart";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  // Hardcode URL agar aman dari masalah slash
  const API_URL = "https://projek-mobile.onrender.com";

  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Jangan redirect paksa jika loading pertama, cukup set user kosong/login ulang manual
        // window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_URL}/api/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
           localStorage.removeItem("token");
           window.location.href = "/login";
        }
        return;
      }

      const data = await res.json();
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
      const res = await fetch(`${API_URL}/api/devices/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDevice),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal menambah device");

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

  if (loading) return <p style={{textAlign:"center", padding:"20px"}}>Loading devices...</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>LPG Monitor Dashboard</h1>
          <button 
            onClick={handleLogout}
            style={{ padding: "8px 16px", backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>

        {/* FORM REGISTER */}
        <div style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <h3>Register New Device</h3>
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
            <button type="submit" style={{ padding: "8px 20px", backgroundColor: "#0275d8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Add Device
            </button>
          </form>
        </div>

        {/* LIST DEVICES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {devices.map((device) => (
            <div key={device._id || device.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 5px 0" }}>{device.name}</h3>
              <p style={{ margin: "0 0 15px 0", color: "#666" }}>Loc: {device.location}</p>
              
              {/* MENAMPILKAN ID DEVICE AGAR BISA DICOPY KE ARDUINO */}
              <div style={{ backgroundColor: "#eee", padding: "8px", borderRadius: "4px", fontSize: "12px", marginBottom: "15px", wordBreak: "break-all" }}>
                <strong>ID:</strong> {device._id || device.id}
              </div>

              {/* TAMPILKAN GRAFIK */}
              <div style={{ height: "200px" }}>
                <ReadingChart deviceId={device._id || device.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}