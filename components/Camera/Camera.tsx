import Webcam from "react-webcam";
import React, { useRef } from 'react';

const videoConstraints ={ 
    facingMode: "user"  
}

const Camera = props => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    function drawImge() {
        const video = webcamRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            var ctx = canvas.getContext('2d');

            canvas.width = video.video.videoWidth;
            canvas.height = video.video.videoHeight;

            // We want also the canvas to display de image mirrored
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video.video, 0, 0, canvas.width, canvas.height);
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);
            setTimeout(drawImge, 33);
        }
    }
    setTimeout(drawImge, 33);
    return (
        <>
            <Webcam
                audio={true}
                ref={webcamRef}
                mirrored
                style={{
                    width: "0%", height: "0%",
                }}
                videoConstraints={videoConstraints}
                forceScreenshotSourceSize={true}
               
            />
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%", zIndex:1 }} />
        </>
    )
}

export default Camera