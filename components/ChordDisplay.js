import React, { useState } from "react";
import { MidiNumbers, Piano } from "react-piano";

export default function ChordDisplay({activeChord}) {
  const [activeNotes, setActiveNotes] = useState([]);
  const firstNote = MidiNumbers.fromNote("c4");
  const lastNote = MidiNumbers.fromNote("g5");
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
  const res = [];

  function getMajorMidiArr(pos) {
    return [60 + pos, 64 + pos, 67 + pos];
  }

  const midiChordMap = {
    C: getMajorMidiArr(0),
    "C#": getMajorMidiArr(1),
    D: getMajorMidiArr(2),
    "D#": getMajorMidiArr(3),
    Eb: getMajorMidiArr(4),
    E: getMajorMidiArr(4),
    F: getMajorMidiArr(5),
    "F#": getMajorMidiArr(6),
    G: getMajorMidiArr(7),
    "G#": getMajorMidiArr(8),
    A: getMajorMidiArr(9),
    "A#": getMajorMidiArr(10),
    B: getMajorMidiArr(11),
    N: [0, 0, 0],
  };
  majorChords.map((chord, i) =>
    res.push(
      <div
        className="relative flex flex-col items-center transition ease-in delay-100 h-fit p-3 opacity-50 hover:opacity-100"
        style={activeChord == chord ? { opacity: 1 } : {opacity: 0.5}}
      >
        <div className="h-[100px] w-full" style={{height: '100px'}}>
          <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={() => {}}
            stopNote={() => {
              setActiveNotes(midiChordMap[chord]);
            }}
            activeNotes={midiChordMap[chord]}
          />
        </div>
        {chord} major chord
      </div>
    )
  );
  return (
    <div className="h-[200px]">
      <div className="text-[12px] font-bold text-left">Major Chords</div>
      {res}
    </div>
  );
}
