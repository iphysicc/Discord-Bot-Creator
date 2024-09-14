import React from 'react';
import { BrowserRouter, Route, Routes, Router, Link } from 'react-router-dom';
import NewProject from './NewProject/page.jsx';
import Home from './Home/page.jsx';
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newproject" element={<NewProject />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;