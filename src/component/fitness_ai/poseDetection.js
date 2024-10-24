// src/components/PoseDetection.js
import {
  DrawingUtils,
  FilesetResolver,
  PoseLandmarker,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam"; // Import react-webcam

const videoWidth = 640;
const videoHeight = 480;

const PoseDetection = () => {
  const webcamRef = useRef(null); // React Webcam reference
  const canvasRef = useRef(null); // Canvas reference to draw the landmarks
  const [poseLandmarker, setPoseLandmarker] = useState(null); // State for pose detector
  const [webcamRunning, setWebcamRunning] = useState(false); // State to track webcam running

  // Load the MediaPipe Pose model when the component mounts
  useEffect(() => {
    const loadPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
      setPoseLandmarker(landmarker); // Set the PoseLandmarker once loaded
    };
    loadPoseLandmarker();
  }, []);

  // Start pose detection on webcam video feed
  const detectPose = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4 &&
      poseLandmarker
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext("2d");
      const drawingUtils = new DrawingUtils(canvasCtx);

      // Set the canvas dimensions to match the video
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const startTimeMs = performance.now();

      // Detect poses in the current frame
      poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        if (result.landmarks.length > 0) {
          result.landmarks.forEach((landmarks) => {
            // Draw the detected pose landmarks and connections on the canvas
            drawingUtils.drawLandmarks(landmarks, {
              radius: (data) =>
                DrawingUtils.lerp(data.from?.z ?? 0, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(
              landmarks,
              PoseLandmarker.POSE_CONNECTIONS
            );
          });
        }
      });
    }
  };

  // Toggle the webcam running state and start detecting poses
  const toggleWebcam = () => {
    setWebcamRunning(!webcamRunning);
  };

  // Continuously detect poses using requestAnimationFrame
  useEffect(() => {
    if (webcamRunning) {
      const interval = setInterval(detectPose, 100); // Call detectPose at regular intervals
      return () => clearInterval(interval); // Clear the interval when unmounted or webcam stops
    }
  }, [webcamRunning, poseLandmarker]);

  return (
    <div>
      <h2>MediaPipe Pose Detection with React Webcam</h2>
      <button className="bg-red-400" onClick={toggleWebcam}>
        {webcamRunning ? "Stop Webcam" : "Start Webcam"}
      </button>
      <div
        style={{ position: "relative", width: videoWidth, height: videoHeight }}
      >
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            width: videoWidth,
            height: videoHeight,
          }}
          videoConstraints={{ width: videoWidth, height: videoHeight }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: videoWidth,
            height: videoHeight,
          }}
        />
      </div>
    </div>
  );
};

export default PoseDetection;
