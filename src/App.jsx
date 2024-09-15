import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { BrowserRouter, Route, Routes, Router, Link } from 'react-router-dom';
import "./App.css";
import NewProject from './NewProject/page.jsx';
import Home from './Home/page.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/NewProject" element={<NewProject />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;