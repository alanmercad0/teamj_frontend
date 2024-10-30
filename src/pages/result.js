import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// Helper function to get chord progression
function getChordProgression(data, chordType) {
  return data.map((chord, index) => ({
    id: index + 1,
    chord: chord[chordType],
    start: chord.start,
    end: chord.end
  }));
}

// Timer component
function Timer({ onBpmUpdate }) {
  const [timerId, setTimerId] = useState(null);
  const beat = useRef(0);

  function startBpmTimer(bpm) {
    const interval = 60000 / bpm; // Calculate interval in milliseconds
    const id = setInterval(() => {
      beat.current = (beat.current + 1) % 4; // Cycle through beats
      onBpmUpdate(beat.current); // Update BPM on each beat
    }, interval);

    setTimerId(id); // Store the timer ID
  }

  function stopBpmTimer() {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
      console.log("Timer stopped.");
    }
  }

  useEffect(() => {
    startBpmTimer(120); // Start timer at 120 BPM on mount

    // Cleanup function to stop timer on unmount
    return () => stopBpmTimer();
  }, []);

  return <div>Timer running at 120 BPM</div>;
}

export default function SliderPage() {
  const router = useRouter();
  const { info } = router.query;

  const [isSliderOpen, setSliderOpen] = useState(true);
  const [currentSong, setCurrentSong] = useState('Song Title Placeholder');
  const [currentArtist, setCurrentArtist] = useState('Artist Placeholder');
  const [chordProgression, setChordProgression] = useState([]);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentChord, setCurrentChord] = useState(null);
  const [bpm, setBpm] = useState(null); // Add BPM state

  // Parse the chords data passed as a query parameter
  useEffect(() => {
    if (info) {
      try {
        const parsedInfo = typeof info === "string" ? JSON.parse(info) : info;
  
        console.log("Parsed Info:", parsedInfo); // Log parsed info to check structure
        
        // Set the song title and artist from parsed data
        setCurrentSong(parsedInfo[0][1] || 'Unknown Song Title');
        setCurrentArtist(parsedInfo[0][3][0].alias || 'Unknown Artist');
        
        const songBpm = parsedInfo[1][1]?.BPM || null;
        setBpm(songBpm);
        
        // Check and log chord data
        const chordsData = parsedInfo[2] && Array.isArray(parsedInfo[1]) ? parsedInfo[2] : [];
        console.log("Chords Data:", chordsData); // Log chord data array
  
        // Set the chord progression using the specific property
        const progression = getChordProgression(chordsData, "chord_simple_pop");
        setChordProgression(progression);
        console.log("Chord Progression:", progression); // Log chord progression after processing
      } catch (error) {
        console.error("Error parsing info:", error);
      }
    }
  }, [info]);

  // Update elapsed time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Determine current chord based on elapsed time
  useEffect(() => {
    if (chordProgression.length > 0) {
      const chord = chordProgression.find(
        (chord) => elapsedTime / 1000 >= chord.start && elapsedTime / 1000 < chord.end
      );
      setCurrentChord(chord ? chord.chord : null);
    }
  }, [elapsedTime, chordProgression]);

  const handleBpmUpdate = (beat) => {
    setCurrentBeat(beat);
  };

  const toggleSlider = () => {
    setSliderOpen(!isSliderOpen);
  };

  return (
    <div>
      <div className="h-screen bg-main_bg bg-gradient-to-bl from-main_bg via-gray-400 to-primary">
        <div className="w-full bg-header_bg sticky p-6 flex flex-row justify-between items-center">
          <div className="text-lg font-bold">CHORDMATE</div>
          <div className="flex flex-row items-center w-1/2 gap-20 justify-end md:gap-10 sm:gap-2">
            <div className="flex flex-row gap-5">
              <div>main</div>
              <div>recommendation</div>
            </div>
            <div className="flex flex-row gap-8 md:gap-5 sm:gap-2">
              <button
                style={{
                  width: '142px',
                  height: '42px',
                  borderRadius: '25px',
                  borderWidth: '1px',
                  borderColor: '#007AFF',
                }}
                className="hover:bg-primary hover:border-white text-primary hover:text-white"
                onClick={() => router.push("/sign-up")}
              >
                Sign Up
              </button>
              <button
                style={{
                  width: '142px',
                  height: '42px',
                  borderRadius: '25px',
                  borderWidth: '1px',
                }}
                className="bg-primary border-primary hover:border-black hover:bg-black hover:border-white text-white hover:text-primary"
              >
                Log In
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-full">
          <div
            className={`bg-gray-700 transition-all duration-300 ${
              isSliderOpen ? 'w-1/4' : 'w-0'
            } overflow-hidden`}
          >
            {isSliderOpen && (
              <div className="relative p-4">
                <h2 className="font-bold text-lg text-white">Image Slider</h2>
                <div
                  onClick={toggleSlider}
                  className="absolute top-4 right-4 cursor-pointer bg-gray-900 p-2 rounded-full z-10"
                >
                  <FaArrowLeft className="text-white" size={24} />
                </div>
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="bg-black flex flex-col items-center justify-center h-40 w-full">
              <h2 className="text-xl font-bold text-white">{currentSong} - {currentArtist}</h2>
              <h3 className="text-md text-gray-400">{bpm ? `BPM: ${bpm}` : "BPM not available"}</h3> {/* Display BPM */}
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <h1 className="mt-4 text-xl">Currently Playing Chord</h1>
              <div>
                {currentChord ? (
                  <strong>Current Chord: {currentChord}</strong>
                ) : (
                  <div>No chord is currently playing.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isSliderOpen && (
          <div
            onClick={toggleSlider}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gray-900 p-2 rounded-full z-10"
          >
            <FaArrowRight className="text-white" size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
