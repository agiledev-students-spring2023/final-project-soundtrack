import './CreateAccount.css';
import axios from 'axios';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function goToLogin(e) {
  e.preventDefault();
  window.location = './';
}

function CreateAccount() {
  const [user, setUser] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    spotify: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { ...user, id: uuidv4() };
    axios
      .post('http://localhost:5002/Create', newUser)
      .then((response) => {
        console.log(response.data);
        res.status(201).send(newUser);
        window.location = './';
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 400) {
          alert('Username already exists. Please choose a different username.');
          res.status(400).send('Username already exists');
        } else {
          alert('Error creating user. Please try again.');
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
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
      <h2>Create Account</h2>
      <div className="inputs-CreateAccount">
        <form onSubmit={handleSubmit}>
          <div className="input-containerCreateAccount">
            <input
              type="name"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-containerCreateAccount">
            <input
              type="user"
              name="username"
              placeholder="@username"
              value={user.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-containerCreateAccount">
            <input
              type="password"
              name="password"
              placeholder="password"
              value={user.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-containerCreateAccount">
            <input
              type="mail"
              name="email"
              placeholder="e-mail"
              value={user.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-containerCreateAccount">
            <input
              type="spot"
              name="spotify"
              placeholder="spotify username"
              value={user.spotify}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="linksAccountForgot">
            <label onClick={goToLogin}>Already have an account? Log in</label>
          </div>
          <div className="login-button-container">
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
