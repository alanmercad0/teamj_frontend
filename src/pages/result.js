import { useRouter } from "next/router";
import { useEffect, useState, useRef, act, useMemo, Suspense, lazy } from "react";
import { FaArrowRight, FaArrowLeft, FaPlay, FaPause, FaFastBackward, FaHeart } from 'react-icons/fa';
import Header from "../../components/Header";
import Head from "next/head";
import Image from "next/image";
import { KeyboardShortcuts, MidiNumbers, Piano } from "react-piano";
import ChordDisplay from "../../components/ChordDisplay";
import { onAuthChange } from "../../utils/firebaseFunctions";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

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

export default function SliderPage({ id }) {
  const router = useRouter();
  // const { info, id } = router.query;
  const [autoplay, setAutoplay] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isSliderOpen, setSliderOpen] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [recommendationsOnline, setRecommendationsOnline] = useState(false);
  const [userOnline, setUserOnline] = useState(false);
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
  const [liked, setLiked] = useState(false)
  const [uid, setUid] = useState(0)
  const [recommendations, setRecommendations] = useState('');
  const [isLoaded, setLoaded] = useState(false)

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

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUid(user.uid)
        setUserOnline(true);
      } else {
        console.log("no user");
      }
    });
    return () => unsubscribe();
  }, []);

  useMemo(() => {
    async function checkIfLiked() {
      const check = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkIfLiked?id=${uid}&song_id=${id}`
      );
      const isLiked = await check.json();
      if (isLiked) setLiked(true);
    }
    if (uid != 0) checkIfLiked();
  }, [uid]);

  // Parse the chords data passed as a query parameter
  useMemo(() => {
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
      setLoaded(true)
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

  // const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false); // For triggering animation

  const handleClick = () => {
    if (!animate) {
      setLiked(!liked);
      setAnimate(true); // Trigger animation
      setTimeout(() => setAnimate(false), 1000); // Remove animation class after it completes
    } // Toggle liked state
  };

  async function likeSong(){
    if(!liked && !animate){
      setAnimate(true)
      setLiked(true)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likeSong`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          song_id: id,
        }),
      });
      setTimeout(() => setAnimate(false), 1000);
    }
  }

  async function dislikeSong(){
    if(liked && !animate){
      setAnimate(true)
      setLiked(false)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dislikeSong`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          song_id: id,
        }),
      });
      setTimeout(() => setAnimate(false), 1000);
    }
  }
  
  useEffect(() => {
    const getRecommendations = async (title, artist) => {
      if (isLoaded){
        try {
          let user = "No user";
          if (userOnline){
            user = uid;}

          console.log("Fetching recommendations...");
          console.log(user);
          const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/getRecommendations`);
          const params = { title, artist, user};
          url.search = new URLSearchParams(params).toString();
    
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          const recommendationsData = await response.json();
          console.log(recommendationsData)
          const forRecommendations = Object.keys(recommendationsData.track_name).map((key) => ({
            track_name: recommendationsData.track_name[key],
            genre: recommendationsData.track_genre[key],
            artist: recommendationsData.artists[key],
          }));
  
          localStorage.setItem("recommendationsLData", JSON.stringify(forRecommendations));
          
          if (localStorage.getItem("recommendationsLData")) {
            console.log("Recommendations are available.");
            setRecommendationsOnline(true);
          } else {
            console.log("No recommendations found.");
            setRecommendationsOnline(false);
          }
        } 
        catch (error) {
            console.error("Error fetching recommendations:", error);
          setRecommendationsOnline(false);
      }
    }
    };
  
    getRecommendations(currentSong, currentArtist);
  }, [currentSong, currentArtist]);

  const RecommendationsTable = ({ recommendations }) => (
    <div
      className="recommendations-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-center bg-blue-500 text-white py-4">
          Recommendations
        </h3>
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="w-full text-sm bg-white">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left">Track Name</th>
                <th className="p-3 text-left">Genre</th>
                <th className="p-3 text-left">Artist</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(recommendations) && recommendations.length > 0 ? (
                recommendations.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="p-3 text-black">{item.track_name}</td>
                    <td className="p-3 text-black">{item.genre}</td>
                    <td className="p-3 text-black">{item.artist}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    No recommendations available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button
          className="block w-full text-center bg-blue-500 text-white py-3 font-semibold hover:bg-blue-600"
          onClick={handleCloseModal}
        >
          Close
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (recommendationsOnline) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [recommendationsOnline]);

  useEffect(() => {
      if (recommendationsOnline && userOnline) {
        const storedRecommendations = JSON.parse(localStorage.getItem("recommendationsData"));
        console.log("Stored for Storing:", storedRecommendations);
  
        if (storedRecommendations && storedRecommendations.length > 0) {
          // console.log('here')
          storedRecommendations.forEach(async (item, index) => {
            const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setRecommendationHistory`);
            const params = {
              uid,
              title: item.track_name,
              artist: item.artist,
              genre: item.genre,
              popularity: item.popularity
            };
            url.search = new URLSearchParams(params).toString();
  
            try {
              const response = await fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });
  
              if (response.ok) {
                console.log(`Successfully stored recommendation ${index + 1}`);
              } else {
                console.error(`Failed to store recommendation ${index + 1}:`, response.statusText);
              }
            } catch (error) {
              console.error(`Error storing recommendation ${index + 1}:`, error);
            }
          });
        }
      }
    }, [recommendationsOnline, uid, userOnline]);

  const handleRecClick = () => {
    const storedRecommendations = JSON.parse(localStorage.getItem("recommendationsLData"));
    if (recommendationsOnline && Array.isArray(storedRecommendations)) {
      setRecommendations(storedRecommendations);
      setShowRecommendations(true);
    } else {
      setNotification("Recommendations are currently unavailable.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCloseModal = () => {
    setShowRecommendations(false);
  };

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
              } overflow-y-scroll`}
            >
              {isSliderOpen && (
                <div className="relative p-4">
                  <h2 className="font-bold text-lg text-white">Image Slider</h2>
                  <div
                    onClick={toggleSlider}
                    className="sticky flex ml-[80%] -mt-[36px] top-4 w-fit cursor-pointer bg-gray-900 p-2 rounded-full z-10"
                  >
                    <FaArrowLeft className="text-white" size={24} />
                  </div>
                  <ChordDisplay activeChord={currentChord} />
                </div>
              )}
            </div>
  
            <div className="w-full h-full">
              <div className="relative bg-gray-800 grid items-center justify-center h-[10%] min-h-[75px] w-full">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={handleRecClick}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300"
                  >
                    Recommendations
                  </button>
                </div>
                <h2 className="text-xl font-bold text-white text-center">
                  {currentSong} - {currentArtist}
                </h2>
                <h3 className="text-md text-gray-400 text-center">
                  {bpm ? `BPM: ${bpm}` : "BPM not available"}
                </h3>

                {uid && (
                  <div className="absolute w-fit ml-[95%]">
                    <button
                      className={`focus:outline-none ${
                        animate ? "animate-grow" : ""
                      }`}
                      onClick={async () => {
                        if (!liked) {
                          await likeSong();
                        } else {
                          await dislikeSong();
                        }
                      }}
                    >
                      {liked ? <Favorite /> : <FavoriteBorder />}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="py-0">
                  <Piano
                    noteRange={{ first: firstNote, last: lastNote }}
                    playNote={() => {}}
                    stopNote={() => {
                      setActiveNotes(midiChordMap[currentChord]);
                    }}
                    width={innerWidth / 2}
                    activeNotes={activeNotes} // Highlighted notes
                  />
                </div>
                <div className="flex gap-4 text-white mt-10">
                  <FaFastBackward
                    className="cursor-pointer hover:text-primary"
                    size={24}
                    onClick={() => {
                      elapsedTimeRef.current = 0;
                      setElapsedTime(0);
                    }}
                  />
                  {paused ? (
                    <FaPlay
                      className="cursor-pointer hover:text-primary"
                      size={24}
                      onClick={() => setPaused(false)}
                    />
                  ) : (
                    <FaPause
                      className="cursor-pointer hover:text-primary"
                      size={24}
                      onClick={() => setPaused(true)}
                    />
                  )}
                  {/* Autoplay: {autoplay ? "ON" : "OFF"} */}
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
  
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-md z-50">
            {notification}
          </div>
        )}
  
        {/* Recommendations Popup */}
        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-400 font-bold">Recommendations are available!</p>
              <button
                className="mt-4 px-4 py-2 bg-primary text-white rounded"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
  
        {/* Recommendations Table */}
        {showRecommendations && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg">
            <RecommendationsTable recommendations={recommendations} />
              <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-primary text-white rounded">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );    
}