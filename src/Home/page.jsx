import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { open } from "@tauri-apps/api/dialog";
import "./page.css";

function App() {
  const navigate = useNavigate();
  const appVersion = "0.2.9";
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadProject = async () => {
    try {
      const selectedFolder = await open({
        directory: true,
        multiple: false,
        title: "Proje Klasörünü Seçin",
      });

      if (selectedFolder) {
        navigate("/project", { state: { projectFolder: selectedFolder } });
      }
    } catch (error) {
      console.error("Proje yüklenirken hata oluştu:", error);
      alert("Proje yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };
  if (showSplash) {
    return (
      <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
        <h1 className="splash-text">
          <span>D</span>
          <span>i</span>
          <span>s</span>
          <span>c</span>
          <span>o</span>
          <span>r</span>
          <span>d</span>
          <span>&nbsp;</span>
          <span>B</span>
          <span>o</span>
          <span>t</span>
          <span>&nbsp;</span>
          <span>C</span>
          <span>r</span>
          <span>e</span>
          <span>a</span>
          <span>t</span>
          <span>o</span>
          <span>r</span>
        </h1>
      </div>
    );
  }

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
          <button className="btn" onClick={handleLoadProject}>
            Yükle
          </button>
        </div>
      </div>
      <footer className="App-footer">
        <p className="creator">Created by Physic | XTEND</p>
        <p className="version">v{appVersion}</p>
      </footer>
    </div>
  );
}

export default App;
