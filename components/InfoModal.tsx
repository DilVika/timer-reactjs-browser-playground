import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl text-gray-300 p-6 sm:p-8 relative transform transition-all duration-300 ease-in-out scale-95 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-cyan-400 mb-4 border-b-2 border-gray-700 pb-2">How This Playground Works</h2>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <section>
                <h3 className="text-xl font-semibold text-white mb-2">What is Timer Drift?</h3>
                <p>
                    JavaScript timers like <code className="bg-gray-700 text-yellow-300 px-1 rounded">setTimeout</code> and <code className="bg-gray-700 text-yellow-300 px-1 rounded">setInterval</code> are not guaranteed to execute precisely on time. The difference between the <em>expected</em> execution time and the <em>actual</em> execution time is what we call <strong className="text-yellow-400">"drift"</strong>.
                </p>
            </section>
            
            <section>
                <h3 className="text-xl font-semibold text-white mb-2">Why Does Drift Happen?</h3>
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>
                        <strong className="text-purple-400">Inactive Tabs:</strong> To save CPU and battery, modern browsers "throttle" timers in background tabs. This means they run much less frequently (e.g., once per second at most).
                    </li>
                    <li>
                        <strong className="text-purple-400">System Sleep:</strong> When you put your computer to sleep, all JavaScript execution is completely paused. When the system wakes up, timers resume, but a large amount of time has passed, causing significant drift.
                    </li>
                    <li>
                        <strong className="text-purple-400">Heavy CPU Load:</strong> If the browser's main thread is busy with other intensive tasks (like complex animations or calculations), it can delay timer execution.
                    </li>
                </ul>
            </section>

            <section>
                <h3 className="text-xl font-semibold text-white mb-2">How We Measure It</h3>
                 <p>This playground uses the high-precision <code className="bg-gray-700 text-yellow-300 px-1 rounded">performance.now()</code> API to measure time accurately:</p>
                <ul className="list-disc list-inside space-y-2 pl-2 mt-2">
                    <li><strong className="text-green-400">Timer Time:</strong> The expected time, calculated as <code className="bg-gray-900 px-1 rounded">(number of ticks) × (interval duration)</code>.</li>
                    <li><strong className="text-green-400">Actual Time:</strong> The real-world "wall-clock" time that has passed since the timer started.</li>
                    <li><strong className="text-green-400">Drift:</strong> The difference between <code className="bg-gray-900 px-1 rounded">Actual Time</code> and <code className="bg-gray-900 px-1 rounded">Timer Time</code>.</li>
                </ul>
            </section>

             <section>
                <h3 className="text-xl font-semibold text-white mb-2">🧪 Try It Yourself!</h3>
                 <p>
                    Start the interval timer, switch to another browser tab for 30 seconds, and then return. You'll see a large drift value and "Tab became inactive/hidden" messages in the log.
                 </p>
            </section>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};