import { useCallback, useRef, useEffect } from 'react';

export const useSound = (enabled = true) => {
  const audioContext = useRef(null);
  const masterGain = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    
    // Initialize AudioContext on first user interaction or mount
    const initAudio = () => {
      if (!audioContext.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext.current = new AudioContext();
        masterGain.current = audioContext.current.createGain();
        masterGain.current.gain.value = 0.3; // Default volume
        masterGain.current.connect(audioContext.current.destination);
      }
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
    };

    const handleInteraction = () => initAudio();
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
    };
  }, [enabled]);

  const playTone = useCallback((freq, type, duration, volume = 0.5) => {
    if (!enabled || !audioContext.current) return;

    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.current.currentTime);
    
    gain.gain.setValueAtTime(volume, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain.current);

    osc.start();
    osc.stop(audioContext.current.currentTime + duration);
  }, [enabled]);

  const playClick = useCallback(() => {
    // Mechanical click sound (short, high pitch burst)
    playTone(800, 'sine', 0.05, 0.2);
    setTimeout(() => playTone(1200, 'triangle', 0.03, 0.1), 10);
  }, [playTone]);

  const playSuccess = useCallback(() => {
    // "Ding" - high bell sound
    playTone(1200, 'sine', 0.5, 0.3);
    setTimeout(() => playTone(1800, 'sine', 0.6, 0.2), 100);
  }, [playTone]);

  const playError = useCallback(() => {
    // Low thud
    playTone(150, 'sawtooth', 0.15, 0.3);
  }, [playTone]);

  const playVictory = useCallback(() => {
    // Simple arpeggio
    const now = audioContext.current?.currentTime || 0;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'square', 0.3, 0.2), i * 150);
    });
    setTimeout(() => playTone(1046.50, 'sine', 0.8, 0.3), 600);
  }, [playTone]);

  return { playClick, playSuccess, playError, playVictory };
};
