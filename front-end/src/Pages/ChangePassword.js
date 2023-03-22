import './CreateAccount.css';
import './Settings.css';
import {useNavigate} from "react-router-dom"


function handleSubmit(e){
    e.preventDefault();
    window.location = './settings';
}

function ChangePassword() {
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
                    <input type="password" name="pass" placeholder="New Password" required />
                </div>
                <div className="login-button-container">
                    <button type="submit">submit</button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default ChangePassword;