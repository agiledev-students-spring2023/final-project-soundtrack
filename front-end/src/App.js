import { Routes, Route } from "react-router-dom";
import './App.css';

import Login from './Pages/Login'; 
import CreateAccount from "./Pages/CreateAccount";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="CreateAccount" element={<CreateAccount />}/>
    </Routes>
  );
}

export default App;
