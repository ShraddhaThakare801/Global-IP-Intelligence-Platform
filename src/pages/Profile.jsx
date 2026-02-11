//import "./Profile.css";

function Profile() {
  // Dummy user data (will come from backend later)
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "USER",
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        <div className="profile-item">
          <span className="label">Name:</span>
          <span className="value">{user.name}</span>
        </div>

        <div className="profile-item">
          <span className="label">Email:</span>
          <span className="value">{user.email}</span>
        </div>

        <div className="profile-item">
          <span className="label">Role:</span>
          <span className="value">{user.role}</span>
        </div>

        <button className="edit-btn" disabled>
          Edit Profile (Coming Soon)
        </button>
      </div>
    </div>
  );
}

export default Profile;
