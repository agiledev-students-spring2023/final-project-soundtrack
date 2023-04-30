import React, { useContext, useEffect, useRef } from 'react';
import './SongPreview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import AudioContext from '../AudioContext';

const SongPreview = ({ track }) => {
  const { currentAudio, currentTrack, playing, setCurrentAudio, setCurrentTrack, setPlaying } = useContext(AudioContext);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setCurrentTrack(null); // Reset the current track as well
        setPlaying(false);
      }
    };
  }, [currentAudio, setCurrentAudio, setCurrentTrack, setPlaying]);

  const playPreview = async (previewUrl) => {
    if (!previewUrl) {
      return;
    }

    if (currentAudio && currentTrack !== track) { // Compare the track objects instead of just the preview_url
      currentAudio.pause();
      setCurrentAudio(null);
      setCurrentTrack(null); // Reset the current track as well
      setPlaying(false);
    }

    if (currentAudio && currentTrack === track) { // Compare the track objects instead of just the preview_url
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
        setCurrentTrack(null); // Reset the current track when the audio ends
      });
      await newAudio.play();
      setCurrentAudio(newAudio);
      setCurrentTrack(track); // Set the current track to the clicked track
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
                currentAudio && currentTrack === track && playing 
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


