import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LogType } from '../types';
import { PlayIcon, PauseIcon, RefreshIcon, RunningIcon } from './icons';

interface TimerPlaygroundProps {
  addLog: (type: LogType, message: string) => void;
}

export const TimerPlayground: React.FC<TimerPlaygroundProps> = ({ addLog }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timerType, setTimerType] = useState<'interval' | 'timeout' | null>(null);
  const [timerTime, setTimerTime] = useState<number>(0);
  const [actualTime, setActualTime] = useState<number>(0);
  const [drift, setDrift] = useState<number>(0);
  const [intervalDuration, setIntervalDuration] = useState<number>(1000);

  const timerIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const expectedNextTickRef = useRef<number | null>(null);
  const timerTypeRef = useRef(timerType);

  useEffect(() => {
    timerTypeRef.current = timerType;
  }, [timerType]);

  const stopTimer = useCallback(() => {
    if (timerIdRef.current) {
      if (timerTypeRef.current === 'interval') {
        clearInterval(timerIdRef.current);
        addLog(LogType.TIMER, `Interval (ID: ${timerIdRef.current}) stopped.`);
      } else {
        clearTimeout(timerIdRef.current);
        addLog(LogType.TIMER, `Timeout (ID: ${timerIdRef.current}) stopped.`);
      }
    }
    setIsRunning(false);
    timerIdRef.current = null;
    startTimeRef.current = null;
    expectedNextTickRef.current = null;
  }, [addLog]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimerTime(0);
    setActualTime(0);
    setDrift(0);
    setTimerType(null);
    addLog(LogType.INFO, "Timer playground reset.");
  }, [stopTimer, addLog]);

  const startTimer = (type: 'interval' | 'timeout') => {
    if (isRunning) {
      stopTimer();
    }
    
    // Reset state for a fresh start
    setTimerTime(0);
    setActualTime(0);
    setDrift(0);
    
    setTimerType(type);
    setIsRunning(true);
    const now = performance.now();
    startTimeRef.current = now;
    expectedNextTickRef.current = now + intervalDuration;

    addLog(LogType.TIMER, `Starting ${type} with ${intervalDuration}ms duration.`);

    const tick = () => {
      if (!startTimeRef.current) return; // Guard against ticks after stop
      const tickTime = performance.now();
      
      // `performance.now()` provides a high-resolution timestamp. By tracking the difference
      // between the start time and the current time, we measure the *actual* elapsed time,
      // which can differ from the timer's expected time due to browser throttling.
      const currentActualTime = tickTime - startTimeRef.current;
      setActualTime(currentActualTime);

      // FIX: Use functional updates to prevent issues with stale state in closures.
      // This ensures `prevTimerTime` is the most recent state value.
      setTimerTime(prevTimerTime => {
        const newTimerTime = prevTimerTime + intervalDuration;
        const newDrift = currentActualTime - newTimerTime;
        setDrift(newDrift);
        return newTimerTime;
      });
      
      const tickDrift = tickTime - (expectedNextTickRef.current || tickTime);
      if (Math.abs(tickDrift) > intervalDuration * 0.1) { // Log if drift is > 10% of interval
          addLog(LogType.TIMER, `Significant timer drift detected: ${tickDrift.toFixed(2)}ms`);
      }

      expectedNextTickRef.current = (expectedNextTickRef.current || tickTime) + intervalDuration;
      
      if (type === 'timeout') {
        addLog(LogType.TIMER, "Timeout fired.");
        stopTimer();
        setTimerType(null);
      }
    };

    if (type === 'interval') {
      timerIdRef.current = window.setInterval(tick, intervalDuration);
    } else {
      timerIdRef.current = window.setTimeout(tick, intervalDuration);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  const driftColor = Math.abs(drift) > 500 ? 'text-red-400' : Math.abs(drift) > 100 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400 border-b-2 border-gray-700 pb-2">Timer Playground</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <p className="text-sm text-gray-400">Timer Time</p>
          <p className="text-3xl font-mono font-bold text-white">{(timerTime / 1000).toFixed(2)}s</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <p className="text-sm text-gray-400">Actual Time</p>
          <p className="text-3xl font-mono font-bold text-white">{(actualTime / 1000).toFixed(2)}s</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md text-center col-span-1 sm:col-span-2">
          <p className="text-sm text-gray-400">Drift</p>
          <p className={`text-3xl font-mono font-bold ${driftColor}`}>{drift.toFixed(2)}ms</p>
        </div>
      </div>

      <div className="mb-2">
        <label htmlFor="interval" className="block text-sm font-medium text-gray-400 mb-2">Interval Duration (ms)</label>
        <input 
          type="number"
          id="interval"
          value={intervalDuration}
          onChange={(e) => setIntervalDuration(parseInt(e.target.value, 10) || 100)}
          className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
          min="100"
          step="100"
          disabled={isRunning}
        />
      </div>

      <div className="mb-4 mt-2 h-8 flex items-center justify-center">
        {isRunning && timerType === 'timeout' && (
            <div className="flex items-center space-x-2 text-blue-400 animate-pulse">
                <RunningIcon className="w-6 h-6" />
                <span className="font-semibold">Timeout is running...</span>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button 
          onClick={() => startTimer('interval')}
          disabled={isRunning && timerType === 'timeout'}
          className={`w-full flex items-center justify-center p-3 rounded-md font-semibold transition-all duration-200 ${isRunning && timerType === 'interval' ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          {isRunning && timerType === 'interval' ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2" />}
          {isRunning && timerType === 'interval' ? 'Running Interval' : 'Start Interval'}
        </button>
        <button
            onClick={() => startTimer('timeout')}
            disabled={isRunning && timerType === 'interval'}
            className={`w-full flex items-center justify-center p-3 rounded-md font-semibold transition-all duration-200 ${isRunning && timerType === 'timeout' ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {isRunning && timerType === 'timeout' ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2" />}
          {isRunning && timerType === 'timeout' ? 'Running Timeout' : 'Start Timeout'}
        </button>
        <button 
          onClick={resetTimer} 
          className="w-full flex items-center justify-center p-3 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
        >
          <RefreshIcon className="w-5 h-5 mr-2" />
          Stop / Reset
        </button>
      </div>
    </div>
  );
};
