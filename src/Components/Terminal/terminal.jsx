import React, { useState, useEffect } from 'react';
import './terminal.css';

const Terminal = ({ logs }) => {
  const [terminalLogs, setTerminalLogs] = useState([]);

  useEffect(() => {
    if (logs) {
      setTerminalLogs((prevLogs) => [...prevLogs, logs]);
    }
  }, [logs]);

  return (
    <div className="terminal">
      <div className="terminal-content">
        {terminalLogs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
