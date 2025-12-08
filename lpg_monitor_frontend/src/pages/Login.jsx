import React, { useState } from "react";

export default function Login() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login berhasil!");
        window.location.href = "/dashboard";
      } else {
        alert(data.detail || "Login gagal");
      }
    } catch (err) {
      alert("Tidak bisa terhubung ke backend");
    } finally {
      setLoading(false);
    }
  };
