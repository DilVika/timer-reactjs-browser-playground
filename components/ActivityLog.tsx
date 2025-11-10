import React, { useRef, useEffect } from 'react';
import { LogEntry, LogType } from '../types';

interface ActivityLogProps {
  logs: LogEntry[];
  clearLogs: () => void;
}

const getLogTypeColor = (type: LogType): string => {
  switch (type) {
    case LogType.TIMER:
      return 'border-l-yellow-400 text-yellow-300';
    case LogType.BROWSER:
      return 'border-l-purple-400 text-purple-300';
    case LogType.SUCCESS:
      return 'border-l-green-400 text-green-300';
    case LogType.ERROR:
      return 'border-l-red-400 text-red-300';
    case LogType.INFO:
    default:
      return 'border-l-gray-400 text-gray-300';
  }
};

const LogRow: React.FC<{ log: LogEntry }> = ({ log }) => {
  const colorClasses = getLogTypeColor(log.type);
  return (
    <div className={`p-2 border-l-4 bg-gray-800/50 ${colorClasses} flex items-start space-x-3`}>
      <span className="font-mono text-xs text-gray-500 whitespace-nowrap">{log.timestamp.toLocaleTimeString('en-US', { hour12: false })}.{log.timestamp.getMilliseconds().toString().padStart(3, '0')}</span>
      <p className="text-sm break-words w-full">{log.message}</p>
    </div>
  );
};

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs, clearLogs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4 border-b-2 border-gray-700 pb-2">
        <h2 className="text-2xl font-bold text-cyan-400">Activity Log</h2>
        <button 
          onClick={clearLogs}
          className="px-4 py-2 text-sm font-semibold bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          Clear Logs
        </button>
      </div>
      <div 
        ref={logContainerRef}
        className="h-96 bg-gray-900 rounded-md p-2 overflow-y-auto font-mono flex flex-col-reverse"
      >
        <div className="space-y-1">
          {logs.length > 0 ? logs.map((log, index) => <LogRow key={index} log={log} />) : <p className="text-gray-500 text-center p-4">No activity yet...</p>}
        </div>
      </div>
    </div>
  );
};