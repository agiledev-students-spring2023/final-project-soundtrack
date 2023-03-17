import React, { useState } from 'react';
import Webcam from 'react-webcam';
import './Camera.css';

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: 'user',
};

const Camera = () => {
  const [image, setImage] = useState('');
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  });

  const retakeImage = () => {
    setImage('');
  };

  return (
    <div className="webcam-container">
      <h1 className="title">Take a pic</h1>
      <div className="webcam-img">
        {!image ? (
          <Webcam
            audio={false}
            height={200}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={220}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} />
        )}
      </div>
      <div>
        {image ? (
          <button onClick={retakeImage} className="webcam-btn">
            Retake Image
          </button>
        ) : (
          <button onClick={capture} className="webcam-btn">
            Capture
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;