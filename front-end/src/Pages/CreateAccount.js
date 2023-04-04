import './CreateAccount.css';

function goToLogin(e) {
    e.preventDefault();
    window.location = './';
}

function handleSubmit(e){
    e.preventDefault();
    window.location = './Map';
}

function CreateAccount() {
  return (
    <div className="createAccount">
        <div className="LogoText">
            <img 
                src={require('../Logos/soundTrackIcon.png')} 
                width="100px"
                height="100px"
                srcSet={require('../Logos/fullLogo.svg')} />
        </div>
        <h2>Create Account</h2>
        <div className="inputs-CreateAccount">
            <form onSubmit={handleSubmit}>
                <div className="input-containerCreateAccount">
                    <input type="name" name="name" placeholder="Name" required />
                </div>
                <div className="input-containerCreateAccount">
                    <input type="user" name="uname" placeholder="@username" required />
                </div>
                <div className="input-containerCreateAccount">
                    <input type="password" name="pass" placeholder="password" required />
                </div>
                <div className="input-containerCreateAccount">
                    <input type="mail" name="mail" placeholder="e-mail" required />
                </div>
                <div className="input-containerCreateAccount">
                    <input type="spot" name="spotify" placeholder="spotify username" required />
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
