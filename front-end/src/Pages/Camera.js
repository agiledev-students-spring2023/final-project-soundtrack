/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import './Camera.css';
import axios from 'axios';

const videoConstraints = {
  width: 390,
  height: 844,
  facingMode: 'user',
};

function Camera() {
  const [image, setImage] = useState('');
  const webcamRef = React.useRef(null);
  const navigate = useNavigate();

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    axios.post((`http://localhost:5002/Camera/saveImage`), {imageURL: imageSrc})
    .then(response => {
      console.log("handle successful response from backend", response.data.image); // handle successful response from backend
    })
    .catch(error => {
      console.error("fails to send image to backend", error); // handle error from backend
    });
  });

  const retakeImage = () => {
    setImage('');
  };

  return (
    <div className="webcam-container">

      <div className="webcam-img">
        {!image ? (
          <Webcam
            audio={false}
            height={400}
            width={500}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image}/>
        )}
      </div>
      <div className="button-container">
        {image ? (
          <div>
            <button onClick={retakeImage} className="retake-btn">
              X
            </button>
            <button
              onClick={() => {
                navigate('/Location');
              }}
              className="next-btn"
            >
              next
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                navigate('/Post');
              }}
              className="retake-btn"
            >
              Back
            </button>
            <button onClick={capture} className="webcam-btn">
              Capture
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 

export default Camera;