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

const videoConstraints = {
  width: 1340,
  height: 1340,
  facingMode: 'user',
}

export class DeviceOrientationInfo {
  absolute: boolean = false
  alpha: number | null = null
  beta: number | null = null
  gamma: number | null = null
}

const PoseEstimation = observer(() => {
  useEffect(() => {
    runPosenet()
  }, [])
  // refs for both the webcam and canvas components
  // const camRef = useRef(null)
  const posenetRef = useRef(null)
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
    const video = canvasRef.current
    const videoWidth = 1340
    const videoHeight = 1340
    console.log(videoWidth)
    // Make detections
    const pose = await net.estimateSinglePose(video)
    console.log(pose)
    drawCanvas(pose, video, videoWidth, videoHeight, posenetRef)
    // if (
    //   typeof camRef.current !== 'undefined' &&
    //   camRef.current !== null &&
    //   camRef.current.video.readyState === 4
    // ) {
    //   // Get Video Properties
    //
    // }
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

  function drawImge() {
    const video = camRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      var ctx = canvas.getContext('2d')

      canvas.width = video.video.videoWidth
      canvas.height = video.video.videoHeight

      // We want also the canvas to display de image mirrored
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video.video, 0, 0, canvas.width, canvas.height)
      ctx.scale(-1, 1)
      ctx.translate(-canvas.width, 0)
      setTimeout(drawImge, 33)
    }
  }
  setTimeout(drawImge, 33)

  console.log(canvasRef.current)
  return (
    <WelcomePages>
      <S.PageWrapper>
        <Webcam
          audio={false}
          ref={camRef}
          mirrored
          style={{ display: 'none', width:1340, height:1340 }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            top:60,
            textAlign: 'center',
            zIndex: 9,
            width: 1340,
            height: 1340,
          }}
        />
        <canvas
          ref={posenetRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            top:60,
            textAlign: 'center',
            zIndex: 9,
            width: 1340,
            height: 1340,
          }}
        />
        {permissionGranted === true ? (
          <Canvas width={1340} height={1340} dpr={1} isAnimating={true}>
            <OrientationAxis
              beta={deviceOrientation?.beta}
              gamma={deviceOrientation?.gamma}
            ></OrientationAxis>
          </Canvas>
        ) : null}
        {permissionGranted === false ? (
          <Button onClick={grantPermissionForDeviceOrientation}>
            Authorize Orientation
          </Button>
        ) : null}
      </S.PageWrapper>
    </WelcomePages>
  )
})

export default PoseEstimation
