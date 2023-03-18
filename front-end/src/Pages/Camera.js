import React, { useState } from 'react';
import Webcam from 'react-webcam';
import {useNavigate} from "react-router-dom"
import './Camera.css';

const videoConstraints = {
  width: 390,
  height: 844,
  facingMode: 'user',
};

const Camera = () => {
  const [image, setImage] = useState('');
  const webcamRef = React.useRef(null);
  const navigate = useNavigate(); 

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
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
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} />
        )}
      </div>
      <div className = "button-container">
        {image ? (
          <div>
            <button onClick={retakeImage} className="retake-btn">
            X
            </button>
            <button onClick = {() => {
            navigate("/Location")
            }}className = "next-btn">
            next
            </button>
          </div>
        ) : (
          <div>
            <button onClick = {() => {
            navigate("/Post")
            }}className="retake-btn">
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
};

export default Camera;