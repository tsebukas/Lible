import { useState, useRef, FormEvent, useEffect } from 'react';
import { Trash2, Play, Pause, Upload } from 'lucide-react';
import { sounds } from '../services/api';
import { Sound } from '../types/api';

const API_URL = 'http://localhost:8000';

const SoundsView = () => {
  const [soundList, setSoundList] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Lae helinate nimekiri
  const loadSounds = async () => {
    try {
      const data = await sounds.getAll();
      console.log('Loaded sounds:', data);  // Debug log
      setSoundList(data);
    } catch (err) {
      console.error('Error loading sounds:', err);  // Debug log
      setError('Helinate laadimine ebaõnnestus');
    } finally {
      setIsLoading(false);
    }
  };

  // Lae helinate nimekiri komponendi laadimisel
  useEffect(() => {
    loadSounds();
  }, []);

  // Helina üleslaadimine
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.length) {
      setError('Palun valige helifail');
      return;
    }

    const file = fileInputRef.current.files[0];
    if (!file.type.startsWith('audio/')) {
      setError('Ainult helifailid on lubatud');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {  // 2MB
      setError('Fail on liiga suur (max 2MB)');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('sound_file', file);
      formData.append('name', uploadName);

      await sounds.upload(formData);
      await loadSounds();  // Uuenda nimekirja
      setUploadName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading sound:', err);  // Debug log
      setError('Helina üleslaadimine ebaõnnestus');
    } finally {
      setIsUploading(false);
    }
  };

  // Helina kustutamine
  const handleDelete = async (id: number) => {
    try {
      await sounds.delete(id);
      setSoundList(soundList.filter(sound => sound.id !== id));
    } catch (err) {
      console.error('Error deleting sound:', err);  // Debug log
      setError('Helina kustutamine ebaõnnestus');
    }
  };

  // Helina mängimine/peatamine
  const togglePlay = async (id: number) => {
    if (currentlyPlaying === id) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      setError('');  // Tühjenda varasemad vead
      try {
        if (audioRef.current) {
          const token = localStorage.getItem('token');
          
          // Lisa JWT token
          const headers = new Headers();
          headers.append('Authorization', `Bearer ${token}`);
          
          const response = await fetch(`${API_URL}/sounds/${id}`, {
            headers: headers,
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error('Helina laadimine ebaõnnestus');
          }
          
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          // Seadista audio element enne mängimist
          audioRef.current.src = url;
          audioRef.current.oncanplaythrough = async () => {
            try {
              await audioRef.current?.play();
              setCurrentlyPlaying(id);
            } catch (err) {
              console.error('Error playing sound:', err);
              setError('Helina mängimine ebaõnnestus');
            }
          };
        }
      } catch (err) {
        console.error('Error loading sound:', err);  // Debug log
        setError('Helina laadimine ebaõnnestus');
      }
    }
  };

  // Puhasta URL objektid, kui komponent eemaldatakse
  useEffect(() => {
    return () => {
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-content">Helinad</h1>

      {/* Üleslaadimise vorm */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium text-content mb-4">Lisa uus helin</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-content-light">
              Helina nimi
            </label>
            <input
              id="name"
              type="text"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="sound" className="block text-sm font-medium text-content-light">
              Helifail (max 2MB)
            </label>
            <input
              id="sound"
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              className="mt-1 block w-full text-sm text-content-light
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-white
                hover:file:bg-primary-dark"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Upload className="w-5 h-5 mr-2 animate-pulse" />
                Üleslaadimine...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Lae üles
              </>
            )}
          </button>
        </form>
      </div>

      {/* Helinate nimekiri */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-medium text-content mb-4">Helinate nimekiri</h2>
        {isLoading ? (
          <div className="text-content-light">Laadimine...</div>
        ) : soundList.length === 0 ? (
          <div className="text-content-light">Helinaid pole lisatud</div>
        ) : (
          <div className="space-y-2">
            {soundList.map((sound) => (
              <div
                key={sound.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg"
              >
                <span className="text-content">{sound.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePlay(sound.id)}
                    className="p-2 text-content-light hover:text-primary rounded-lg hover:bg-background-dark"
                  >
                    {currentlyPlaying === sound.id ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(sound.id)}
                    className="p-2 text-content-light hover:text-red-500 rounded-lg hover:bg-background-dark"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audio element helinate mängimiseks */}
      <audio
        ref={audioRef}
        onEnded={() => setCurrentlyPlaying(null)}
        onError={(e) => {
          console.error('Audio error:', e);  // Debug log
          setError('Helina mängimine ebaõnnestus');
          setCurrentlyPlaying(null);
        }}
      />
    </div>
  );
};

export default SoundsView;
