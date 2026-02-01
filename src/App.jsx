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
  { type: 'files', files: ['me', 'README.md', 'github'], waitAfter: 800 },
  { type: 'typing', text: 'cat README.md', waitAfter: 500 },
  { type: 'branch_change', branch: 'feature/bio', waitAfter: 0 },
  { type: 'info', text: 'I am Cyberlight in virtual reality', waitAfter: 100 },
  { type: 'info', text: "It's my presentation about me :)", waitAfter: 100 },
  { type: 'info', text: 'Powered by React + Vite!', waitAfter: 1000 },
  { type: 'typing', text: 'cat me', waitAfter: 500 },
  { type: 'info', text: 'Aleksandr Vishniakov in real life :)', waitAfter: 1000 },
  { type: 'branch_change', branch: 'release/socials', waitAfter: 0 },
  { type: 'typing', text: 'cat github', waitAfter: 500 },
  { type: 'link', text: 'https://github.com/CyberLight', url: 'https://github.com/CyberLight', waitAfter: 1000 },
  { type: 'branch_change', branch: 'release/me', waitAfter: 0 },
  { type: 'input' }
];

const Cursor = () => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);
  return <span className={`cursor ${visible ? '' : 'hidden'}`}>&nbsp;</span>;
};

const ZshPrompt = ({ user, machine, path, branch }) => {
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

      <div className="zsh-segment seg-git">
        git:({branch || 'main'})
      </div>
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

function App() {
  const [currentBranch, setCurrentBranch] = useState('main');
  const [lines, setLines] = useState([]); 
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState({ user: 'guest', machine: 'cyberlight-vm', path: '/' });
  const processingRef = useRef(null);

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
                    <span className="info-text">{data.text}</span>
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
    }

    const timer = setTimeout(() => {
        if (data.type === 'user_change') {
            setCurrentUser({ user: data.user, machine: data.machine, path: data.path });
        }

        if (data.type === 'branch_change') {
            setCurrentBranch(data.branch);
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

    setTimeout(() => {
        setLines(prev => [
            ...prev, 
            <div key={currentLineIndex} className="line">
                <ZshPrompt {...userSnapshot} branch={branchSnapshot} />
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
                userContext={{...currentUser, branch: currentBranch}}
            />
          );
      }
      
      if (data.type === 'input') {
          return (
             <div className="line">
                <ZshPrompt {...currentUser} branch={currentBranch} />
                <Cursor />
             </div>
          );
      }

      return null;
  };

  return (
    <div className="terminal-window">
      <div className="terminal-content">
        {lines}
        {renderActive()}
        <div ref={(el) => { if(el) el.scrollIntoView({ behavior: "smooth" }); }}></div>
      </div>
    </div>
  );
}

export default App;