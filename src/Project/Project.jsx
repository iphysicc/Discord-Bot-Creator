import React, { useState, useEffect, useRef } from 'react';
import { readDir, readTextFile, writeTextFile, createDir } from '@tauri-apps/api/fs';
import { Command } from '@tauri-apps/api/shell';
import { useLocation } from 'react-router-dom';
import { FolderIcon, FileIcon, PlusIcon, TrashIcon, SettingsIcon, TerminalIcon } from 'lucide-react';
import './Project.css';

const Project = () => {
  const [commands, setCommands] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemContent, setItemContent] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const terminalRef = useRef(null);
  const location = useLocation();
  const projectFolder = location.state?.projectFolder;

  useEffect(() => {
    if (projectFolder) {
      loadProjectStructure(projectFolder);
    }
  }, [projectFolder]);

  const loadProjectStructure = async (folder) => {
    try {
      const commandsDir = `${folder}/commands`;
      const eventsDir = `${folder}/events`;
      
      await createDir(commandsDir, { recursive: true });
      await createDir(eventsDir, { recursive: true });

      const commandFiles = await readDir(commandsDir);
      const eventFiles = await readDir(eventsDir);

      setCommands(commandFiles.map(file => ({ name: file.name, type: 'command' })));
      setEvents(eventFiles.map(file => ({ name: file.name, type: 'event' })));
    } catch (error) {
      console.error('Proje yapısı yüklenirken hata oluştu:', error);
    }
  };

  const handleItemSelect = async (item) => {
    setSelectedItem(item);
    try {
      const content = await readTextFile(`${projectFolder}/${item.type}s/${item.name}`);
      setItemContent(content);
    } catch (error) {
      console.error('Dosya içeriği okunurken hata oluştu:', error);
      setItemContent('Dosya içeriği okunamadı.');
    }
  };

  const handleCreateItem = async (type) => {
    const name = prompt(`Yeni ${type} adı:`);
    if (name) {
      try {
        const fileName = name.endsWith('.js') ? name : `${name}.js`;
        await writeTextFile(`${projectFolder}/${type}s/${fileName}`, `// Yeni ${type}: ${name}`);
        await loadProjectStructure(projectFolder);
      } catch (error) {
        console.error(`${type} oluşturulurken hata oluştu:`, error);
      }
    }
  };

  const handleAddEventToCommand = () => {
    if (selectedItem && selectedItem.type === 'command') {
      const event = prompt('Eklenecek olay adı:');
      if (event) {
        setItemContent(prevContent => `${prevContent}\n\n// Yeni olay: ${event}`);
      }
    }
  };

  const handleAddContentToCommand = () => {
    if (selectedItem && selectedItem.type === 'command') {
      const content = prompt('Eklenecek içerik:');
      if (content) {
        setItemContent(prevContent => `${prevContent}\n\n${content}`);
      }
    }
  };

  const handleAddCustomFunction = () => {
    if (selectedItem) {
      const functionName = prompt('Özel işlev adı:');
      if (functionName) {
        setItemContent(prevContent => `${prevContent}\n\nfunction ${functionName}() {\n  // İşlev içeriği\n}`);
      }
    }
  };

  const handleSaveContent = async () => {
    if (selectedItem) {
      try {
        await writeTextFile(`${projectFolder}/${selectedItem.type}s/${selectedItem.name}`, itemContent);
        alert('İçerik kaydedildi.');
      } catch (error) {
        console.error('İçerik kaydedilirken hata oluştu:', error);
        alert('İçerik kaydedilemedi.');
      }
    }
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  const runCommand = async (command) => {
    setTerminalOutput(prev => prev + '\n' + `> ${command}`);
    try {
      const commandInstance = new Command('powershell', [
        '-NoProfile',
        '-NonInteractive',
        '-ExecutionPolicy', 'Bypass',
        '-Command',
        `Set-Location -Path '${projectFolder}'; ${command}`
      ]);
  
      const output = await commandInstance.execute();
      
      console.log('Command output:', output); 
  
      if (output.code !== 0) {
        throw new Error(`Command failed with exit code ${output.code}`);
      }
      
      setTerminalOutput(prev => prev + '\n' + (output.stdout || '(No output)'));
    } catch (error) {
      console.error('Komut çalıştırılırken hata oluştu:', error);
      setTerminalOutput(prev => prev + '\n' + `Hata: ${error.message || 'Bilinmeyen bir hata oluştu'}`);
      console.error('Detailed error:', error); 
    }
  };


  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  return (
    <div className="project-container">
      <div className="sidebar">
        <h2>Proje Yapısı</h2>
        <div className="section">
          <h3>Komutlar</h3>
          <div className="item-list">
            {commands.map((command, index) => (
              <div key={index} className={`item ${selectedItem === command ? 'selected' : ''}`} onClick={() => handleItemSelect(command)}>
                <FileIcon size={16} />
                <span>{command.name}</span>
              </div>
            ))}
          </div>
          <button className="add-button" onClick={() => handleCreateItem('command')}>
            <PlusIcon size={16} /> Yeni Komut
          </button>
        </div>
        <div className="section">
          <h3>Olaylar</h3>
          <div className="item-list">
            {events.map((event, index) => (
              <div key={index} className={`item ${selectedItem === event ? 'selected' : ''}`} onClick={() => handleItemSelect(event)}>
                <FileIcon size={16} />
                <span>{event.name}</span>
              </div>
            ))}
          </div>
          <button className="add-button" onClick={() => handleCreateItem('event')}>
            <PlusIcon size={16} /> Yeni Olay
          </button>
        </div>
      </div>
      <div className="main-content">
        {selectedItem ? (
          <>
            <h2>{selectedItem.name}</h2>
            <textarea
              value={itemContent}
              onChange={(e) => setItemContent(e.target.value)}
              className="content-editor"
            />
            <div className="button-group">
              <button onClick={handleAddEventToCommand}>Komuta Olay Ekle</button>
              <button onClick={handleAddContentToCommand}>Komuta İçerik Ekle</button>
              <button onClick={handleAddCustomFunction}>Özel İşlev Ekle</button>
              <button onClick={handleSaveContent}>Kaydet</button>
            </div>
          </>
        ) : (
          <div className="no-selection">Düzenlemek için bir öğe seçin</div>
        )}
      </div>
      
      <button className="terminal-toggle" onClick={toggleTerminal}>
        <TerminalIcon size={20} />
      </button>
      
      {showTerminal && (
        <div className="terminal-container">
          <div className="terminal-header">
            <span>PowerShell</span>
            <button onClick={toggleTerminal}>X</button>
          </div>
          <div className="terminal-output" ref={terminalRef}>
            {terminalOutput}
          </div>
          <input
            type="text"
            className="terminal-input"
            placeholder="PowerShell komutu girin..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                runCommand(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Project;