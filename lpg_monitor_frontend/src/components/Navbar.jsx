export default function Navbar() {
  return (
    <div className="navbar">
      <h2>LPG Monitor</h2>
      <div className="nav-links">
        <a href="/dashboard">Dashboard</a>
        <a href="/login" onClick={() => localStorage.removeItem("token")}>
          Logout
        </a>
      </div>
    </div>
  );
}
