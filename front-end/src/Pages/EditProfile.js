import './CreateAccount.css';
import './Settings.css';
import React, { useState, useEffect } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';

function handleSubmit(e) {
  e.preventDefault();
  window.location = './settings';
}

function EditProfile() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    setSelectedFile(file);
  }
  return (
    <div className="settings-page">
      <div className="settings-header">
        <div onClick={() => navigate('/settings')} className="back-link">Back</div>
      </div>
      <div> Edit profile </div>
      <div className="user-profile">
        <img src="image.jpeg" alt="Profile" />
      </div>
      <div />
      <div>
        <input type="file" onChange={handleFileUpload} />
        {selectedFile && (
        <p>
          Selected file:
          {selectedFile.name}
        </p>
        )}
      </div>
      <div className="inputs-CreateAccount">
        <form onSubmit={handleSubmit}>
          <div className="input-containerCreateAccount">
            <input type="user" name="pass" placeholder="@username" required />
          </div>
          <div className="login-button-container">
            <button type="submit">save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
