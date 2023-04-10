import React, { useState } from 'react';
import Webcam from 'react-webcam';
import './Camera.css';

const videoConstraints = {
  width: 390,
  height: 844,
  facingMode: 'user',
};

function Camera({ onBack, onNext }) {
  const [image, setImage] = useState('');
  const webcamRef = React.useRef(null);


  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const retakeImage = () => {
    setImage('');
  };

  const handleNext = () => {
    if (image) {
      onNext(image);
    }
  };

  const handleBack = () => {
    onBack();
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
          <img src={image} alt="Captured" />
        )}
      </div>
      <div className="button-container">
        {image ? (
          <div>
            <button onClick={retakeImage} className="retake-btn">
              X
            </button>
            <button onClick={handleNext} className="next-btn">
              Next
            </button>
          </div>
        ) : (
          <div>
            <button onClick={handleBack} className="retake-btn">
              Song
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