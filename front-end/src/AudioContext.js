import { createContext } from "react";

const AudioContext = createContext({
  currentAudio: null,
  currentTrack: null, // Add this line
  playing: false,
  setCurrentAudio: () => {},
  setCurrentTrack: () => {}, // Add this line
  setPlaying: () => {},
});

export default AudioContext;


