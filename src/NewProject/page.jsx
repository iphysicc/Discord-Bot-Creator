import React, { useState } from 'react';
import './NewProject.css';
function NewProject() {
  const [klasorKonumu, setKlasorKonumu] = useState('');

  const handleKlasorSec = async () => {
    if (window.electronAPI) {  
      const klasor = await window.electronAPI.openDirectory();
      if (klasor) {
        setKlasorKonumu(klasor);
      }
    } else {
      console.error('electronAPI çalışmıyorq.');
    }
  };

  return (
    <div className="NewProject">
      <h1>Yeni Proje Oluştur</h1>
      <input id='projeadi' type="text" placeholder="Proje Adı" />
      <input type="text" placeholder="Proje Konumu" />
      <select>
        <option value="">DiscordJS Sürümü</option>
        <option value="v13">v13</option>
        <option value="v14">v14</option>
      </select>
      <button onClick={handleKlasorSec}>Klasör Seç</button>
      <p>Klasör Konumu: {klasorKonumu}</p>
      <button>Olustur</button>
      <button>Iptal</button>
    </div>
  );
}

export default NewProject;
