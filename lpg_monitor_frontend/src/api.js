const API_URL = "http://127.0.0.1:8000/api";

export const getDevices = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${API_URL}/devices/`, { // ✅ PAKAI SLASH DI AKHIR
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Gagal mengambil data device");
  }

  return res.json();
};

export const registerDevice = async (device) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  // Kirim sebagai FormData
  const formData = new FormData();
  formData.append("name", device.name);
  formData.append("location", device.location);

  const res = await fetch("http://127.0.0.1:8000/api/devices/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ⚠️ Jangan tambahkan Content-Type — biar FormData yang atur
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Gagal register device");
  }

  return data;
};
