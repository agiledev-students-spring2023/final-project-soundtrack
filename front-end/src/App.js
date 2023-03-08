import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Login from './Pages/Login'; 

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
