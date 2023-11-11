import React, { useState, useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css"

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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("jwt"); // retrieve the JWT token from the cookie
      if (token) {
        try {
          const userResponse = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/return`, {}, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          const user = userResponse.data;
          if (user && !user.needToChangePass) {
            window.location = "./Map"; // redirect to Map if token is valid
          }
        } catch (error) {
          console.error("Token verification failed:", error);
        }
      }
    };
    checkToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Clear any existing error messages
    try {
      const baseURL = process.env.NODE_ENV === "production"
        ? "https://soundtrack-backend-io9tl.ondigitalocean.app"
        : "http://localhost:5002";
  
      const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/`, {
        username,
        password,
      });
      const token = response.data.token;
      Cookies.set("jwt", token); // Store JWT token in a cookie
      //console.log(token);
  
      const userResponse = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/return`, {
        }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      const user = userResponse.data;
  
      if (user.needToChangePass) {
        window.location = "./ChangePassword";
      } else {
        window.location = "./Map";
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to log in. Please try again."); 
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
      <div className="error-message-container">
  <div className={`error-message ${errorMsg ? 'show' : ''}`} aria-live="assertive">
    {errorMsg}
  </div>
</div>

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
            <button type="submit" className = "login-button">login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
