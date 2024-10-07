import Image from "next/image";
import localFont from "next/font/local";
import { KeyboardShortcuts, MidiNumbers, Piano } from "react-piano";
import { useState } from "react";

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
  const firstNote = MidiNumbers.fromNote('c0');
  const lastNote = MidiNumbers.fromNote('c3');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });
  const initialActiveNotes = [41,42,43]
  const [activeNotes, setActiveNotes] = useState(initialActiveNotes);

  const handlePlayNote = (midiNumber) => {
    // Add the played note to activeNotes if it's not already in there
    setActiveNotes((prevActiveNotes) => 
      [...new Set([...prevActiveNotes, midiNumber])]
    );
  };

  const handleStopNote = (midiNumber) => {
    // Only remove the note from activeNotes if it's not in the initialActiveNotes
    setActiveNotes((prevActiveNotes) => 
      initialActiveNotes.includes(midiNumber) 
        ? prevActiveNotes // Do nothing for initially active notes
        : prevActiveNotes.filter(note => note !== midiNumber)
    );
  };
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

        {/* <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={handlePlayNote}
          stopNote={handleStopNote}
          width={1000}
          activeNotes={activeNotes} // These notes are highlighted
        /> */}
        <div className="w-full justify-center flex pt-10 items-center">
          <input className="flex w-1/3 justify-center p-2 bg-white self-center rounded-l-xl text-black" />
          <button className="flex w-1/8 bg-primary p-2 px-5 rounded-r-xl hover:bg-black">
            Convert
          </button>
        </div>
      </div>
    </div>
  );
}
