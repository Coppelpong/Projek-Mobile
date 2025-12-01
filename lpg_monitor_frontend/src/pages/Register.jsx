import React, { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }), // ✅ kirim lengkap
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Pendaftaran berhasil! Silakan login.");
        window.location.href = "/login";
      } else {
        alert(`❌ Gagal mendaftar: ${data.detail || "Terjadi kesalahan."}`);
      }
    } catch (error) {
      console.error("Error saat koneksi ke server:", error);
      alert("⚠️ Gagal terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Daftar Akun LPG Monitor</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nama pengguna"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>

      <p>
        Sudah punya akun?{" "}
        <a href="/login" style={{ color: "#0047b3", fontWeight: "600" }}>
          Login di sini
        </a>
      </p>
    </div>
  );
}
