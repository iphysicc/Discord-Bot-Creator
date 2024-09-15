import React, { useState } from 'react';
import { dialog } from '@tauri-apps/api';
import { writeTextFile, createDir } from '@tauri-apps/api/fs';
import ProgressBar from '../Components/Progressbar/bar.jsx';
import './NewProject.css';

function NewProject() {
  const [klasorKonumu, setKlasorKonumu] = useState('');
  const [projeAdi, setProjeAdi] = useState('');
  const [projeKonumu, setProjeKonumu] = useState('');
  const [discordVersion, setDiscordVersion] = useState('');
  const [showProgress, setShowProgress] = useState(false);

  const handleKlasorSec = async () => {
    const selectedFolder = await dialog.open({
      directory: true,
    });
    if (selectedFolder) {
      setKlasorKonumu(selectedFolder); 
      setProjeKonumu(selectedFolder);   
    }
  };

  const handleOlustur = async () => {
    if (klasorKonumu && projeAdi && discordVersion) {
      setShowProgress(true);
      setTimeout(async () => {
        try {
          const projectFolder = `${klasorKonumu}/${projeAdi}`;
          await createDir(projectFolder); 
          await writeTextFile(`${projectFolder}/README.md`, `# ${projeAdi}\n\nDiscordJS Version: ${discordVersion}`);
          alert(`Projeniz '${projeAdi}' konumunda '${projectFolder}' oluşturuldu.`);
        } catch (error) {
          console.error('Proje oluşturulurken hata oluştu:', error);
          alert('Proje oluşturulurken bir hata oluştu.');
        } finally {
          setShowProgress(false);
        }
      }, 5000); 
    } else {
      alert('Lütfen tüm alanları doldurun ve klasör seçin.');
    }
  };

  return (
    <div className={`NewProject ${showProgress ? 'blur-background-content' : ''}`}>
      <h1>Yeni Proje Oluştur</h1>
      <input
        id="projeadi"
        type="text"
        placeholder="Proje Adı"
        value={projeAdi}
        onChange={(e) => setProjeAdi(e.target.value)}
      />
      <input
        type="text"
        placeholder="Proje Konumu"
        value={projeKonumu}
        onChange={(e) => setProjeKonumu(e.target.value)}
      />
      <select
        value={discordVersion}
        onChange={(e) => setDiscordVersion(e.target.value)}
      >
        <option value="">DiscordJS Sürümü</option>
        <option value="v13">v13</option>
        <option value="v14">v14</option>
      </select>
      <button onClick={handleKlasorSec}>Klasör Seç</button>
      <p>Klasör Konumu: {klasorKonumu}</p>
      <button onClick={handleOlustur}>Oluştur</button>
      <button>İptal</button>
      {showProgress && <ProgressBar />}
    </div>
  );
}

export default NewProject;