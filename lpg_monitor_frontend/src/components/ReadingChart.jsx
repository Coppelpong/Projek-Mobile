import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi modul Chart.js agar bisa digunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ReadingChart({ deviceId }) {
  // Gunakan URL Backend Render kamu
  const API_URL = "https://projek-mobile.onrender.com";
  
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data sensor dari backend
  const fetchReadings = async () => {
    if (!deviceId) return;

    try {
      // Mengambil data berdasarkan device ID
      const res = await fetch(`${API_URL}/api/readings/${deviceId}`);
      
      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Jika data kosong
      if (!Array.isArray(data) || data.length === 0) {
        setChartData(null);
        setLoading(false);
        return;
      }

      // Ambil 15 data terakhir saja agar grafik tidak terlalu padat
      const recentData = data.slice(-15);

      // Siapkan Labels (Waktu) dan Data (Berat & Persen)
      const labels = recentData.map((d) => 
        new Date(d.timestamp).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second:'2-digit' })
      );
      const weights = recentData.map((d) => d.weightKg);
      const percents = recentData.map((d) => d.percent);

      setChartData({
        labels,
        datasets: [
          {
            label: "Berat (Kg)",
            data: weights,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            yAxisID: 'y', // Sumbu Y Kiri
            tension: 0.3, // Garis agak melengkung
          },
          {
            label: "Persen (%)",
            data: percents,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            yAxisID: 'y1', // Sumbu Y Kanan
            tension: 0.3,
          },
        ],
      });
    } catch (error) {
      console.error("Gagal mengambil data chart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetch saat komponen dimuat, dan update setiap 5 detik
  useEffect(() => {
    fetchReadings();
    const interval = setInterval(fetchReadings, 5000); // Auto-refresh 5 detik
    return () => clearInterval(interval);
  }, [deviceId]);

  if (loading) return <p style={{fontSize: "12px", textAlign: "center"}}>Memuat data grafik...</p>;
  if (!chartData) return <p style={{fontSize: "12px", textAlign: "center", color: "#888"}}>Belum ada data sensor masuk.</p>;

  // Konfigurasi Tampilan Grafik (2 Sumbu Y)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monitoring Real-time' },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Berat (Kg)' },
        min: 0,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false }, // Hilangkan grid untuk sumbu kanan
        title: { display: true, text: 'Persen (%)' },
        min: 0,
        max: 100,
      },
    },
  };

  return <Line options={options} data={chartData} />;
}