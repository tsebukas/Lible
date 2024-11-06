import { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import Button, { type ButtonProps } from './Button';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../i18n';

interface AudioPlayButtonProps extends Omit<ButtonProps, 'onClick' | 'startIcon'> {
  url: string;
  headers?: HeadersInit;
  onPlayError?: (error: Error) => void;  // Muudetud 'onError' -> 'onPlayError'
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const AudioPlayButton = ({
  url,
  headers,
  onPlayError,  // Muudetud 'onError' -> 'onPlayError'
  onPlayStateChange,
  ...buttonProps
}: AudioPlayButtonProps) => {
  const { t } = useLanguage();
  const toast = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const handleError = (error: Error) => {
    console.error('Audio error:', error);
    setIsPlaying(false);
    setIsLoading(false);
    onPlayStateChange?.(false);
    onPlayError?.(error);  // Muudetud 'onError' -> 'onPlayError'
    toast.error(t('sound.playError'));
  };

  const stopPlayback = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    onPlayStateChange?.(false);
  };

  const startPlayback = async () => {
    try {
      setIsLoading(true);

      // Lae helifail
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Failed to load audio: ${response.statusText}`);
      }

      // Konverdi vastus blob-iks
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      // Peata eelmine heli kui mängib
      audioRef.current.pause();

      // Seadista uus heli
      audioRef.current.src = audioUrl;
      
      // Seadista sündmused
      audioRef.current.oncanplaythrough = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          onPlayStateChange?.(true);
        } catch (err) {
          handleError(err instanceof Error ? err : new Error('Failed to play audio'));
        } finally {
          setIsLoading(false);
        }
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        onPlayStateChange?.(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.onerror = () => {
        handleError(new Error('Audio playback error'));
        URL.revokeObjectURL(audioUrl);
      };

    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      await startPlayback();
    }
  };

  return (
    <Button
      {...buttonProps}
      onClick={togglePlay}
      isLoading={isLoading}
      startIcon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      title={isPlaying ? t('sound.pause') : t('sound.play')}
    />
  );
};

export default AudioPlayButton;
