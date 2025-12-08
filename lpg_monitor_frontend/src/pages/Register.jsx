import React, { useState } from "react";

export default function Register() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pendaftaran berhasil! Silakan login.");
        window.location.href = "/login";
      } else {
        alert(data.detail || "Error registering");
      }
    } catch (error) {
      alert("Tidak bisa terhubung ke backend.");
    } finally {
      setLoading(false);
    }
  };
