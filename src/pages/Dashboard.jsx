//import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="card-grid">
        <div className="dashboard-card">
          <h3>Total Searches</h3>
          <p>0</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Subscriptions</h3>
          <p>0</p>
        </div>

        <div className="dashboard-card">
          <h3>Notifications</h3>
          <p>No new alerts</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
