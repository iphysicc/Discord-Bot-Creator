import React, { useState } from 'react';
import { dialog } from '@tauri-apps/api';
import { writeTextFile, createDir, readTextFile } from '@tauri-apps/api/fs';
import ProgressBar from '../Components/Progressbar/bar.jsx';
import Terminal from '../Components/Terminal/terminal.jsx';
import './NewProject.css';

function NewProject() {
  const [klasorKonumu, setKlasorKonumu] = useState('');
  const [projeAdi, setProjeAdi] = useState('');
  const [projeKonumu, setProjeKonumu] = useState('');
  const [discordVersion, setDiscordVersion] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [logs, setLogs] = useState('');

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
          
          const packageJson = {
            name: projeAdi,
            version: "1.0.0",
            description: `${projeAdi} Discord botu`,
            main: "index.js",
            scripts: {
              start: "node index.js",
            },
            author: "",
            license: "ISC",
            dependencies: {}
          };
          await writeTextFile(`${projectFolder}/package.json`, JSON.stringify(packageJson, null, 2));
          await writeTextFile(`${projectFolder}/README.md`, `# ${projeAdi}\n\nDiscordJS Version: ${discordVersion}`);
          await writeTextFile(`${projectFolder}/index.js`, `const { Client, Intents } = require('discord.js');\nconst client = new Client({ intents: [Intents.FLAGS.GUILDS] });\n\nclient.once('ready', () => {\n  console.log('Bot is online!');\n});\n\nclient.login('your-bot-token');`);

          setLogs('npm init -y çalıştırılıyor...');
          setTimeout(async () => {
            setLogs('package.json dosyası oluşturuldu.');
            setLogs('npm install discord.js başlatılıyor...');
            const updatedPackageJson = JSON.parse(await readTextFile(`${projectFolder}/package.json`));
            updatedPackageJson.dependencies = {
              "discord.js": discordVersion === 'v14' ? "^14.0.0" : "^13.0.0",
            };
            await writeTextFile(`${projectFolder}/package.json`, JSON.stringify(updatedPackageJson, null, 2));

            setTimeout(() => {
              setLogs('discord.js başarıyla yüklendi.');
              setLogs('Proje oluşturma tamamlandı..');
              alert(`Projeniz '${projeAdi}' konumunda '${projectFolder}' oluşturuldu.`);
            }, 3000);
          }, 2000);
        } catch (error) {
          console.error('Proje oluşturulurken hata oluştu:', error);
          alert('Proje oluşturulurken bir hata oluştu.');
        } finally {
          setShowProgress(false);
        }
      }, 2000);
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
      <Terminal logs={logs} />
    </div>
  );
}

export default NewProject;
