import React, { useRef, useState, useEffect } from "react";

export default function Timer({ onBpmUpdate }) {
  const beat = useRef(0);
  const [timerId, setTimerId] = useState(null);

  // Function to start the BPM timer
  function startBpmTimer(bpm) {
    // Calculate the time interval for each beat in milliseconds
    const interval = 60000 / bpm;

    // Set a repeating timer
    const id = setInterval(() => {
      beat.current = (beat.current + 1) % 4; // Cycle through beats
      onBpmUpdate(beat.current); // Update BPM on each beat
    }, interval);

    // Store the timer ID
    setTimerId(id);
  }

  // Function to stop the timer
  function stopBpmTimer() {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
      console.log("Timer stopped.");
    }
  }

  // Example usage: Start a timer at 120 BPM
  useEffect(() => {
    startBpmTimer(120); // Start the timer on component mount

    // Cleanup function to stop the timer on component unmount
    return () => stopBpmTimer();
  }, []);

  return <div>Timer running at 120 BPM</div>;
}
