import Image from "next/image";
import localFont from "next/font/local";
import { KeyboardShortcuts, MidiNumbers, Piano } from "react-piano";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Head from "next/head";
import { onAuthChange } from "../../utils/firebaseFunctions";
import YouTube from "react-youtube";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [activeNums, setActiveNums] = useState([41,42,45])
  const router = useRouter()
  const firstNote = MidiNumbers.fromNote('c3');
  const lastNote = MidiNumbers.fromNote('c6');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });
  const initialActiveNotes = [60, 64, 67]
  const [activeNotes, setActiveNotes] = useState(initialActiveNotes);
  const [loading, setLoading] = useState(false)
  const [ytbLink, setYtbLink] = useState('')
  const [uid, setUid] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState();
  const [isVisible, setIsVisible] = useState(); // Tracks animation state
  const [codeForPlayer, setCodeForPlayer] = useState(false)
  const [songId, setSongId] = useState(false);
  // const [songId, setSongId] = useState('')

  // [62, 65, 69] Dmin
  // [64, 68, 71] Emaj

  // const [counter, setCounter] = useState(0)

  // useEffect(()=>{
  //   if (counter < 60) setCounter(counter + 1);
  // },[counter])


  // const handlePlayNote = (midiNumber) => {
  //   // console.log(midiNumber)
  //   if(counter == 20){
  //     setActiveNotes([60, 64, 67])
  //   }
  //   else if(counter == 40){
  //     setActiveNotes([62, 65, 69])
  //   }
  //   else if(counter == 60){
  //     setActiveNotes([64, 68, 71])
  //   }
  //   // Add the played note to activeNotes if it's not already in there
  //   // setActiveNotes((prevActiveNotes) => 
  //   //   [...new Set([...prevActiveNotes, midiNumber])]
  //   // );
  // };

  // const handleStopNote = (midiNumber) => {
  //   // console.log(midiNumber)
  //   if(counter == 20){
  //     setActiveNotes([60, 64, 67])
  //   }
  //   else if(counter == 40){
  //     setActiveNotes([62, 65, 69])
  //   }
  //   else if(counter == 60){
  //     setActiveNotes([64, 68, 71])
  //   }
  //   // return
  //   // Only remove the note from activeNotes if it's not in the initialActiveNotes
  //   // setActiveNotes((prevActiveNotes) => 
  //   //   initialActiveNotes.includes(midiNumber) 
  //   //     ? prevActiveNotes // Do nothing for initially active notes
  //   //     : prevActiveNotes.filter(note => note !== midiNumber)
  //   // );
  // };

  // const changeActiveNotes = () => {
  //   // Example: generate 3 random notes between firstNote and lastNote
  //   const newActiveNotes = Array.from({ length: 3 }, () =>
  //     Math.floor(Math.random() * (lastNote - firstNote + 1)) + firstNote
  //   );
  //   setActiveNotes(newActiveNotes); // Update the active notes
  // };

  // useEffect(() => {
  //   // Set an interval to change the active notes every 2 seconds (2000 ms)
  //   const intervalId = setInterval(() => {
  //     changeActiveNotes();
  //   }, 1000);

  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUid(user.uid)
      } else {
        console.log("no user");
      }
    });
    return () => unsubscribe();
  }, []);

  function checkLink(link) {
    const split = link.split("v=");
    const youtubeLink = split[0];
    const code = split[1];
    const codeRegex = /^[a-zA-Z0-9_-]{11}$/;
    if(split.length > 2) return
    if (youtubeLink != "https://www.youtube.com/watch?") {
      setCodeForPlayer(false);
      setError('Invalid link. The link must have the following format: https://www.youtube.com/watch?v=12345678abc')
      return false;
    }
    if (!codeRegex.test(code)) {
      setCodeForPlayer(false);
      setError('Invalid youtube code. Please make sure the given youtube link is correct.')
      return false;
    }

    setCodeForPlayer(code);
    return true
  }

  async function getChords() {
    setError('')
    setLoading(true);
    try {
      if(ytbLink == '') {
        setError('Link cannot be blank.')
        return
      }
      if(!checkLink(ytbLink)) return

      const getInfo = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/process_song?ytb_url=${ytbLink}`
      );
      const info = await getInfo.json();

      if(info.Error){
        setLoading(false)
        return
      }

      const { id } = info;
      if (uid != "") {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addToHistory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid,
            song_id: id,
          }),
        });
      }

      openModal()
      pauseVideo()
      setSongId(id)
      // console.log(id)
      // Navigate to the new page with info as query parameters
      // router.push(`/result?id=${id}`);
    } catch (error) {
      setError('An error occurred. Please try again!')
      console.error("Error fetching chords:", error);
    } finally {
      setLoading(false);
    }
  }

  // console.log(uid)
  const openModal = () => {
    setIsModalOpen(true); // Mount the modal
    setTimeout(() => setIsVisible(true), 10); // Trigger fade-in animation
  };

  const closeModal = () => {
    setIsVisible(false); // Trigger fade-out animation
    setTimeout(() => setIsModalOpen(false), 300); // Wait for animation to finish before unmounting
  };

  const playerRef = useRef(null);

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  // console.log(playerRef.current.getPlayerState())

  return (
    <>
      <Head>
        <title>Chordmate: Home</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <div>
        {/* Head  */}
        <div className="h-dvh pb-[50px] bg-main_bg bg-gradient-to-bl from-main_bg via-gray-400 to-primary">
          <Header />
          {/* Modal */}
          {isModalOpen && (
            <>
              {/* Overlay */}
              <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-[999] ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={closeModal} // Close modal on clicking overlay
              ></div>

              {/* Modal Content */}
              <div
                className={`fixed inset-0 flex items-center justify-center transition-all duration-300 transform z-[1000] ${
                  isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              >
                <div className="bg-white p-6 rounded shadow-lg relative text-black">
                  <h2 className="text-lg font-semibold">
                    Chords have been gathered!
                  </h2>
                  {/* <p className="mt-4">Click here to practice your song</p> */}
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                  <button
                    className="w-full rounded-full bg-primary py-[8px] text-white font-bold mt-[30px] transition duration-300 hover:bg-black"
                    onClick={() => router.push(`/result?id=${songId}`)}
                  >
                    Practice!
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Text */}
          <div className="flex text-white font-bold text-2xl self-center w-full justify-center pt-28">
            Enter a youtube link and
          </div>
          {/* <div className="bg-primary w-fit justify-self-center"> */}
            <div className="flex text-white font-bold text-2xl self-center w-full justify-center ">
              find your chords!
            </div>
          {/* </div> */}
          <div className="w-full justify-center flex pt-10 items-center">
            <input
              placeholder="https://youtube.com/watch?v=12345678abc"
              disabled={loading}
              className="flex w-1/3 justify-center p-2 bg-white self-center rounded-l-xl text-black"
              value={ytbLink}
              onChange={(e) => {
                if (error) setError("");
                if (codeForPlayer) setCodeForPlayer(false);
                if (songId) setSongId(false);
                setYtbLink(e.target.value);
              }}
            />
            {!songId ? (
              <button
                disabled={loading}
                className="flex w-1/8 bg-primary p-2 px-5 rounded-r-xl transition duration-300 hover:bg-black"
                onClick={async () => await getChords()}
              >
                {loading ? "Loading..." : "Convert"}
              </button>
            ) : (
              <button
                disabled={loading}
                className="flex w-1/8 bg-primary p-2 px-5 rounded-r-xl transition duration-300 hover:bg-black"
                onClick={() => router.push(`/result?id=${songId}`)}
              >
                Practice &rarr;
              </button>
            )}
          </div>
          {error && (
            <div className="text-center w-full text-red-500 pt-[10px] font-[500]">
              {error}
            </div>
          )}
          <YouTube
            videoId={codeForPlayer}
            onReady={onReady}
            opts={{
              playerVars: {
                autoplay: 1,
                modestbranding: 1, // Minimize YouTube branding
                fs: 0, // Disable the fullscreen button
              },
            }}
            className={
              "video-container w-full flex justify-center pt-[20px] transition duration-150 ease-in-out " +
              (codeForPlayer ? "scale-100 " : "scale-0 ")
            }
          />
        </div>
      </div>
    </>
  );
}
