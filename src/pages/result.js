import { useRouter } from "next/router";
import { useEffect, useState, useRef, act } from "react";
import { FaArrowRight, FaArrowLeft, FaPlay, FaPause, FaFastBackward } from 'react-icons/fa';
import Header from "../../components/Header";
import Head from "next/head";
import Image from "next/image";
import { KeyboardShortcuts, MidiNumbers, Piano } from "react-piano";

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



export async function getServerSideProps({ query }) {
  const { id } = query;
  // console.log(id)
  return {
    props: {
      id,
    },
  };
}

export default function SliderPage({id}) {
  const router = useRouter();
  // const { info, id } = router.query;

  const [isSliderOpen, setSliderOpen] = useState(true);
  const [isLoaded, setLoaded] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [recommendationsOnline, setRecommendationsOnline] = useState(false);
  const [currentSong, setCurrentSong] = useState('Song Title Placeholder');
  const [currentArtist, setCurrentArtist] = useState('Artist Placeholder');
  const [chordProgression, setChordProgression] = useState([]);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const elapsedTimeRef = useRef(0)
  const [currentChord, setCurrentChord] = useState(null);
  const [bpm, setBpm] = useState(null); // Add BPM state
  const firstNote = MidiNumbers.fromNote('c4');
  const lastNote = MidiNumbers.fromNote('g5');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });
  const initialActiveNotes = [60, 64, 67]
  const [activeNotes, setActiveNotes] = useState([0, 0, 0]);
  const [innerWidth, setInnerWidth] = useState(1)
  const [paused, setPaused] = useState(true)

  function getMajorMidiArr(pos){
    return [60 + pos, 64 + pos, 67 + pos]
  }

  const midiChordMap = {
    "C": getMajorMidiArr(0),
    "C#": getMajorMidiArr(1),
    "D": getMajorMidiArr(2),
    "D#": getMajorMidiArr(3),
    "Eb": getMajorMidiArr(4),
    "E": getMajorMidiArr(4),
    "F": getMajorMidiArr(5),
    "F#": getMajorMidiArr(6),
    "G": getMajorMidiArr(7),
    "G#": getMajorMidiArr(8),
    "A": getMajorMidiArr(9),
    "A#": getMajorMidiArr(10),
    "B": getMajorMidiArr(11),
    N: [0, 0, 0],
  };

  useEffect(()=>{
    if(window){
      setInnerWidth(window.innerWidth)
    }
  },[])

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
      // console.log(info)
      const { chords, bpm, title, artist } = info;
      // console.log(chords)
      const progression = getChordProgression(chords, "chord_simple_pop");
      // console.log(progression)
      setBpm(bpm)
      setChordProgression(progression);
      setCurrentArtist(artist)
      setCurrentSong(title)
      setLoaded(true);
    }
    getInfo()
  }, []);



  // Update elapsed time every second
  useEffect(() => {
    const timer = setInterval(() => {
      // console.log(test.current)
      if(!paused){
        elapsedTimeRef.current += 1000
        setElapsedTime(elapsedTimeRef.current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paused]);

  // Determine current chord based on elapsed time
  useEffect(() => {
    if (chordProgression.length > 0) {
      // console.log(elapsedTimeRef.current, elapsedTime)
      const chord = chordProgression.find(
        (chord) => elapsedTime / 1000 >= chord.start && elapsedTime / 1000 < chord.end
      );
      setCurrentChord(chord ? chord.chord : null);
      setActiveNotes(midiChordMap[chord ? chord.chord : "N"])
    }
  }, [elapsedTime, chordProgression, paused]);

  const handleBpmUpdate = (beat) => {
    setCurrentBeat(beat);
  };

  const toggleSlider = () => {
    setSliderOpen(!isSliderOpen);
  };

  function makeChordArr(){
    const majorChords = [
      "C",
      "C#",
      "D",
      "D#",
      "Eb",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const res = []
    majorChords.map((chord, i) =>
      res.push(
        <div className="transition ease-in delay-100 h-[75px] p-3 opacity-50 hover:opacity-100 hover:scale-105">
          <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={() => {}}
            stopNote={() => {
              setActiveNotes(midiChordMap[chord]);
            }}
            activeNotes={midiChordMap[chord]}
          />
        </div>
      )
    );
    return res
  }
  // console.log(makeChordArr()); 

  useEffect(() => {
    const getRecommendations = async (title, genre, artist) => {
      if (isLoaded) {
        try {
          const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/getRecommendations`);
          const params = { title, genre, artist };
          url.search = new URLSearchParams(params).toString();
  
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          const data = await response.json();
          console.log(data); // Log the data for debugging
  
          const tracks = Object.keys(data.track_name).map((trackId) => ({
            track_name: data.track_name[trackId],
            genre: data.track_genre[trackId],
            artist: data.artists[trackId],
            popularity: data.popularity[trackId],
            similarity: data.similarity[trackId],
            // youtube_link: data.youtube_links[trackId], // Optional
          }));
  
          // Save the recommendations to localStorage
          localStorage.setItem("recommendationsData", JSON.stringify(tracks));
          setRecommendationsOnline(true);
          
        } catch (e) {
          console.error(e); // Handle error
        }
      }
    };
  
    getRecommendations(currentSong, "Hip-Hop/Rap", currentArtist);
  }, [isLoaded]);

  useEffect(() => {
    if (recommendationsOnline) {
      // Show the popup for 5 seconds
      setShowPopup(true);
      const timer = setTimeout(() => {
        setRecommendationsOnline(false);
        setShowPopup(false);  // Hide the popup after 5 seconds
      }, 5000);  // 5000 milliseconds = 5 seconds
      // Cleanup the timer in case the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [recommendationsOnline]);

  return (
    <>
      <Head>
        <title>Chordmate: Practice</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <div className="h-screen">
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
                  <div className="h-[100px] overflow-y-scroll">{makeChordArr()}</div>
                  {/* <div className="transition ease-in delay-100 h-[75px] p-3 opacity-50 hover:opacity-100 hover:scale-105">
                    <Piano
                      noteRange={{ first: firstNote, last: lastNote }}
                      playNote={() => {}}
                      stopNote={() => {
                        setActiveNotes(midiChordMap["C"]);
                      }}
                      activeNotes={midiChordMap["C"]}
                    />
                  </div> */}
                </div>
              )}
            </div>

            <div className="w-full h-full">
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
                {/* {currentChord == "D#" && (
                )} */}
                <div className="py-0">
                  <Piano
                    noteRange={{ first: firstNote, last: lastNote }}
                    playNote={() => {}}
                    stopNote={() => {
                      setActiveNotes(midiChordMap[currentChord]);
                    }}
                    width={innerWidth / 2}
                    activeNotes={activeNotes} // These notes are highlighted
                    // disabled={true}
                  />
                </div>
                <div className="flex gap-4">
                  <FaFastBackward
                    className="text-white cursor-pointer hover:text-primary"
                    size={24}
                    onClick={() => {
                      elapsedTimeRef.current = 0;
                      setElapsedTime(0);
                    }}
                  />
                  {paused ? (
                    <FaPlay
                      className="text-white cursor-pointer hover:text-primary"
                      size={24}
                      onClick={() => setPaused(false)}
                    />
                  ) : (
                    <FaPause
                      className="text-white cursor-pointer hover:text-primary"
                      size={24}
                      onClick={() => setPaused(true)}
                    />
                  )}
                </div>
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
        {/* Pop-up for recommendations */}
        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-400 font-bold">Recommendations are available!</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}