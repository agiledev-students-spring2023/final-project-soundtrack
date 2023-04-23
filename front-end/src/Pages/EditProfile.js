import './CreateAccount.css';
import './Settings.css';
import axios from 'axios';
import Cookies from "js-cookie";
import React, { useState, useEffect } from 'react';
import './User.css';
import {useNavigate} from "react-router-dom"


function handleSubmit(e){
    e.preventDefault();
    window.location = './settings';
}

const  EditProfile = () => {
  const navigate = useNavigate(); 
const [selectedFile, setSelectedFile] = useState(null);
const [newUsername, setNewUsername] = useState('');
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  const token = Cookies.get("jwt"); 

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/user`, {
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
  setSelectedFile(file);

  const formData = new FormData();
  formData.append('avatar', file);

  const token = Cookies.get('jwt');

  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}


async function handleSubmit(e) {
  e.preventDefault();

  const token = Cookies.get('jwt');

  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_SERVER_HOSTNAME}/user/username`,
      { username: newUsername },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    navigate('/settings');
  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="settings-page">
        <div className = "settings-header"> 
        <div onClick={() => navigate("/settings")} className="back-link">Back</div>
        </div>
        <h1> Edit profile </h1>
        <div className="user-profile">
        <img src={data.avatar} alt="Profile"/>

        </div>
       
        <div className="file-upload-container">
        <h2>Change Profile Picture:</h2>
        <input type="file" accept="image/*" onChange={handleFileUpload} className="file-upload-input" />
        {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      </div>
        <div className="inputs-CreateAccount">
          <h2>Change Username:</h2>
            <form onSubmit={handleSubmit}>
            <div className="input-containerCreateAccount">
            <input
              type="user"
              name="username"
              placeholder="@username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
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