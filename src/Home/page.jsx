import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { open } from '@tauri-apps/api/dialog';
import "./page.css";

function App() {
  const navigate = useNavigate();
  const appVersion = "0.2.8"; 

  const handleLoadProject = async () => {
    try {
      const selectedFolder = await open({
        directory: true,
        multiple: false,
        title: 'Proje Klasörünü Seçin'
      });

      if (selectedFolder) {
        navigate('/project', { state: { projectFolder: selectedFolder } });
      }
    } catch (error) {
      console.error('Proje yüklenirken hata oluştu:', error);
      alert('Proje yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

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
          <button className="btn" onClick={handleLoadProject}>Yükle</button>
        </div>
      </div>
      <footer className="App-footer">
        <p className="creator">Created by XTEND | Physic</p>
        <p className="version">v{appVersion}</p>
      </footer>
    </div>
  );
}

export default App;