import React, { useEffect, useState } from "react";
import ReadingChart from "../components/ReadingChart";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);

  // ============================================
  // ✅ Fetch list perangkat dari backend
  // ============================================
  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Token tidak ditemukan. Silakan login kembali.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/devices", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data device");
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.error("Error fetching devices:", err);
      alert("⚠️ Gagal mengambil daftar perangkat dari server.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ Daftarkan device baru ke backend
  // ============================================
  const handleRegisterDevice = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Token tidak ditemukan. Silakan login kembali.");
        window.location.href = "/login";
        return;
      }
  
      const res = await fetch("http://127.0.0.1:8000/api/devices/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newDevice.name,
          location: newDevice.location,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.detail || "Gagal register device");
      }
  
      alert("✅ Device berhasil diregistrasi!");
      setNewDevice({ name: "", location: "" });
      fetchDevices();
    } catch (err) {
      console.error("Error registering device:", err);
      alert(`❌ Gagal register device: ${err.message}`);
    }
  };  

  // ============================================
  // ✅ Logout
  // ============================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ============================================
  // ✅ Ambil data device saat halaman dibuka
  // ============================================
  useEffect(() => {
    fetchDevices();
  }, []);

  if (loading) return <p>Loading devices...</p>;

  // ============================================
  // ✅ Tampilan utama dashboard
  // ============================================
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>LPG Monitor Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        {/* ======= Form Register Device ======= */}
        <section className="register-device">
          <h2>Register New Device</h2>
          <form onSubmit={handleRegisterDevice}>
            <input
              type="text"
              placeholder="Device Name"
              value={newDevice.name}
              onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={newDevice.location}
              onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
              required
            />
            <button type="submit">Register Device</button>
          </form>
        </section>

        {/* ======= Daftar Device ======= */}
        <section className="device-list">
          <h2>Your Devices</h2>
          {devices.length === 0 ? (
            <p>No devices registered yet.</p>
          ) : (
            <ul>
              {devices.map((d) => (
                <li key={d._id}>
                  <strong>{d.name}</strong> – {d.location}
                  <ReadingChart deviceId={d._id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
