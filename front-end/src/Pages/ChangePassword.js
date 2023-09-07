import './CreateAccount.css';
import './Settings.css';
import {useNavigate} from "react-router-dom"
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";



function ChangePassword()  {
    const [password, setPassword] = useState("");
  
    const baseURL = process.env.NODE_ENV === "production"
        ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
        : "http://localhost:5002";
        
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = Cookies.get("jwt");
        const config = {
        headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/change`, {
        password
        }, config);
        window.location = "./Map";
  
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };


const navigate = useNavigate(); 
  return (
    <div className="settings-page">
        <div className = "settings-header"> 
        <div onClick={() => navigate("/settings")} className="back-link">Back</div>
        </div>
        <div> Enter your new password</div>
        <div className="inputs-CreateAccount">
            <form onSubmit={handleSubmit}>
                <div className="input-containerCreateAccount">
                    <input
                    type="password"
                    name="password"
                    placeholder="new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
}

export default ChangePassword;