import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Simpan token di localStorage
        localStorage.setItem("token", data.access_token);

        alert("✅ Login berhasil!");
        window.location.href = "/dashboard"; // redirect ke dashboard
      } else {
        alert(`❌ Login gagal: ${data.detail || "Terjadi kesalahan."}`);
      }
    } catch (err) {
      console.error("Error saat login:", err);
      alert("⚠️ Tidak bisa terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Masuk ke Akun LPG Monitor</h2>
      <form onSubmit={handleLogin}>
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
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>

      <p>
        Belum punya akun?{" "}
        <a href="/register" style={{ color: "#0047b3", fontWeight: "600" }}>
          Daftar di sini
        </a>
      </p>
    </div>
  );
}
