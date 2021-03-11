import * as Tone from "tone";

export const playErrorSound = () => {
  return new Promise((resolve, _) => {
    const synth = new Tone.PolySynth().toDestination();
    const delay = 150;
    const duration = 0.15;
    synth.triggerAttackRelease("C#3", duration);
    setTimeout(resolve, duration * 1000 + delay);
  });
};
