import './CreateAccount.css';
import {useNavigate} from "react-router-dom"


function handleSubmit(e){
    e.preventDefault();
    window.location = './User';
}

function Settings() {
const navigate = useNavigate(); 
  return (
    <div className="createAccount">
        <div className = "user-header"> 
            <a href="#" className="back-link" onClick = {() => {navigate("/user") }}>Back</a> 
        </div>
        <h2>Settings</h2>
        
        <div className="inputs-CreateAccount">
            <p>User account information</p>
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

export default Settings;
