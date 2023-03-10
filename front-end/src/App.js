import { Routes, Route } from "react-router-dom";
import './App.css';
import Login from './Pages/Login'; 
import CreateAccount from "./Pages/CreateAccount";
import Post from './Pages/Post';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="CreateAccount" element={<CreateAccount />}/>
         <Route exact path="/Post" element={<Post />}/>
    </Routes>
  );
}

export default App;
