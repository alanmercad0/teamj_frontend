import React, { useRef, useState } from "react";

export default function timer() {
  const bar = useRef(0)
  const beat = useRef(0)
    // const [bar, setBar] = useState(0)
 var count = 0
  function startBpmTimer(bpm, callback) {
    // Calculate the time interval for each beat in milliseconds
    const interval = 60000 / bpm;

    // Set a repeating timer
    const timerId = setInterval(() => {
      callback(); // Call the provided callback function on each beat
    }, interval);

    // Return the timerId so you can clear the interval later if needed
    return timerId;
  }

  // Example usage: Start a timer at 120 BPM
  const timer = startBpmTimer(120, () => {
    let { current } = beat;
    console.log(current == 0 && "Bar!");
    beat.current = (current + 1) % 4
    // setBar(bar+1)
  });

  // Stop the timer after 10 seconds (optional)
  setTimeout(() => {
    clearInterval(timer);
    console.log("Timer stopped.");
  }, 10000);
  return <div>timer</div>;
}
