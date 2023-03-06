//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Post from "./post";
import "./App.css";

const App = () => {
  console.log("Rendering App");
  return (
    <Post />



   /* <Router>
      <Routes>
        <Route path="/" element={<Post />} />
      </Routes>
      </Router> */ 
  );
};

export default App