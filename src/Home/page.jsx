import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import "./page.css";

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>Discord Bot Creator</h1>
        </header>
        <div className="App-content">
          <div className="button-container">
            <Link to="/NewProject">
              <button className="btn">Yeni Proje</button>
            </Link>
            <button className="btn">Yükle</button>
          </div>
          <div className="projects-section">
            <h2>Son Projeler</h2>
            <div className="project-block">
              <p>Proje 1</p>
            </div>
            <div className="project-block">
              <p>Proje 2</p>
            </div>
            <div className="project-block">
              <p>Proje 3</p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;