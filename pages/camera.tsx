import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import { Camera, CameraType } from '../components/Camera';

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const App = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
const camera = useRef<CameraType>(null);

  return (
    <Wrapper>
      <Camera
          ref={camera}
          aspectRatio="cover"
          numberOfCamerasCallback={setNumberOfCameras}
          errorMessages={{
            noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
            permissionDenied: 'Permission denied. Please refresh and give camera permission.',
            switchCamera:
              'It is not possible to switch camera to different one because there is only one video device accessible.',
            canvas: 'Canvas is not supported.',
          }}
        />
    </Wrapper>
  );
};

export default App;
