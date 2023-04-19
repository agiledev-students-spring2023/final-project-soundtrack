import React from 'react';
import "./Playlist.css"; 
import SongPreview from '../Components/SongPreview';

const Playlist = ({ songs, title }) => {
  return (
    <div className="playlist">
      <h2 className="playlist-title">{title}</h2>
      <div className="playlist-songs">
        {songs && songs.slice(0, 10).map((item, index) => (
          <SongPreview key={index} track={item}/>
        ))}
      </div>
    </div>
  );
}

export default Playlist;


