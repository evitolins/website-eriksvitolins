import { useState, useEffect, useRef } from "react";

type AmplitudeListener = (amplitude: number) => void;

interface AudioAmplitudeHook {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
  isReady: boolean;
  handleClick: () => void; // Function to handle user interaction
}

const useAudioAmplitude = (
  filepath: string,
  amplitudeListener: AmplitudeListener
): AudioAmplitudeHook => {
  const [audio] = useState<HTMLAudioElement>(new Audio(filepath));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(false); // Track user interaction
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const lastSampleTime = useRef<number>(0);

  const sampleRate = 100; // Adjust this to change the sampling rate (in milliseconds)
  const sampleSize = 2048; // Adjust this to change the sample size

  const initializeAnalyser = () => {
    audioContext.current = new window.AudioContext();
    analyser.current = audioContext.current.createAnalyser();
    const source = audioContext.current.createMediaElementSource(audio);

    source.connect(analyser.current);
    analyser.current.connect(audioContext.current.destination);
    analyser.current.fftSize = sampleSize;
  };
  const average = (arr: Uint8Array) =>
    arr.reduce((p, c) => p + c, 0) / arr.length;

  const sampleAmplitude = () => {
    const bufferLength = analyser.current!.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.current!.getByteTimeDomainData(dataArray);

    const amplitude = average(dataArray);
    amplitudeListener(amplitude);
  };

  const handlePlay = () => {
    if (userInteracted) {
      setIsPlaying(true);
      audio.play();
      animationLoop();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    audio.pause();
    if (audioContext.current) audioContext.current.close();
  };

  const animationLoop = () => {
    const currentTime = performance.now();
    if (currentTime - lastSampleTime.current >= sampleRate) {
      sampleAmplitude();
      lastSampleTime.current = currentTime;
    }
    if (isPlaying) requestAnimationFrame(animationLoop);
  };

  useEffect(() => {
    if (!userInteracted) return;
    initializeAnalyser();
    audio.addEventListener("ended", handlePause);
    audio.addEventListener("loadedmetadata", () => setIsReady(true)); // Audio is ready
    return () => {
      handlePause();
      audio.removeEventListener("ended", handlePause);
      audio.removeEventListener("loadedmetadata", () => setIsReady(true));
    };
  }, [audio, userInteracted]);

  const handleClick = () => {
    setUserInteracted(true);
    handlePlay();
  };

  return {
    play: handlePlay,
    pause: handlePause,
    isPlaying,
    isReady,
    handleClick, // Return a function to handle user interaction (e.g., a click)
  };
};

export default useAudioAmplitude;
