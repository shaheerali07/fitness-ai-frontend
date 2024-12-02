import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import * as mediapipePose from "@mediapipe/pose";
import { useCallback, useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import Webcam from "react-webcam";
import { Progress } from "reactstrap";
import { Analysis_exercise } from "../../function_set/analysis";
import "./camera.css";
let max_accuracy = 0;
let prev_accuracy = 0;
function Camera2({
  setStateResultData,
  stateResultData,
  setExerciseResult,
  userPose,
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const poseRef = useRef(null);
  const webcamRef = useRef(null);
  const { width, height } = useWindowSize();
  const [accuracy, setAccuracy] = useState(0);
  // const [injuryRisk, setInjuryRisk] = useState(false);
  const [counter, setCounter] = useState(0);
  const [timeTrack, setTimeTrack] = useState(0);
  const [sumAccuracy, setSumAccuracy] = useState(0);
  const [tipColor, setTipColor] = useState("text-[#ffc107]");
  const [cambtn_classname, setCamBtnClassName] = useState("btn_camera");
  const [tipSpeaker, setTipSpeaker] = useState("");
  const [calc_result, setCalcResult] = useState({
    accuracy: "",
    counter: "",
    state: false,
    injuryRisk: false,
  });

  const [state_change_exercise, setState_Change_Exercise] = useState(false);
  const [iswebcamEnable, setWebCamEnable] = useState(false);
  const [confletiShow, setConfletiShow] = useState(false);
  const [unreal_video_key, setUnrealVideoKey] = useState(0);
  const [unreal_video_url, setUnrealVideoUrl] = useState("");
  // function calculateAccuracy(currentPosition, desiredPosition) {
  //   const distance = Math.sqrt(
  //     Math.pow(currentPosition.x - desiredPosition.x, 2) +
  //       Math.pow(currentPosition.y - desiredPosition.y, 2) +
  //       Math.pow(currentPosition.z - desiredPosition.z, 2)
  //   );
  //   const accuracy = Math.max(0, 100 - distance * 100);
  //   return accuracy;
  // }
  //for testing purpose
  // const onResults = useCallback(
  //   (results) => {
  //     const canvasElement = canvasRef.current;
  //     const webcamElement = webcamRef.current.video;
  //     const canvasCtx = canvasElement?.getContext("2d");

  //     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  //     canvasCtx.drawImage(
  //       webcamElement,
  //       0,
  //       0,
  //       canvasElement.width,
  //       canvasElement.height
  //     );

  //     if (results.poseLandmarks) {
  //       drawConnectors(
  //         canvasCtx,
  //         results.poseLandmarks,
  //         mediapipePose.POSE_CONNECTIONS,
  //         { color: "aqua", lineWidth: 1.5 }
  //       );

  //       drawLandmarks(canvasCtx, results.poseLandmarks, {
  //         color: "gray",
  //         lineWidth: 0.1,
  //         fillColor: "aqua",
  //         radius: "1",
  //       });
  //     }

  //     const landmark = results.poseLandmarks;
  //     if (landmark) {
  //       // Simplified logic for "hi" gesture detection
  //       const rightWrist = landmark[16];
  //       const rightElbow = landmark[14];
  //       const rightShoulder = landmark[12];

  //       if (
  //         rightWrist &&
  //         rightElbow &&
  //         rightShoulder &&
  //         rightWrist.y < rightElbow.y &&
  //         rightElbow.y < rightShoulder.y &&
  //         rightWrist.x > rightElbow.x
  //       ) {
  //         const currentPosition = rightWrist; // Use the actual landmark position
  //         const desiredPosition = { x: 0.5, y: 0.5, z: 0 }; // Example desired position

  //         setCalcResult({
  //           accuracy: calculateAccuracy(currentPosition, desiredPosition),
  //           counter: 1,
  //           state: "hi",
  //         });

  //         setTipSpeaker("Hi gesture detected successfully! Test passed.");
  //         setTipColor("text-[#4caf50]"); // Green for success
  //         setConfletiShow(true);
  //       } else {
  //         setTipSpeaker("Raise your right hand for the test.");
  //         setTipColor("text-[red]"); // Red for error
  //         setConfletiShow(false);
  //       }
  //     }
  //   },
  //   [setCalcResult, setTipSpeaker, setTipColor, setConfletiShow]
  // );
  const onResults = useCallback(
    (results) => {
      const canvasElement = canvasRef.current;
      const webcamElement = webcamRef.current.video;
      // const videoElement = videoRef.current;

      const canvasCtx = canvasElement?.getContext("2d");

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        webcamElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.poseLandmarks) {
        drawConnectors(
          canvasCtx,
          results.poseLandmarks,
          mediapipePose.POSE_CONNECTIONS,
          { color: "aqua", lineWidth: 1.5 }
        );

        drawLandmarks(
          canvasCtx,
          results.poseLandmarks,
          // [results.poseLandmarks[25], results.poseLandmarks[23], results.poseLandmarks[11]],
          {
            color: "gray",
            lineWidth: 0.1,
            fillColor: "aqua",
            radius: "1",
          }
        );
      }

      const landmark = results.poseLandmarks;
      if (landmark) {
        // let state_pose = landmark.every(
        //   ({ x, y }) => x >= 0 && x <= 1 && y >= 0 && y <= 1
        // );
        let state_pose = true;
        for (let i = 0; i < 33; i++) {
          if (
            landmark[i].x > 1 ||
            landmark[i].x < 0 ||
            landmark[i].y > 1 ||
            landmark[i].y < 0
          ) {
            state_pose = false;
          }
        }

        if (state_pose === true) {
          // setTipSpeaker("Please correct your posture to avoid injury");
          const new_calc_data = {
            pose_data: results,
            kind_exercise: stateResultData.kind_exercise,
            state_change_exercise: state_change_exercise,
          };

          setCalcResult(Analysis_exercise(new_calc_data));
        } else {
          setTipSpeaker("Your entire body must be in camera");
        }
      }
    },
    [stateResultData.kind_exercise, state_change_exercise]
  );

  useEffect(() => {
    userPose.onResults(onResults);
    poseRef.current = userPose;
  }, [onResults, userPose]);

  useEffect(() => {
    if (!iswebcamEnable) {
      return;
    }
    if (stateResultData.btnStateStart === true) {
      videoRef.current.play();
      var myTime = setInterval(() => {
        setTimeTrack((prev) => prev + 1);
      }, 1000);
      var myInterval = setInterval(() => {
        if (iswebcamEnable) {
          const video = webcamRef.current.video;
          // const video = videoRef.current;
          if (video) {
            poseRef.current.send({ image: video });
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
        iswebcamEnable
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
  }, [stateResultData.btnStateStart, iswebcamEnable]);

  useEffect(() => {
    const category = stateResultData.kind_exercise.category;
    const exercise = stateResultData.kind_exercise.exercise;
    const index = stateResultData.kind_exercise.index;
    setUnrealVideoUrl(`video/${index}/${category}/${exercise}.mp4`);
    // setUnrealVideoUrl(`video/Exercise_2/Stretches/abdominal-stretch.mp4`)
    if (state_change_exercise === true) {
      setState_Change_Exercise(false);
    } else if (state_change_exercise === false) {
      setState_Change_Exercise(true);
    }
  }, [stateResultData.kind_exercise]);

  useEffect(() => {
    userPose.onResults(onResults);
    poseRef.current = userPose;
    // return () => {
    //   poseRef.current.close();
    // };
  }, [state_change_exercise, onResults, userPose]);

  useEffect(() => {
    const new_data = { ...stateResultData, iswebcamEnable: iswebcamEnable };
    setStateResultData(new_data);
  }, [iswebcamEnable]);

  useEffect(() => {
    setUnrealVideoKey((prev) => prev + 1);
  }, [unreal_video_url]);

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
    const newAccuracy = sumAccuracy + max_accuracy;
    setSumAccuracy(newAccuracy);

    let message = "";
    let showConfetti = false;

    // Determine the message and confetti status based on accuracy
    switch (true) {
      case accuracy === 0:
        message = iswebcamEnable
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
  }, [counter, max_accuracy, sumAccuracy, iswebcamEnable, accuracy]);

  useEffect(() => {
    if (
      !iswebcamEnable ||
      (stateResultData.btnStateStart && canvasRef.current)
    ) {
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement?.getContext("2d");
      canvasCtx &&
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      return;
    }
    const interval = setInterval(() => {
      const canvasElement = canvasRef?.current;
      const webcamElement = webcamRef?.current?.video;
      const canvasCtx = canvasElement?.getContext("2d");
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
          webcamElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
      }
    }, 50);
    return () => clearInterval(interval);
  }, [iswebcamEnable, stateResultData.btnStateStart]);

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
            <div className="w-[10%] h-[100%] ">
              {iswebcamEnable && (
                <>
                  <Webcam
                    className=""
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 bg-black w-[100%]"
                    width="770"
                    height="480"
                  ></canvas>
                </>
              )}
            </div>
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
                    setWebCamEnable(true);
                  } else {
                    setCamBtnClassName("btn_camera");
                    setWebCamEnable(false);
                  }
                } catch (err) {
                  alert("Camera is not connected");
                }

                iswebcamEnable === true
                  ? setWebCamEnable(false)
                  : setWebCamEnable(true);
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
                  iswebcamEnable === true ? "fill-[red]" : "fill-[black]"
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
    </>
  );
}

export default Camera2;
