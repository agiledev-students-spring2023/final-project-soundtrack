import './CreateAccount.css';
import React, { useState } from "react";


function goToLogin(e) {
    e.preventDefault();
    window.location = './';
}

function ForgotPassword() {

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
          <p>Please check your email linked with the account for your password.</p>
          
              <div className="linksAccountForgot">
                <label onClick={goToLogin}>Log in</label>
              </div>
        </div>
      );
}

export default ForgotPassword;
