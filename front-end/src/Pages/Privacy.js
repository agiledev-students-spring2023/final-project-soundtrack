import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Privacy() {
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(false);

  const handleChange = () => {
    setIsPrivate(!isPrivate);
  };

  const handleSave = () => {
    // Save the privacy setting
    console.log(`Privacy setting saved. Is private: ${isPrivate}`);
  };

  return (
    <div className="page">
      <div className="settings-header">
        <div onClick={() => navigate('/settings')} className="back-link">Back</div>
      </div>
      <div> Make account </div>
      <div className="option">
        <label>Private</label>
        <input type="checkbox" checked={isPrivate} onChange={handleChange} />
      </div>
      <div className="option">
        <label>Public</label>
        <input type="checkbox" checked={!isPrivate} onChange={handleChange} />

      </div>
      <button className="save-button" onClick={() => { navigate('/Settings'); }}>Save</button>
    </div>
  );
}

export default Privacy;
