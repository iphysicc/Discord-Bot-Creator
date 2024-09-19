import React, { useState } from 'react';
import { dialog } from '@tauri-apps/api';
import { writeTextFile, createDir, readTextFile } from '@tauri-apps/api/fs';
import { useNavigate } from 'react-router-dom';
import './NewProject.css';

function NewProject() {
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [discordVersion, setDiscordVersion] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  
  const navigate = useNavigate();

  const handleFolderSelect = async () => {
    const selectedFolder = await dialog.open({
      directory: true,
    });
    if (selectedFolder) {
      setProjectLocation(selectedFolder);
    }
  };

  const handleCreate = async () => {
    if (projectName && projectLocation && discordVersion) {
      setShowProgress(true);
      setProgress(0);
      await createProject();
    } else {
      alert('Lütfen tüm alanları doldurun ve klasör seçin.');
    }
  };

  const createProject = async () => {
    try {
      const projectFolder = `${projectLocation}/${projectName}`;
      
      setCurrentStep('Proje klasörü oluşturuluyor...');
      await createDir(projectFolder);
      setProgress(20);

      setCurrentStep('package.json dosyası oluşturuluyor...');
      await writeTextFile(`${projectFolder}/package.json`, JSON.stringify({
        name: projectName,
        version: "1.0.0",
        description: `${projectName} Discord botu`,
        main: "index.js",
        scripts: { start: "node index.js" },
        author: "",
        license: "ISC",
        dependencies: { "discord.js": discordVersion === 'v14' ? "^14.0.0" : "^13.0.0" }
      }, null, 2));
      setProgress(40);

      setCurrentStep('README.md dosyası oluşturuluyor...');
      await writeTextFile(`${projectFolder}/README.md`, `# ${projectName}\n\nDiscordJS Version: ${discordVersion}`);
      setProgress(60);

      setCurrentStep('index.js dosyası oluşturuluyor...');
      await writeTextFile(`${projectFolder}/index.js`, `const { Client, Intents } = require('discord.js');\nconst client = new Client({ intents: [Intents.FLAGS.GUILDS] });\n\nclient.once('ready', () => {\n  console.log('Bot is online!');\n});\n\nclient.login('your-bot-token');`);
      setProgress(80);

      setCurrentStep('Proje oluşturma tamamlandı.');
      setProgress(100);

      setTimeout(() => {
        navigate('/project', { state: { projectFolder } });
      }, 2000);
    } catch (error) {
      console.error('Proje oluşturulurken hata oluştu:', error);
      setCurrentStep('Hata: Proje oluşturulamadı.');
    }
  };

  return (
    <div className="NewProject">
      <h1>Yeni Proje Oluştur</h1>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="projectName">Proje Adı</label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Proje Adı"
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectLocation">Proje Konumu</label>
          <div className="location-input">
            <input
              id="projectLocation"
              type="text"
              value={projectLocation}
              readOnly
              placeholder="Proje Konumu"
            />
            <button className="btn btn-secondary" onClick={handleFolderSelect}>Seç</button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="discordVersion">DiscordJS Sürümü</label>
          <select
            id="discordVersion"
            value={discordVersion}
            onChange={(e) => setDiscordVersion(e.target.value)}
          >
            <option value="">Seçiniz</option>
            <option value="v13">v13</option>
            <option value="v14">v14</option>
          </select>
        </div>
        <button className="btn" onClick={handleCreate}>Oluştur</button>
      </div>
      {showProgress && (
        <div className="progress-overlay">
          <div className="progress-content">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{width: `${progress}%`}}></div>
            </div>
            <div className="progress-step">{currentStep}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewProject;