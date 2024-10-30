import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Header from "../../components/Header";
import Head from "next/head";

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
// function Timer({ onBpmUpdate }) {
//   const [timerId, setTimerId] = useState(null);
//   const beat = useRef(0);

//   function startBpmTimer(bpm) {
//     const interval = 60000 / bpm; // Calculate interval in milliseconds
//     const id = setInterval(() => {
//       beat.current = (beat.current + 1) % 4; // Cycle through beats
//       onBpmUpdate(beat.current); // Update BPM on each beat
//     }, interval);

//     setTimerId(id); // Store the timer ID
//   }

//   function stopBpmTimer() {
//     if (timerId) {
//       clearInterval(timerId);
//       setTimerId(null);
//       console.log("Timer stopped.");
//     }
//   }

//   useEffect(() => {
//     startBpmTimer(120); // Start timer at 120 BPM on mount

//     // Cleanup function to stop timer on unmount
//     return () => stopBpmTimer();
//   }, []);

//   return <div>Timer running at 120 BPM</div>;
// }

// export async function getServerSideProps({ query }) {
//   const { id } = query;
//   // console.log(id, query,`${process.env.NEXT_PUBLIC_API_URL}/getSongChords?id=${id}`)
//   const getInfo = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/getSongChords?id=${id}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   // const result = await getInfo.json();
//   // console.log(result)
//   let chords = 1
//   return {
//     props: {
//       chords
//     },
//   };
// }

export default function SliderPage() {
  const router = useRouter();
  const { info, id } = router.query;

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
    // if (info) {
    //   try {
    //     const parsedInfo = typeof info === "string" ? JSON.parse(info) : info;
  
    //     console.log("Parsed Info:", parsedInfo); // Log parsed info to check structure
        
    //     // Set the song title and artist from parsed data
    //     setCurrentSong(parsedInfo[0][1] || 'Unknown Song Title');
    //     setCurrentArtist(parsedInfo[0][3][0].alias || 'Unknown Artist');
        
    //     const songBpm = parsedInfo[1][1]?.BPM || null;
    //     setBpm(songBpm);
        
    //     // Check and log chord data
    //     console.log(parsedInfo[2] && Array.isArray(parsedInfo[1]))
    //     const chordsData = parsedInfo[2] && Array.isArray(parsedInfo[1]) ? parsedInfo[2] : [];
    //     console.log("Chords Data:", chordsData); // Log chord data array
  
    //     // Set the chord progression using the specific property
    //     const progression = getChordProgression(chordsData, "chord_simple_pop");
    //     setChordProgression(progression);
    //     console.log("Chord Progression:", progression); // Log chord progression after processing
    //   } catch (error) {
    //     console.error("Error parsing info:", error);
    //   }
    // }
    async function getInfo() {
      const getInfo = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getSongChords?id=${id}`
      );
      const info = await getInfo.json()
      const { chords, bpm } = info;
      setBpm(bpm)
      const progression = getChordProgression(chords, "chord_simple_pop");
      setChordProgression(progression);
    }
    getInfo()
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
    <>
      <Head>
        <title>Chordmate: Practice</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <div>
        <div className="h-screen bg-main_bg bg-gradient-to-bl from-main_bg via-gray-400 to-primary">
          <Header />
          <div className="flex h-full">
            <div
              className={`bg-gray-700 transition-all duration-300 ${
                isSliderOpen ? "w-1/4" : "w-0"
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
              <div className="bg-gray-800 flex flex-col items-center justify-center h-[10%] min-h-[75px] w-full">
                <h2 className="text-xl font-bold text-white">
                  {currentSong} - {currentArtist}
                </h2>
                <h3 className="text-md text-gray-400">
                  {bpm ? `BPM: ${bpm}` : "BPM not available"}
                </h3>{" "}
                {/* Display BPM */}
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
    </>
  );
}
