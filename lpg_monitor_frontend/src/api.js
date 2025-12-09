const API_URL = import.meta.env.VITE_API_BASE_URL + "/api";

// GET DEVICES
export const getDevices = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${API_URL}/devices/`, {
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

// REGISTER DEVICE
export const registerDevice = async (device) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const formData = new FormData();
  formData.append("name", device.name);
  formData.append("location", device.location);

  const res = await fetch(`${API_URL}/devices/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Gagal register device");
  }

  return data;
};
