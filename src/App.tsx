import React, { useState, useCallback, useEffect } from 'react';
import { TimerPlayground } from './components/TimerPlayground';
import { ActivityLog } from './components/ActivityLog';
import { InfoModal } from './components/InfoModal';
import { LogEntry, LogType } from './types';
import { GithubIcon, InfoIcon } from './components/icons';

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPageVisible, setIsPageVisible] = useState<boolean>(!document.hidden);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const addLog = useCallback((type: LogType, message: string) => {
    const newLog: LogEntry = {
      timestamp: new Date(),
      type,
      message,
    };
    setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 200)); // Keep max 200 logs
  }, []);

  useEffect(() => {
    addLog(LogType.BROWSER, "Playground initialized.");
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addLog(LogType.BROWSER, "Tab became inactive/hidden.");
        setIsPageVisible(false);
      } else {
        addLog(LogType.BROWSER, "Tab became active/visible.");
        setIsPageVisible(true);
      }
    };
    
    const handleFocus = () => {
        addLog(LogType.BROWSER, "Window gained focus.");
    };

    const handleBlur = () => {
        addLog(LogType.BROWSER, "Window lost focus.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLog]);


  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <header className="mb-8 text-center">
            <div className="flex justify-center items-center gap-3">
              <h1 className="text-4xl font-bold text-cyan-400">Browser Behavior Playground</h1>
              <button 
                onClick={() => setIsInfoModalOpen(true)} 
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                aria-label="Show info popup"
              >
                <InfoIcon className="w-7 h-7" />
              </button>
            </div>
            <p className="text-gray-400 mt-2">Testing Timers under various browser conditions.</p>
            <div className="flex justify-center items-center mt-4 space-x-2 text-gray-400">
              <span className={`h-3 w-3 rounded-full ${isPageVisible ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span>Page Visibility: <span className={isPageVisible ? 'text-green-400' : 'text-yellow-400'}>{isPageVisible ? 'Visible' : 'Hidden'}</span></span>
            </div>
          </header>

          <main className="max-w-4xl mx-auto mb-8">
            <TimerPlayground addLog={addLog} />
          </main>
          
          <ActivityLog logs={logs} clearLogs={() => {
            setLogs([]);
            addLog(LogType.INFO, "Logs cleared.");
          }} />

          <footer className="text-center mt-8 text-gray-500">
              <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-cyan-400 transition-colors">
                  <GithubIcon className="w-5 h-5 mr-2" />
                  View on GitHub
              </a>
          </footer>
        </div>
      </div>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </>
  );
};

export default App;
