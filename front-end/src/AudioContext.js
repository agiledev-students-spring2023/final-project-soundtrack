import { createContext } from "react";

const AudioContext = createContext({
  currentAudio: null,
  playing: false,
  setCurrentAudio: () => {},
  setPlaying: () => {},
});

export default AudioContext;


