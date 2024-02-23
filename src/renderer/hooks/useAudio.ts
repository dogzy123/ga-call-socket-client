import { useEffect, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useAudio = (src: string) => {
  const [audio] = useState(new Audio(src));
  const [playing, setPlaying] = useState<boolean>(false);

  const play = () => {
    if (!playing) {
      audio.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    audio.volume = 1;
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [playing, audio]);

  return { isPlaying: playing, play };
};
