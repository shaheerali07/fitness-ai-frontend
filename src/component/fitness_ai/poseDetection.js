// src/components/PoseDetection.js
import {
  DrawingUtils,
  FilesetResolver,
  PoseLandmarker,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

import useWindowSize from "react-use/lib/useWindowSize";
import Webcam from "react-webcam"; // Import react-webcam
import { Progress } from "reactstrap";
import { Analysis_exercise } from "../function_set/analysis";

const videoWidth = 710;
const videoHeight = 445;

const PoseDetection = ({
  setStateResultData,
  stateResultData,
  setExerciseResult,
}) => {
  let max_accuracy = 0;
  let prev_accuracy = 0;
  const webcamRef = useRef(null); // React Webcam reference
  const canvasRef = useRef(null); // Canvas reference to draw the landmarks
  const [poseLandmarker, setPoseLandmarker] = useState(null); // State for pose detector
  const [webcamRunning, setWebcamRunning] = useState(false); // State to track webcam running
  const [state_change_exercise, setState_Change_Exercise] = useState(false);
  const [cambtn_classname, setCamBtnClassName] = useState("btn_camera");

  const [accuracy, setAccuracy] = useState(0);
  // const [injuryRisk, setInjuryRisk] = useState(false);
  const [counter, setCounter] = useState(0);
  const [tipSpeaker, setTipSpeaker] = useState("");
  const [tipColor, setTipColor] = useState("text-[#ffc107]");
  const [confletiShow, setConfletiShow] = useState(false);
  const [sumAccuracy, setSumAccuracy] = useState(0);
  const videoRef = useRef(null);
  const [unreal_video_key, setUnrealVideoKey] = useState(0);
  const [unreal_video_url, setUnrealVideoUrl] = useState("");

  const [calc_result, setCalcResult] = useState({
    accuracy: "",
    counter: "",
    state: false,
    injuryRisk: false,
  });
  const [timeTrack, setTimeTrack] = useState(0);
  useEffect(() => {
    setUnrealVideoKey((prev) => prev + 1);
  }, [unreal_video_url]);
  useEffect(() => {
    const new_data = { ...stateResultData, iswebcamEnable: webcamRunning };
    setStateResultData(new_data);
  }, [webcamRunning]);
  useEffect(() => {
    if (!webcamRunning) {
      return;
    }
    if (stateResultData.btnStateStart === true) {
      var myTime = setInterval(() => {
        setTimeTrack((prev) => prev + 1);
      }, 1000);
      var myInterval = setInterval(() => {
        if (webcamRunning) {
          const video = webcamRef.current.video;
          // const video = videoRef.current;
          if (video) {
            // poseRef.current.send({ image: video });
          }
        }
      }, 100);
      return () => {
        clearInterval(myInterval);
        clearInterval(myTime);

        const canvasElement = canvasRef.current;
        if (canvasElement && canvasElement?.getContext("2d")) {
          const canvasCtx = canvasElement.getContext("2d");
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        }
      };
    } else if (stateResultData.btnStateStart === false) {
      setTipSpeaker(
        webcamRunning
          ? "Let's start Exercise!"
          : "Please enable camera to start exercise"
      );
      setTipColor("text-[#ffc107]");
      const currentDay = new Date();
      // const averageAccuracy = sumAccuracy / counter;
      const averageAccuracy = accuracy;
      const newData = {
        year: currentDay.getFullYear(),
        month: currentDay.getMonth() + 1,
        date: currentDay.getDate(),
        day: currentDay.getDay(),
        hour: currentDay.getHours(),
        minute: currentDay.getMinutes(),
        index: stateResultData.kind_exercise.index,
        category: stateResultData.kind_exercise.category,
        exercise: stateResultData.kind_exercise.exercise,
        counter: counter,
        accuracy: averageAccuracy,
        durtime: timeTrack,
      };
      setExerciseResult(newData);
    }
  }, [stateResultData.btnStateStart, webcamRunning]);
  useEffect(() => {
    prev_accuracy = calc_result?.accuracy || 0;

    if (max_accuracy < prev_accuracy) {
      max_accuracy = prev_accuracy;
    }
    // setInjuryRisk(calc_result?.injuryRisk || false);
    setAccuracy(calc_result?.accuracy || 0);
    setCounter(calc_result?.counter || 0);
  }, [calc_result]);
  useEffect(() => {
    const category = stateResultData.kind_exercise.category;
    const exercise = stateResultData.kind_exercise.exercise;
    const index = stateResultData.kind_exercise.index;
    setUnrealVideoUrl(`video/${index}/${category}/${exercise}.mp4`);
    if (state_change_exercise === true) {
      setState_Change_Exercise(false);
    } else if (state_change_exercise === false) {
      setState_Change_Exercise(true);
    }
  }, [stateResultData.kind_exercise]);
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

          const new_calc_data = {
            pose_data: result,
            kind_exercise: stateResultData.kind_exercise,
            state_change_exercise: state_change_exercise,
          };
          setCalcResult(Analysis_exercise(new_calc_data));
        }
      });
    }
  };
  useEffect(() => {
    const newAccuracy = sumAccuracy + max_accuracy;
    setSumAccuracy(newAccuracy);

    let message = "";
    let showConfetti = false;

    // Determine the message and confetti status based on accuracy
    switch (true) {
      case accuracy === 0:
        message = webcamRunning
          ? "Let's start Exercise!"
          : "Please enable camera to start exercise";
        showConfetti = false;
        setTipColor("text-[#ffc107]"); // Yellow color for starting
        break;

      case accuracy < 50:
        message =
          "Incorrect form detected! Please stop and adjust your position to avoid injury";
        showConfetti = false;
        setTipColor("text-[red]"); // Red color for critical issues
        break;

      // case accuracy >= 50 && accuracy < 75:
      //   message =
      //     "Your form needs attention. Try adjusting your posture for better results.";
      //   showConfetti = false;
      //   setTipColor("text-[#ff9800]"); // Orange color for significant deviations
      //   break;

      case accuracy >= 50 && accuracy < 90:
        message = "Almost there! Slight adjustment needed to improve form.";
        showConfetti = false;
        setTipColor("text-[#ffc107]"); // Yellow color for minor deviations
        break;

      case accuracy >= 90:
        message = "Excellent, keep it up!";
        showConfetti = true;
        setTipColor("text-[#4caf50]"); // Green color for ideal zone
        break;

      default:
        message = "Please, more correctly";
        showConfetti = false;
        setTipColor("text-[#ffc107]");
        break;
    }

    // Update state with the computed message and confetti status
    setConfletiShow(showConfetti);
    setTipSpeaker(message);

    // Reset max accuracy after processing
    max_accuracy = 0;
  }, [counter, max_accuracy, sumAccuracy, webcamRunning, accuracy]);
  // Toggle the webcam running state and start detecting poses

  // Continuously detect poses using requestAnimationFrame
  useEffect(() => {
    if (webcamRunning) {
      const interval = setInterval(detectPose, 100); // Call detectPose at regular intervals
      return () => clearInterval(interval); // Clear the interval when unmounted or webcam stops
    }
  }, [webcamRunning, poseLandmarker]);
  const { width, height } = useWindowSize();

  return (
    <>
      {confletiShow && (
        <Confetti
          width={width}
          height={height}
          run={confletiShow}
          onConfettiComplete={() => setConfletiShow(false)}
          Recycle={false}
        />
      )}
      <div className="flex justify-center w-[100vw] h-[70vw] xl:w-[48vw] xl:h-[40vw] border rounded-xl mb-[0.5vw] ml-[1vw]">
        <video
          id="unrealvideo"
          ref={videoRef}
          key={unreal_video_key}
          width="0px"
          height="10px"
          controls
          onEnded={() => {
            const video = document.getElementById("unrealvideo");
            video.currentTime = 0;
            video.play();
          }}
        >
          <source src={unreal_video_url}></source>
        </video>

        <div className="relative w-[90vw] h-[25vw] mt-[2vw] ">
          <p className={`${tipColor} text-[18px]`}> {tipSpeaker}</p>
          <div className="relative mt-[1%] w-[100%] h-[100%] bg-black">
            <div
              className=" bg-black"
              style={{
                position: "relative",
                width: videoWidth,
                height: videoHeight,
              }}
            >
              {webcamRunning && (
                // <Webcam
                //   className=""
                //   audio={false}
                //   ref={webcamRef}
                //   screenshotFormat="image/jpeg"
                // />
                <>
                  <Webcam
                    ref={webcamRef}
                    className=""
                    audio={false}
                    screenshotFormat="image/jpeg"
                    style={{
                      position: "absolute",
                      width: videoWidth,
                      height: videoHeight,
                    }}
                    videoConstraints={{
                      width: videoWidth,
                      height: videoHeight,
                    }}
                  />
                  <canvas ref={canvasRef} className="absolute top-0 left-0 " />
                </>
              )}
            </div>
            {/* <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 bg-black w-[100%]"
              width="770"
              height="480"
            ></canvas> */}
          </div>

          <div className="absolute top-0 left-0 mt-[10%] w-[10%] h-[100%]">
            <Progress
              className="w-[550%] ml-[-250%] mt-[330%] min-[100px]:mt-[310%] md:mt-[260%] xl:mt-[280%]"
              color="info"
              barClassName="my-progress"
              value={accuracy}
              style={{
                transform: "rotate(270deg)",
                height: "5px",
              }}
            />
          </div>

          <div className="flex relative w-[100%] h-[45%] xl:h-[20%] mt-[25vw] xl:mt-[-5%]">
            <button
              className="flex disabled:cursor-not-allowed justify-center items-center ml-[45%] w-[8vw] h-[8vw] mt-[-6%] xl:w-[4vw] xl:h-[4vw] xl:mt-[5%] border rounded-[50%] shadow-xl
                        hover:shadow-[0_0_30px_5px_rgba(0,142,236,0.815)] duration-200"
              onClick={async () => {
                try {
                  await navigator.mediaDevices.getUserMedia({ video: true });
                  if (cambtn_classname === "btn_camera") {
                    setCamBtnClassName("btn_camera_active");
                    setWebcamRunning(true);
                  } else {
                    setCamBtnClassName("btn_camera");
                    setWebcamRunning(false);
                  }
                } catch (err) {
                  alert("Camera is not connected");
                }

                webcamRunning === true
                  ? setWebcamRunning(false)
                  : setWebcamRunning(true);
                // if (cambtn_classname === 'btn_camera') {
                //     setCamBtnClassName('btn_camera_active')
                //     setWebCamEnable(true)
                // }
                // else {
                //     setCamBtnClassName('btn_camera')
                //     setCamBtnSVGClassName('svg_css')
                //     setWebCamEnable(false)
                // }
              }}
            >
              <svg
                className={`${
                  webcamRunning === true ? "fill-[red]" : "fill-[white]"
                } duration-500`}
                fill="currentColor"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
              >
                <path
                  fillRule="evenodd"
                  d="M0 5a2 2 0 012-2h7.5a2 2 0 011.983 1.738l3.11-1.382A1 1 
                            0 0116 4.269v7.462a1 1 0 01-1.406.913l-3.111-1.382A2 2 
                            0 019.5 13H2a2 2 0 01-2-2V5zm11.5 5.175l3.5 1.556V4.269l-3.5 
                            1.556v4.35zM2 4a1 1 0 00-1 1v6a1 1 0 001 
                            1h7.5a1 1 0 001-1V5a1 1 0 00-1-1H2z"
                />
              </svg>
            </button>
          </div>

          <div className="flex justify-between items-center w-[100%] h-[30%] mt-[3%]">
            <p className="text-[#5534A5] mr-[10%] ml-[10%]">
              {accuracy.toFixed(0) + "  %"}
            </p>
            <p className="text-[#5534A5] mr-[10%] ml-[10%]">
              {counter + "  times"}
            </p>
            <p className="text-[#5534A5] mr-[10%] ml-[10%]">
              {timeTrack + "  s"}
            </p>
          </div>
        </div>
      </div>
      {/* <button className="bg-red-400" onClick={toggleWebcam}>
        {webcamRunning ? "Stop Webcam" : "Start Webcam"}
      </button>
      <div
        style={{ position: "relative", width: videoWidth, height: videoHeight }}
      >
        <p className={`${tipColor} text-[18px]`}> {tipSpeaker}</p>

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
      </div> */}
    </>
  );
};

export default PoseDetection;
