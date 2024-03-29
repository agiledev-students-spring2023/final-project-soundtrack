import "./CreateAccount.css";
import "./Settings.css";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import "./User.css";
import { useNavigate } from "react-router-dom";
import Compressor from "compressorjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

function handleSubmit(e) {
  e.preventDefault();
  window.location = "./settings";
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadedAvatar, setUploadedAvatar] = useState(null);

  const token = Cookies.get("jwt");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setData(result.data);
      })
      .catch((err) => {
        setError("Failed to fetch data from the server");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  async function handleFileUpload(event) {
    const file = event.target.files[0];
  
    new Compressor(file, {
      quality: 0.6,
      success: async (compressedFile) => {
        setSelectedFile(compressedFile);
  
        const formData = new FormData();
        formData.append("avatar", compressedFile);
  
        const token = Cookies.get("jwt");
  
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_HOSTNAME}/user/avatar`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setUploadedAvatar(response.data.avatar);
        } catch (error) {
          console.error(error);
        }
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  }  

  async function handleSubmit(e) {
    e.preventDefault();

    const token = Cookies.get("jwt");

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/user/username`,
        { username: newUsername },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

    //console.log(response.data);
    navigate('/settings');
  } catch (error) {
    console.error(error);
  }
}

return (
  <div className="settings-page">
    <div className="settings-header">
      <div onClick={() => navigate("/settings")} className="back-link">
        Back
      </div>
    </div>
    <h1> Edit profile </h1>
    <div className="avatar-container">
      <div className="user-profile">
        <img src={uploadedAvatar || data.avatar} alt="Profile" />
      </div>

      <div className="file-upload-container">
        <label htmlFor="avatar-upload" className="avatar-upload-label">
          <FontAwesomeIcon icon={faCamera} />
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileUpload}
          className="file-upload-input"
          style={{ display: "none" }}
        />
      </div>
    </div>

    <div className="inputs-CreateAccount">
      <h2>Change username:</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-containerCreateAccount">
        <input
          type="text"
          name="username"
          placeholder={data.userName ? `@${data.userName}` : '@username'} 
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          required
          />
        </div>
        <div className="login-button-container">
          <button type="submit" className = "submit-button">save</button>
        </div>
      </form>
    </div>
  </div>
);

};

export default EditProfile;
