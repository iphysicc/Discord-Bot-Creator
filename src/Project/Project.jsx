import React, { useState, useEffect } from 'react';
import { FolderIcon, FileIcon, PlusIcon, TrashIcon, SettingsIcon, ChevronRightIcon } from 'lucide-react';
import { readDir, readTextFile } from '@tauri-apps/api/fs';
import { useLocation } from 'react-router-dom';
import './Project.css'; 

const Project = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const location = useLocation();
  const projectFolder = location.state?.projectFolder;

  useEffect(() => {
    if (projectFolder) {
      loadProjectFiles(projectFolder);
    }
  }, [projectFolder]);

  const loadProjectFiles = async (folder) => {
    try {
      const entries = await readDir(folder);
      const fileList = entries.map(entry => ({
        name: entry.name,
        type: entry.children ? 'directory' : 'file',
        path: entry.path
      }));
      setFiles(fileList);
    } catch (error) {
      console.error('Dosyalar yüklenirken hata oluştu:', error);
    }
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    if (file.type === 'file') {
      try {
        const content = await readTextFile(file.path);
        setFileContent(content);
      } catch (error) {
        console.error('Dosya içeriği okunurken hata oluştu:', error);
        setFileContent('Dosya içeriği okunamadı.');
      }
    } else {
      setFileContent('');
    }
  };

  const handleAddFile = () => {
    alert('Dosya ekleme işlevi henüz uygulanmadı');
  };

  const handleDeleteFile = () => {
    alert('Dosya silme işlevi henüz uygulanmadı');
  };

  const handleCustomCommands = () => {
    alert('Özel komutlar işlevi henüz uygulanmadı');
  };

  return (
    <div className="project-container">
      <div className="sidebar">
        <h2>Proje Dosyaları</h2>
        <div className="file-list">
          {files.map((file, index) => (
            <div
              key={index}
              className={`file-item ${selectedFile === file ? 'selected' : ''}`}
              onClick={() => handleFileSelect(file)}
            >
              {file.type === 'directory' ? (
                <FolderIcon className="file-item-icon" size={16} />
              ) : (
                <FileIcon className="file-item-icon" size={16} />
              )}
              <span className="file-item-name">{file.name}</span>
              {file.type === 'directory' && (
                <ChevronRightIcon style={{ marginLeft: 'auto' }} size={16} />
              )}
            </div>
          ))}
        </div>
        <div className="sidebar-buttons">
          <button className="sidebar-button" onClick={handleAddFile}>
            <PlusIcon size={16} style={{ marginRight: '4px' }} />
            Ekle
          </button>
          <button className="sidebar-button" onClick={handleDeleteFile}>
            <TrashIcon size={16} style={{ marginRight: '4px' }} />
            Sil
          </button>
          <button className="sidebar-button" onClick={handleCustomCommands}>
            <SettingsIcon size={16} style={{ marginRight: '4px' }} />
            Özel
          </button>
        </div>
      </div>

      <div className="main-content">
        <h1>Proje Detayları</h1>
        {selectedFile ? (
          <div className="file-details">
            <h2>{selectedFile.name}</h2>
            <p className="file-type">Tür: {selectedFile.type}</p>
            <div className="file-content">
              <pre>{fileContent}</pre>
            </div>
          </div>
        ) : (
          <div className="no-file-selected">
            <p>Detayları görüntülemek için bir dosya seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;