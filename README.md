# ⌛ Browser Behavior Playground

A diagnostic tool to observe and test JavaScript timer behavior (`setTimeout`, `setInterval`) under various browser conditions.

This playground makes it easy to visualize the "drift" that occurs when a browser tab becomes inactive or the host system goes to sleep, demonstrating how timers are throttled or paused by the browser to conserve resources.

## ✨ Core Features

-   **📊 Real-time Metrics:** Instantly see the expected timer progress, the actual elapsed wall-clock time, and the "drift" between them.
-   **⏱️ Dual Timer Modes:** Test both `setInterval` for recurring ticks and `setTimeout` for single-shot delays.
-   **👁️ Visibility Tracking:** Automatically logs when the browser tab becomes hidden, visible, or loses focus, helping correlate drift with tab state.
-   **📜 Detailed Activity Log:** A comprehensive, timestamped log of all timer events, browser state changes, and significant drift detections.
-   **⚙️ Configurable Duration:** Easily set the timer interval in milliseconds to test different scenarios.

## 🚀 How to Use

1.  **Set Duration:** In the "Timer Playground" card, enter the desired interval/timeout duration in milliseconds.
2.  **Start a Timer:** Click **"Start Interval"** or **"Start Timeout"** to begin. The active timer button will turn yellow.
3.  **Observe:** Watch the "Timer Time," "Actual Time," and "Drift" values update in real-time.
4.  **Review Logs:** See a detailed breakdown of events in the "Activity Log" below.
5.  **Reset:** Use the **"Stop / Reset"** button to clear the current timer and metrics.

## 🧪 Test Scenarios to Try

-   **Tab Inactivity:** Start the interval timer, switch to another browser tab for 30 seconds, and then return. Observe the large drift value and the "Tab became inactive/hidden" messages in the log.
-   **System Sleep:** Start the timer, put your computer to sleep for a minute, and then wake it up. The drift will roughly match the duration the system was asleep, demonstrating how timers are paused completely.

## 🛠️ Tools

-   React 18
-   Tailwind CSS
-   Built with Google AI Studio
