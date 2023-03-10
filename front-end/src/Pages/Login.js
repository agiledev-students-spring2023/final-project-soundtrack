import './Login.css';

function createAccount(e) {
    e.preventDefault();
    window.location = './CreateAccount';
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
            <form>
                <div className="input-container">
                    <input type="text" name="uname" placeholder="@username" required />
                </div>
                <div className="input-container">
                    <input type="password" name="pass" placeholder="password" required />
                </div>
                <div className="links">
                    <label onClick={createAccount}>Create Account</label>
                    <label onClick={createAccount}>Forgot Password</label>
                </div>
                <div className="button-container">
                    <button type="submit">login</button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default Login;
