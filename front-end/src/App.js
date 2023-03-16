import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './Pages/Login'; 
import Post from './Pages/Post';
import Camera from './Pages/Camera';
import User from './Pages/User';
import Friends from './Pages/Friends';
import Browse from './Pages/Browse';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route exact path="/Post" element={<Post />}></Route>
            <Route exact path="/Camera" element={<Camera />}></Route>
            <Route exact path="/User" element={<User />}></Route>
            <Route exact path="/Friends" element={<Friends />}></Route>
            <Route exact path="/Browse" element={<Browse />}></Route>

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
