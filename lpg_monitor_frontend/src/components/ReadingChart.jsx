// Dashboard.jsx
import Navbar from "../components/Navbar";

function DummyChart() {
  return <p>Chart akan tampil di sini.</p>;
}

export default function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="navbar">
        <span>LPG Monitor Dashboard</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard">
        <h1>Daftar Perangkat</h1>
        <p>Belum ada perangkat terdaftar.</p>

        <div className="chart-container">
          <DummyChart />
        </div>
      </div>
    </>
  );
}
