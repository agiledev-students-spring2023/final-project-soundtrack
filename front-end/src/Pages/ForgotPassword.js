import './CreateAccount.css';
import React, { useState } from "react";
import axios from "axios";

function goToLogin(e) {
    e.preventDefault();
    window.location = './';
}


function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const baseURL = process.env.NODE_ENV === "production"
    ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
    : "http://localhost:5002";
    
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/forgot`, {
          username,
          email,
        });
        window.location = "./Email";
  
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };

    return (
        <div className="createAccount">
          <div className="LogoText">
            <img
              src={require('../Logos/soundTrackIcon.png')}
              width="100px"
              height="100px"
              srcSet={require('../Logos/icon.svg')}
            />
          </div>
          <h2>Forgot Password</h2>
          <div className="inputs">
        <form onSubmit={handleSubmit}>
          <div className="input-containerUserPass">
            <input
              type="username"
              name="uname"
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-containerUserPass">
            <input
              type="email"
              name="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
              <div className="linksAccountForgot">
                <label onClick={goToLogin}>Found my password! Log in</label>
              </div>
              <div className="login-button-container">
                <button type="submit">submit</button>
              </div>
            </form>
          </div>
        </div>
      );
}

export default ForgotPassword;
