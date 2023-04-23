import React, { useEffect, useState } from 'react';
import axios from "axios";

const SpotifyPlayer = ({ track }) => {
  const [player, setPlayer] = useState(null);
  const [token, setToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  const loadSpotifyPlaybackSDK = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Spotify Web Playback SDK'));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (token && !window.Spotify) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        initSpotifyPlayer();
      };
      
      loadSpotifyPlaybackSDK();
    } else if (token) {
      initSpotifyPlayer();
    }
  }, [token]);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/auth/get-access-token`);
      console.log(response.data.access_token); 
      setToken(response.data.access_token);
    };
    fetchToken();
  }, []);

  const initSpotifyPlayer = () => {
    if (!token) {
      return;
    }

    const playerInstance = new window.Spotify.Player({
      name: 'Your Spotify Player',
      getOAuthToken: (cb) => {
        cb(token);
      },
    });

    playerInstance.connect().then(() => {
      setPlayer(playerInstance);
    });

    playerInstance.addListener('player_state_changed', () => {
      console.log('Player state changed');
    });

    playerInstance.addListener('ready', ({ device_id }) => {
        console.log('Device ID:', device_id);
        setDeviceId(device_id);
      });
  };


  const playTrack = (trackUri) => {
    if (player && token && deviceId) {
      console.log('Playing track:', trackUri);
  
      player._options.getOAuthToken((accessToken) => {
        axios.put(
          'https://api.spotify.com/v1/me/player/play',
          { uris: [trackUri] },
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { device_id: deviceId }, // Add the device ID here
          }
        ).then(() => {
          console.log('Track playing:', trackUri);
        }).catch((error) => {
          console.error('Error playing track:', error);
        });
      });
    }
  };
  
useEffect(() => {
if (player && track) {
playTrack(track);
}
}, [player, track]);

const playPause = () => {
    if (player) {
      player.getCurrentState().then((state) => {
        if (state && !state.paused) {
          player.pause();
        } else {
          if (track) {
            playTrack(track);
          } else {
            player.resume();
          }
        }
      });
    }
  };
  

return (
<div className = "no data message">
<button onClick={playPause}>Play/Pause</button>

</div>
);
};

export default SpotifyPlayer;

