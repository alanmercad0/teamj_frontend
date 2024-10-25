import Image from "next/image";
import localFont from "next/font/local";
import { KeyboardShortcuts, MidiNumbers, Piano } from "react-piano";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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

  const changeActiveNotes = () => {
    // Example: generate 3 random notes between firstNote and lastNote
    const newActiveNotes = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * (lastNote - firstNote + 1)) + firstNote
    );
    setActiveNotes(newActiveNotes); // Update the active notes
  };

  useEffect(() => {
    // Set an interval to change the active notes every 2 seconds (2000 ms)
    const intervalId = setInterval(() => {
      changeActiveNotes();
    }, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount

  async function getChords(){
    setLoading(true)
    const getInfo = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/process_song?ytb_url=${ytbLink}`
    );
    const info = await getInfo.json()
    console.log(info)
    setLoading(false)
  }


  return (
    <div>
      {/* Head  */}
      <div className="h-screen bg-main_bg bg-gradient-to-bl from-main_bg via-gray-400 to-primary">
        {/* Header  */}
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
                  width: "142px",
                  height: "42px",
                  borderRadius: "25px",
                  borderWidth: "1px",
                  borderColor: "#007AFF",
                }}
                className="hover:bg-primary hover:border-white text-primary hover:text-white"
                onClick={() => router.push("/sign-up")}
              >
                Sign Up
              </button>
              <button
                style={{
                  width: "142px",
                  height: "42px",
                  borderRadius: "25px",
                  borderWidth: "1px",
                }}
                className="bg-primary border-primary hover:border-black hover:bg-black hover:border-white text-white hover:text-primary"
              >
                Log In
              </button>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex text-white font-bold text-2xl self-center w-full justify-center pt-28">
          Start learning your favorite songs on your favorite instrument here!
        </div>

        {/* <div className="select-none">
          <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={() => {}}
            stopNote={() => {}}
            width={1000}
            activeNotes={activeNotes} // These notes are highlighted
            // disabled={true}
          />
        </div> */}

        <div className="w-full justify-center flex pt-10 items-center">
          <input
            placeholder="https://youtube.com/watch?123abc456"
            disabled={loading}
            className="flex w-1/3 justify-center p-2 bg-white self-center rounded-l-xl text-black"
            value={ytbLink}
            onChange={(e) => setYtbLink(e.target.value)}
          />
          <button
            disabled={loading || ytbLink == ''}
            className="flex w-1/8 bg-primary p-2 px-5 rounded-r-xl hover:bg-black "
            onClick={async () => await getChords()}
          >
            {loading ? "Loading..." : "Convert"}
          </button>
        </div>
      </div>
    </div>
  );
}
