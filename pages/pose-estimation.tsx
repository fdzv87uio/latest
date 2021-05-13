import React, { useEffect, useRef, useState } from 'react'
// Netpose tensor flow dependencies
import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import '@tensorflow/tfjs-backend-webgl'
// updated webcam component
import Webcam from 'react-webcam'
import * as S from '../styles/pose_estimation.styles'
import WelcomePages from '../layouts/WelcomePages'
import { observer } from 'mobx-react'
// import UserStore from "../stores/UserStore"
import { drawKeypoints } from '../utils/tensorflow-utils'
import { Button } from '@material-ui/core'
import { Canvas } from '../components/Canvas/Canvas.component'
import { OrientationAxis } from '../components/OrientationAxis/OrientationAxis.component'
// use dimensions components
import useDimensions from '../hooks/use-dimensions'

export class DeviceOrientationInfo {
  absolute: boolean = false
  alpha: number | null = null
  beta: number | null = null
  gamma: number | null = null
}

const PoseEstimation = observer(() => {
  // refs for both the webcam and canvas components
  const camRef = useRef(null)
  const canvasRef = useRef(null)

  // Ios permission  hooks
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
  const [deviceOrientation, setDeviceOrientation] =
    useState<DeviceOrientationInfo>()
  //Ios permission methods
  function grantPermissionForDeviceOrientation() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            setPermissionGranted(true)
            window.addEventListener(
              'deviceorientation',
              handleDeviceOrientationEvent
            )
          }
        })
        .catch(console.error)
    } else {
      // handle regular non iOS 13+ devices
      setPermissionGranted(true)
      window.addEventListener('deviceorientation', handleDeviceOrientationEvent)
    }
  }

  function handleDeviceOrientationEvent(ev: DeviceOrientationEvent) {
    setDeviceOrientation({
      absolute: ev.absolute,
      alpha: ev.alpha,
      beta: ev.beta,
      gamma: ev.gamma,
    })
  }

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof window.navigator !== 'undefined'
    ) {
      runPosenet()
    }
  }, [])
  // //load rotation coordinates

  // // // load and run posenet function

  async function runPosenet() {
    const net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 257,
      multiplier: 0.5,
    })

    setInterval(() => {
      detect(net)
    }, 777)
  }

  const detect = async (net) => {
    if (
      typeof camRef.current !== 'undefined' &&
      camRef.current !== null &&
      camRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = camRef.current.video
      const videoWidth = 1200
      const videoHeight = 1200
      console.log(videoWidth)
      // Make detections
      const pose = await net.estimateSinglePose(video)
      console.log(pose)
      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef)
    }
  }

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    if (canvas.current !== null) {
      const ctx = canvas.current.getContext('2d')
      canvas.current.width = videoWidth
      canvas.current.height = videoHeight

      var kp = pose['keypoints']
      drawKeypoints(kp, 0.35, ctx)
    }
  }

  function capture(imgSrc) {
    console.log(imgSrc)
  }

  return (
    <WelcomePages>
      <S.PageWrapper>
        <Webcam
          audio={false}
          height={1200}
          width={1200}
          ref={camRef}
          screenshotFormat="image/jpeg"
        />
        {typeof window !== 'undefined' &&
        typeof window.navigator !== 'undefined' ? (
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              textAlign: 'center',
              zIndex: 9,
              width: 1200,
              height: 1200,
            }}
          />
        ) : null}
        {permissionGranted === true ? (
          <Canvas width={1200} height={1200} dpr={1} isAnimating={true}>
            <OrientationAxis
              beta={deviceOrientation?.beta}
              gamma={deviceOrientation?.gamma}
            ></OrientationAxis>
          </Canvas>
        ) : (
          <Button onClick={grantPermissionForDeviceOrientation}>
            Authorize Orientation
          </Button>
        )}
      </S.PageWrapper>
    </WelcomePages>
  )
})

export default PoseEstimation
