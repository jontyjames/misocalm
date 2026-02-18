/**
 * useMicrophone — shared mic access + audio analysis
 * Returns smoothed audio level, frequency bands, and controls.
 * Reusable across all sound-based experiences.
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

const FFT_SIZE = 256;
const SMOOTHING = 0.8;

function getBands(dataArray, bufferLength) {
  const third = Math.floor(bufferLength / 3);
  let low = 0, mid = 0, high = 0;

  for (let i = 0; i < third; i++) low += dataArray[i];
  for (let i = third; i < third * 2; i++) mid += dataArray[i];
  for (let i = third * 2; i < bufferLength; i++) high += dataArray[i];

  const norm = 255 * third;
  return {
    low: low / norm,
    mid: mid / norm,
    high: high / norm,
  };
}

export default function useMicrophone() {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [pitch, setPitch] = useState(0.5);
  const [bands, setBands] = useState({ low: 0, mid: 0, high: 0 });
  const [denied, setDenied] = useState(false);

  const streamRef = useRef(null);
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const dataArrayRef = useRef(null);

  const analyse = useCallback(() => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray) return;

    analyser.getByteFrequencyData(dataArray);

    const len = dataArray.length;
    let sum = 0;
    let weightedSum = 0;
    let totalWeight = 0;

    for (let i = 0; i < len; i++) {
      const val = dataArray[i] / 255;
      sum += val;
      weightedSum += val * i;
      totalWeight += val;
    }

    const level = sum / len;
    const p = totalWeight > 0 ? (weightedSum / totalWeight) / len : 0.5;

    setAudioLevel(level);
    setPitch(p);
    setBands(getBands(dataArray, len));

    rafRef.current = requestAnimationFrame(analyse);
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const context = new AudioContext();
      contextRef.current = context;

      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = SMOOTHING;
      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      setIsListening(true);
      setDenied(false);
      rafRef.current = requestAnimationFrame(analyse);
      return true;
    } catch {
      setDenied(true);
      setIsListening(false);
      return false;
    }
  }, [analyse]);

  const stopListening = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (contextRef.current) {
      contextRef.current.close();
      contextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
    setIsListening(false);
    setAudioLevel(0);
    setPitch(0.5);
    setBands({ low: 0, mid: 0, high: 0 });
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return {
    isListening,
    audioLevel,
    pitch,
    bands,
    denied,
    startListening,
    stopListening,
  };
}
