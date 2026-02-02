import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const TERMINAL_DATA = [
  { type: 'typing', text: 'grep cyberlight /etc/shadow > shadow.cyberlight', waitAfter: 1000 },
  { type: 'typing', text: 'john shadow.cyberlight', waitAfter: 500 },
  { type: 'info', text: 'Loaded 1 password (FreeBSD MD5 [32/32])', waitAfter: 800 },
  { type: 'info', text: 'guesses: 0 time: 0:02:00:00 (3) c/s: 100936 trying: sathut', waitAfter: 200 },
  { type: 'info', text: 'guesses: 0 time: 0:04:00:00 (3) c/s: 354793 trying: cousun1', waitAfter: 200 },
  { type: 'info', text: 'guesses: 0 time: 0:08:00:00 (3) c/s: 599784 trying: Co_aDfb', waitAfter: 200 },
  { type: 'info', text: 'guesses: 1 time: 0:16:00:00 (3) c/s: 891224 trying: P4$$w3r|)', waitAfter: 1000 },
  { type: 'typing', text: 'su cyberlight', waitAfter: 500 },
  { type: 'info', text: 'Password: ******************', waitAfter: 1500 },
  { type: 'user_change', user: 'cyberlight', machine: 'cyberlight-vm', path: '/' },
  { type: 'typing', text: 'ls', waitAfter: 500 },
  { type: 'files', files: ['me', 'README.md', 'github', 'certificates'], waitAfter: 800 },
  { type: 'typing', text: 'cat README.md', waitAfter: 500 },
  { type: 'info', text: 'I am Cyberlight in virtual reality', waitAfter: 100 },
  { type: 'info', text: "It's my presentation about me :)", waitAfter: 100 },
  { type: 'info', text: 'Powered by React + Vite!', waitAfter: 1000 },
  { type: 'typing', text: 'cat me', waitAfter: 500 },
  { type: 'info', text: 'Aleksandr Vishniakov in real life :)', waitAfter: 1000 },
  { type: 'typing', text: 'cat github', waitAfter: 500 },
  { type: 'link', text: 'https://github.com/CyberLight', url: 'https://github.com/CyberLight', waitAfter: 1000 },
  { type: 'typing', text: 'ls ./certificates', waitAfter: 500 },
  { 
      type: 'pdf_list', 
      files: [
          { name: 'coderun_winter_challenge_2025.pdf', url: 'https://cdn.jsdelivr.net/gh/CyberLight/CyberLight@main/certificates/yandex/10010469-4d2f-e5fb-a2c7-1a89691e7577.pdf' },
          { name: 'coderun_boost_challenge_2025.pdf', url: 'https://cdn.jsdelivr.net/gh/CyberLight/CyberLight@main/certificates/yandex/10010468-836f-67f6-b864-d4b896d8fb7c.pdf' },
          { name: 'coderun_season2_2024.pdf', url: 'https://cdn.jsdelivr.net/gh/CyberLight/CyberLight@main/certificates/yandex/10010466-e859-d416-1a92-bc85dd3baa9a.pdf' },
          { name: 'coderun_season1_2023.pdf', url: 'https://cdn.jsdelivr.net/gh/CyberLight/CyberLight@main/certificates/yandex/bf6a87db-4c95-4092-bc33-9e9b3497c114.pdf' },
      ], 
      waitAfter: 1000 
  },
  { type: 'info', text: '(Click on files to open viewer)', waitAfter: 500 },
  { type: 'typing', text: 'cd ~/projects/about-me', waitAfter: 500 },
  { type: 'user_change', user: 'cyberlight', machine: 'cyberlight-vm', path: '~/projects/about-me' },
  { type: 'branch_change', branch: 'main', waitAfter: 0 },
  { type: 'stack_change', stack: '⬢ v24.13.0', waitAfter: 0 },
  { type: 'typing', text: 'npm run dev', waitAfter: 1000 },
  { type: 'info', text: '[[white|> about-me@0.0.0 dev]]', waitAfter: 100 },
  { type: 'info', text: '[[white|> vite --host 0.0.0.0]]', waitAfter: 100 },
  { type: 'info', text: '', waitAfter: 100 },
  { type: 'info', text: '', waitAfter: 100 },
  { type: 'info', text: '   [[green|VITE v7.3.1]]  ready in 96 ms', waitAfter: 100 },
  { type: 'info', text: '', waitAfter: 100 },
  { type: 'info', text: '   [[green|➜]]  [[white|Local:]]   [[blue|http://localhost:5173/]]', waitAfter: 100 },
  { type: 'info', text: '   [[green|➜]]  [[white|Network:]] [[blue|http://172.17.0.2:5173/]]', waitAfter: 100 },
  { type: 'info', text: '   [[green|➜]]  press [[white|h + enter]] to show help', waitAfter: 500 },
  { type: 'info', text: '[[white|^C]]', waitAfter: 100 },
  { type: 'typing', text: 'cd ~/', waitAfter: 500 },
  { type: 'user_change', user: 'cyberlight', machine: 'cyberlight-vm', path: '~' },
  { type: 'branch_change', branch: null, waitAfter: 0 },
  { type: 'stack_change', stack: null, waitAfter: 0 },
  { type: 'typing', text: 'tech --usage', waitAfter: 200 },
  { 
  type: 'info', 
  text: `
JavaScript    ${drawBar(100)}
HTML/CSS      ${drawBar(100)}
Docker        ${drawBar(100)}
AI            ${drawBar(70)}
Python/Django ${drawBar(40)}
Node.js       ${drawBar(35)}
English       ${drawBar(10)} [[gray|(A1)]]
React         ${drawBar(5)}
`, 
  waitAfter: 1000 
},
  { type: 'input' }
];

function drawBar(percent, length = 20) {
  const filledLen = Math.round((length * percent) / 100);
  const emptyLen = length - filledLen;
  const filled = '#'.repeat(filledLen);
  const empty = '.'.repeat(emptyLen);
  
  let color = 'green';
  if (percent < 50) color = 'yellow';
  if (percent < 30) color = 'red';
  
  return `[ [[${color}|${filled}${empty}]] ] ${percent}%`;
};

const Cursor = () => {
  return <span className="cursor">&nbsp;</span>;
};

const ZshPrompt = ({ user, machine, path, branch, stack }) => {
  const displayPath = path === '/' ? '~' : path;
  
  return (
    <div className="zsh-wrapper">
      <div className="zsh-segment seg-os">
         <span style={{fontWeight: 900}}>{user}</span>
         <span style={{opacity: 0.6, margin: '0 2px'}}>@</span>
         <span style={{fontWeight: 400}}>{machine}</span>
      </div>
      
      <div className="zsh-segment seg-dir">
        {displayPath}
      </div>

      {branch && (
        <div className="zsh-segment seg-git">
          git:({branch || 'main'})
        </div>
      )}

      {stack && (
        <div className="zsh-segment seg-yellow">
           {stack}
        </div>
      )}
    </div>
  );
};

const TypingLine = ({ text, onFinish, userContext, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    setDisplayedText('');
    finishedRef.current = false;
    let index = 0;
    
    setIsMoving(true); 
    
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      
      if (index > text.length) {
        clearInterval(interval);
        if (!finishedRef.current && onFinish) {
            finishedRef.current = true;
            setIsMoving(false); 
            onFinish();
        }
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onFinish]); 

  return (
    <div className="line">
      <ZshPrompt {...userContext} />
      
      <span className="symbol">{displayedText}</span>
      <span className={`cursor ${isMoving ? 'moving' : ''}`}>&nbsp;</span>
    </div>
  );
};

const PdfViewer = ({ fileUrl, onClose }) => {
  return (
    <div className="pdf-overlay" onClick={onClose}>
      <div className="pdf-window" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-header">
           <span>📄 Viewer: {fileUrl.split('/').pop()}</span>
           <button className="close-btn" onClick={onClose}>✖</button>
        </div>
        
        <div className="pdf-content">
            <object data={fileUrl} type="application/pdf" width="100%" height="100%">
                <p>Ваш браузер не может показать PDF. 
                <a href={fileUrl} target="_blank" rel="noreferrer">Скачать файл</a>.</p>
            </object>
        </div>
        
        <div className="pdf-footer">
            <a href={fileUrl} target="_blank" rel="noreferrer" className="open-ext-btn">
                Открыть в новой вкладке ↗
            </a>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentStack, setCurrentStack] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [lines, setLines] = useState([]); 
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState({ user: 'guest', machine: 'cyberlight-vm', path: '/' });
  const processingRef = useRef(null);

  const parseText = (text) => {
    if (!text) return null;
    
    const parts = text.split(/(\[\[.*?\]\])/);
    
    return parts.map((part, index) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const content = part.slice(2, -2);
        const [className, str] = content.split('|');
        
        return (
          <span key={index} className={`text-${className}`}>
            {str}
          </span>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    const data = TERMINAL_DATA[currentLineIndex];
    if (!data) return;

    if (processingRef.current === currentLineIndex) return;
    
    if (data.type === 'typing' || data.type === 'input') {
        processingRef.current = currentLineIndex;
        return;
    }

    processingRef.current = currentLineIndex;
    const delay = data.waitAfter || 0;
    
    let newLine = null;
    
    switch (data.type) {
        case 'info':
            newLine = (
                <div key={currentLineIndex} className="line">
                    <span className="info-text">
                        {parseText(data.text)}
                    </span>
                </div>
            );
            break;
        case 'files':
            newLine = (
                <div key={currentLineIndex} className="line">
                    {data.files.map((f, i) => <span key={i} className="file-item">{f}</span>)}
                </div>
            );
            break;
        case 'link':
            newLine = (
                <div key={currentLineIndex} className="line">
                    <a href={data.url} target="_blank" className="link">{data.text}</a>
                </div>
            );
            break;
        case 'pdf_list':
            newLine = (
                <div key={currentLineIndex} className="line">
                    <div className="simple-arrow">➜</div>
                    <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', marginLeft: '1em'}}>
                        {data.files.map((f, i) => (
                            <span 
                                key={i} 
                                className="file-item fof-no-ml" 
                                style={{cursor: 'pointer', textDecoration: 'underline'}}
                                onClick={() => setViewingPdf(f.url)}
                            >
                                📄 {f.name}
                            </span>
                        ))}
                    </div>
                </div>
            );
            break;
    }

    const timer = setTimeout(() => {
        if (data.type === 'user_change') {
            setCurrentUser({ user: data.user, machine: data.machine, path: data.path });
        }

        if (data.type === 'branch_change') {
            setCurrentBranch(data.branch);
        }

        if (data.type === 'stack_change') {
            setCurrentStack(data.stack);
        }

        if (newLine) {
            setLines(prev => [...prev, newLine]);
        }
        
        setCurrentLineIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);

  }, [currentLineIndex]);


  const handleTypingFinish = () => {
   const data = TERMINAL_DATA[currentLineIndex];
    const userSnapshot = { ...currentUser };
    const branchSnapshot = currentBranch;
    const stackSnapshot = currentStack;

    setTimeout(() => {
        setLines(prev => [
            ...prev, 
            <div key={currentLineIndex} className="line">
                <ZshPrompt {...userSnapshot} branch={branchSnapshot} stack={stackSnapshot}/>
                <span className="symbol">{data.text}</span>
            </div>
        ]);
        setCurrentLineIndex(prev => prev + 1);
    }, data.waitAfter || 0);
  };

  const renderActive = () => {
      const data = TERMINAL_DATA[currentLineIndex];
      if (!data) return null;

      if (data.type === 'typing') {
          return (
            <TypingLine 
                key={currentLineIndex} 
                text={data.text} 
                onFinish={handleTypingFinish} 
                userContext={{...currentUser, branch: currentBranch, stack: currentStack }}
            />
          );
      }
      
      if (data.type === 'input') {
          return (
             <div className="line">
                <ZshPrompt {...currentUser} branch={currentBranch} stack={currentStack} />
                <Cursor />
             </div>
          );
      }

      return null;
  };

  return (
    <div className="terminal-window">
      <div className="window-title">
         <span style={{marginRight: '6px'}}>🏠</span> 
         cyberlight-vm — -zsh
      </div>
      <div className="terminal-content">
        {lines}
        {renderActive()}
        <div ref={(el) => { if(el) el.scrollIntoView({ behavior: "smooth" }); }}></div>
      </div>
      {viewingPdf && (
        <PdfViewer fileUrl={viewingPdf} onClose={() => setViewingPdf(null)} />
      )}
    </div>
  );
}

export default App;