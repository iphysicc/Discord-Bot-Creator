import { BrowserRouter, Route, Routes, Router, Link } from "react-router-dom";
import "./App.css";
import NewProject from "./NewProject/page.jsx";
import Home from "./Home/page.jsx";
import Project from "./Project/Project.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/NewProject" element={<NewProject />} />
          <Route path="/Project" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
