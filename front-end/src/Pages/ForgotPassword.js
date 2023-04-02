import './CreateAccount.css';

function goToLogin(e) {
  e.preventDefault();
  window.location = './';
}

function handleSubmit(e) {
  e.preventDefault();
  window.location = './';
}

function ForgotPassword() {
  return (
    <div className="createAccount">
      <h2>Forgot Password</h2>
      <div className="inputs-CreateAccount">
        <form onSubmit={handleSubmit}>
          <div className="input-containerCreateAccount">
            <input type="user" name="uname" placeholder="@username" required />
          </div>
          <div className="input-containerCreateAccount">
            <input type="mail" name="mail" placeholder="e-mail" required />
          </div>
          <div className="input-containerCreateAccount">
            <input type="spot" name="spotify" placeholder="spotify username" required />
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
