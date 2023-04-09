import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function createAccount(e) {
  e.preventDefault();
  window.location = "./CreateAccount";
}

function forgotPassword(e) {
  e.preventDefault();
  window.location = "./ForgotPassword";
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5002/loginCheck", {
        username,
        password,
      });
      console.log(response.data);
      const token = response.data.token;
      Cookies.set("jwt", token); // Store JWT token in a cookie
      console.log("token in the cookies is " + Cookies.get("jwt"));
      window.location = "./Map";

    } catch (error) {
      console.error(error);
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="Login">
      <div className="LogoText">
        <img
          src={require("../Logos/soundTrackFullLogo.png")}
          width="300px"
          height="300px"
          srcSet={require("../Logos/fullLogo.svg")}
        />
      </div>
      <h2>LOGIN</h2>
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
              type="password"
              name="pass"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="linksAccountForgot">
            <label onClick={createAccount}>Create Account</label>
            <label onClick={forgotPassword}>Forgot Password</label>
          </div>
          <div className="login-button-container">
            <button type="submit">login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
