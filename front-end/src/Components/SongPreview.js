import React, { useContext, useEffect, useRef } from 'react';
import './SongPreview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import AudioContext from '../AudioContext';

const SongPreview = ({ track }) => {
  const { currentAudio, playing, setCurrentAudio, setPlaying } = useContext(AudioContext);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setPlaying(false);
      }
    };
  }, [currentAudio, setCurrentAudio, setPlaying]);

  const playPreview = async (previewUrl) => {
    if (!previewUrl) {
      return;
    }

    if (currentAudio && currentAudio.src !== previewUrl) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlaying(false);
    }

    if (currentAudio && currentAudio.src === previewUrl) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    } else {
      const newAudio = new Audio(previewUrl);
      newAudio.addEventListener('ended', () => {
        setPlaying(false);
      });
      await newAudio.play();
      setCurrentAudio(newAudio);
      setPlaying(true);
      audioRef.current = newAudio;
    }
  };

  const openSpotifyLink = () => {
    window.open(track.external_urls.spotify, '_blank');
  };

  return (
    <div className="song-preview">
      <div className="song-details">
        <div className="song-image-container">
          <img
            className="song-image"
            src={track.album.images[0].url}
            alt={`${track.name} album cover`}
          />
          <div className="song-icon-container">
            <FontAwesomeIcon
              icon={
                currentAudio && currentAudio.src === track.preview_url && playing
                  ? faPause
                  : faPlay
              }
              onClick={() => playPreview(track.preview_url)}
            />
          </div>
        </div>
        <div className="song-info">
          <p className="song-name" onClick={openSpotifyLink}>
            {track.name}
          </p>
          <p className="song-artist">
            {track.artists.map((artist) => artist.name).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SongPreview;


