import './Login.css';

function createAccount(e) {
  e.preventDefault();
  window.location = './CreateAccount';
}

function forgotPassword(e) {
  e.preventDefault();
  window.location = './ForgotPassword';
}

function handleSubmit(e) {
  e.preventDefault();
  window.location = './Map';
}

function Login() {
  return (
    <div className="Login">
      <div className="logo">
        <h1>SoundTack</h1>
        <p>full logo to be added when developed</p>
      </div>
      <h2>LOGIN</h2>
      <div className="inputs">
        <form onSubmit={handleSubmit}>
          <div className="input-containerUserPass">
            <input type="user" name="uname" placeholder="@username" required />
          </div>
          <div className="input-containerUserPass">
            <input type="password" name="pass" placeholder="password" required />
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
