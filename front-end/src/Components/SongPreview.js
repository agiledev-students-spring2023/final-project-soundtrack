import React, { useState } from 'react';
import './SongPreview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const SongPreview = ({ track }) => {
  const [audio, setAudio] = useState(null);
  const [playing, setPlaying] = useState(false);

  const playPreview = async (previewUrl) => {
    if (!previewUrl) {
      return;
    }
    if (audio) {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.play();
        setPlaying(true);
      }
    } else {
      const newAudio = new Audio(previewUrl);
      newAudio.addEventListener('ended', () => {
        setPlaying(false);
      });
      await newAudio.play();
      setAudio(newAudio);
      setPlaying(true);
    }
  };

  const openSpotifyLink = () => {
    window.open(track.external_urls.spotify, '_blank');
  }

  return (
    <div className="song-preview">
      <div className="song-details">
        <div className="song-image-container">
          <img className="song-image" src={track.album.images[0].url} alt={`${track.name} album cover`} />
          <div className="song-icon-container">
            <FontAwesomeIcon icon={playing ? faPause : faPlay} onClick={() => playPreview(track.preview_url)} />
          </div>
        </div>
        <div className="song-info">
          <p className="song-name" onClick={openSpotifyLink}>{track.name}</p>
          <p className="song-artist">{track.artists.map((artist) => artist.name).join(', ')}</p>
        </div>
      </div>
    </div>
  );
}

export default SongPreview;






