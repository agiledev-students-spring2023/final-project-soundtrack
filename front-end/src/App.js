import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './Pages/Login'; 
import Post from './Pages/Post';
import User from './Pages/User';
import Friends from './Pages/Friends';
import Browse from './Pages/Browse';
import Map from './Pages/Map';
import Favorites from './Pages/Favorites';
// import Filter from './Pages/Filter';
import ForgotPassword from './Pages/ForgotPassword';
import CreateAccount from './Pages/CreateAccount';
import Settings from "./Pages/Settings";
import LocationProfile from "./Pages/LocationProfile";
import ChangePassword from "./Pages/ChangePassword";
import Privacy from "./Pages/Privacy";
import EditProfile from "./Pages/EditProfile";
import Auth from "./Pages/Auth"; 
import AccessTest from "./Pages/AccessTest"; 



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route exact path="/Post" element={<Post />}></Route>

            <Route exact path="/User" element={<User />}></Route>
            <Route exact path="/Friends" element={<Friends />}></Route>
            <Route exact path="/Browse" element={<Browse />}></Route>
            <Route exact path="/Map" element={<Map />}></Route>
            <Route exact path="/Favorites" element={<Favorites />}></Route>
            {/* <Route exact path="/Filter" element={<Filter />}></Route> */}
            <Route exact path="/CreateAccount" element={<CreateAccount />}></Route>
            <Route exact path="/ForgotPassword" element={<ForgotPassword />}></Route>
            <Route exact path="/Settings" element={<Settings />}></Route>
            <Route exact path="/ChangePassword" element={<ChangePassword />}></Route>
            <Route exact path="/Privacy" element={<Privacy />}></Route>
            <Route exact path="/LocationProfile" element={<LocationProfile />}></Route>
            <Route exact path="/EditProfile" element={<EditProfile />}></Route>
            <Route exact path="/Auth" element={<Auth />}></Route>
            <Route exact path="/AccessTest" element={<AccessTest />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;